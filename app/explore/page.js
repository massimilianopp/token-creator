"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useGSAP, DURATIONS, EASE_CONFIGS } from "@/hooks/useGSAP";
import { useNetwork } from "@/components/NetworkContext";

const TABS = [
  { key: "trending", label: "Trending" },
  { key: "top", label: "Top" },
  { key: "gainers", label: "Gainers" },
  { key: "losers", label: "Losers" }
];

export default function ExplorePage() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdate, setLastUpdate] = useState(null);
  const [searchedToken, setSearchedToken] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState(0);
  
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const progressRef = useRef(null);
  const { gsap } = useGSAP();
  const { isDevnet } = useNetwork();

  // Check if query is a valid Solana mint address (32-44 characters, alphanumeric + certain special chars)
  const isValidMintAddress = (query) => {
    const mintPattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return mintPattern.test(query.trim());
  };

  // Search for specific token by mint address using Helius DAS API
  const searchTokenByMint = async (mintAddress) => {
    try {
      setSearchLoading(true);
      setSearchedToken(null);

      // Determine the correct Helius endpoint based on network
      const heliosApiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
      const baseUrl = isDevnet() 
        ? `https://devnet.helius-rpc.com/?api-key=${heliosApiKey}`
        : `https://mainnet.helius-rpc.com/?api-key=${heliosApiKey}`;

      // Call Helius DAS API
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getAsset",
          params: { id: mintAddress }
        })
      });

      if (!response.ok) {
        throw new Error('Helius API request failed');
      }

      const data = await response.json();

      if (data.error) {
        setSearchedToken("not_found");
        return;
      }

      const asset = data.result;
      
      // Extract token information from Helius DAS response
      const tokenData = {
        address: mintAddress,
        name: asset.content?.metadata?.name || "Unknown Token",
        symbol: asset.content?.metadata?.symbol || "???",
        decimals: asset.token_info?.decimals || 9,
        logo: asset.content?.links?.image || null,
        supply: asset.token_info?.supply || 0,
        holders: 0, // Helius DAS doesn't provide holder count
        price: asset.token_info?.price_info?.price_per_token || 0,
        marketCap: 0, // Calculate if needed
        volume24h: 0, // Not available in DAS API
        priceChange24h: 0, // Not available in DAS API
        source: "helius"
      };

      // Calculate market cap if price and supply are available
      if (tokenData.price && tokenData.supply) {
        const totalSupply = tokenData.supply / Math.pow(10, tokenData.decimals);
        tokenData.marketCap = tokenData.price * totalSupply;
      }

      setSearchedToken(tokenData);
    } catch (err) {
      console.error("Error searching token:", err);
      setSearchedToken("error");
    } finally {
      setSearchLoading(false);
    }
  };

  // Helper function to get asset metadata from Helius
  const getAssetMetadata = async (tokenAddress) => {
    try {
      const heliosApiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
      const baseUrl = isDevnet() 
        ? `https://devnet.helius-rpc.com/?api-key=${heliosApiKey}`
        : `https://mainnet.helius-rpc.com/?api-key=${heliosApiKey}`;

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getAsset",
          params: { id: tokenAddress }
        })
      });

      if (!response.ok || response.error) {
        return null;
      }

      const data = await response.json();
      if (data.error || !data.result) {
        return null;
      }

      const asset = data.result;
      return {
        name: asset.content?.metadata?.name || null,
        symbol: asset.content?.metadata?.symbol || null,
        logo: asset.content?.links?.image || null
      };
    } catch (err) {
      return null;
    }
  };

  // Helper function to get market data from DexScreener
  const getMarketData = async (tokenAddress) => {
    try {
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`);
      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      const pairs = data?.pairs?.filter(p => p.chainId === "solana") || [];
      
      // Get pair with highest liquidity
      const bestPair = pairs.sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];
      
      if (!bestPair) {
        return null;
      }

      return {
        price: parseFloat(bestPair.priceUsd) || 0,
        marketCap: bestPair.marketCap || bestPair.fdv || 0,
        volume24h: bestPair.volume?.h24 || 0,
        priceChange24h: bestPair.priceChange?.h24 || 0
      };
    } catch (err) {
      return null;
    }
  };

  const fetchTokens = async () => {
    try {
      setError(null);
      
      // Fetch trending tokens from DexScreener
      const topTokensRes = await fetch("https://api.dexscreener.com/token-boosts/top/v1");

      if (!topTokensRes.ok) {
        throw new Error("Failed to fetch token data");
      }

      const topTokensData = await topTokensRes.json();

      // Parse response as array directly and filter for Solana tokens only
      const solanaTokens = Array.isArray(topTokensData) 
        ? topTokensData.filter(token => token.chainId === "solana")
        : [];

      // Take first 20 Solana tokens
      const limitedTokens = solanaTokens.slice(0, 20);

      // Enhance tokens with metadata and market data in parallel
      const enhanceTokenPromises = limitedTokens.map(async (token) => {
        // Fetch metadata and market data in parallel
        const [metadata, marketData] = await Promise.all([
          getAssetMetadata(token.tokenAddress),
          getMarketData(token.tokenAddress)
        ]);
        
        return {
          address: token.tokenAddress,
          name: metadata?.name || token.description?.split(' ')[0] || "Unknown",
          symbol: metadata?.symbol || "???",
          price: marketData?.price || 0,
          marketCap: marketData?.marketCap || 0,
          volume24h: marketData?.volume24h || 0,
          priceChange24h: marketData?.priceChange24h || 0,
          logo: metadata?.logo || null,
          totalAmount: token.totalAmount || 0,
          url: token.url || null
        };
      });

      // Wait for all tokens to be enhanced
      const enhancedResults = await Promise.allSettled(enhanceTokenPromises);
      const enhancedTokens = enhancedResults
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

      setTokens(enhancedTokens);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Initial fetch and auto-refresh every 30s with progress bar
  useEffect(() => {
    fetchTokens();
    
    const refreshInterval = setInterval(fetchTokens, 30000);
    
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setRefreshProgress(prev => {
        const newProgress = prev + (100 / 300); // 30s = 300 intervals of 100ms
        if (newProgress >= 100) {
          return 0; // Reset when complete
        }
        return newProgress;
      });
    }, 100);
    
    return () => {
      clearInterval(refreshInterval);
      clearInterval(progressInterval);
    };
  }, []);

  // Handle search query changes
  useEffect(() => {
    if (searchQuery.trim() && isValidMintAddress(searchQuery)) {
      const timeoutId = setTimeout(() => {
        searchTokenByMint(searchQuery.trim());
      }, 500); // Debounce search
      return () => clearTimeout(timeoutId);
    } else {
      setSearchedToken(null);
    }
  }, [searchQuery]);

  // Handle search submit (clear search field)
  const handleSearch = () => {
    if (searchQuery.trim() && !isValidMintAddress(searchQuery)) {
      // Filter by name/symbol - don't clear
      return;
    }
    // Clear search after mint address search
    if (isValidMintAddress(searchQuery)) {
      setTimeout(() => setSearchQuery(""), 100);
    }
  };

  // GSAP animations
  useEffect(() => {
    if (!loading && tokens.length > 0 && listRef.current) {
      try {
        const items = listRef.current.children;
        gsap.fromTo(items, 
          { 
            opacity: 0, 
            y: 20, 
            scale: 0.95 
          },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: DURATIONS.fast,
            ease: EASE_CONFIGS.smooth,
            stagger: 0.05
          }
        );
      } catch (e) {
        // Fallback if GSAP fails
      }
    }
  }, [loading, tokens, gsap]);

  // Filter and sort tokens based on active tab
  const filteredAndSortedTokens = tokens
    .filter(token => {
      // If we're searching by mint address, don't filter regular tokens
      if (isValidMintAddress(searchQuery)) return true;
      
      return (
        token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => {
      switch (activeTab) {
        case "top":
          return b.marketCap - a.marketCap;
        case "gainers":
          return b.priceChange24h - a.priceChange24h;
        case "losers":
          return a.priceChange24h - b.priceChange24h;
        case "trending":
        default:
          // Default DexScreener order (by totalAmount from boost data)
          return (b.totalAmount || 0) - (a.totalAmount || 0);
      }
    });


  const formatNumber = (num) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPrice = (price) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  return (
    <div ref={containerRef} style={{
      minHeight: "100dvh",
      background: "var(--bg)",
      color: "var(--text)",
      padding: "20px 16px 80px"
    }}>
      <div style={{
        maxWidth: 480,
        margin: "0 auto"
      }}>
        {/* Header */}
        <div style={{
          marginBottom: 24,
          position: "relative"
        }}>
          {/* Progress bar */}
          <div style={{
            position: "absolute",
            top: "-20px",
            left: 0,
            right: 0,
            height: 1,
            background: "var(--border)",
            borderRadius: 1
          }}>
            <div 
              ref={progressRef}
              style={{
                height: "100%",
                background: "var(--green)",
                borderRadius: 1,
                width: `${refreshProgress}%`,
                transition: "width 0.1s linear"
              }}
            />
          </div>
          
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16
          }}>
            <h1 style={{
              fontSize: 24,
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              margin: 0,
              color: "var(--text)"
            }}>
              Explore
            </h1>
            {/* Live indicator */}
            <div style={{
              width: 6,
              height: 6,
              background: "var(--green)",
              borderRadius: "50%",
              animation: "pulse 2s infinite"
            }} />
          </div>
        </div>

        {/* Search */}
        <div style={{
          marginBottom: 16,
          position: "relative"
        }}>
          {/* Search icon */}
          <svg 
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              width: 16,
              height: 16,
              color: "var(--text-3)",
              pointerEvents: "none"
            }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          
          <input
            type="text"
            placeholder="Search by name, symbol or paste mint address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{
              width: "100%",
              height: 44,
              padding: "0 16px 0 40px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text)",
              fontSize: 14,
              outline: "none",
              transition: "border-color 0.15s"
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--border-strong)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        {/* Tabs */}
        <div style={{
          position: "relative",
          marginBottom: 20
        }}>
          <div style={{
            display: "flex",
            gap: 0,
            borderBottom: "1px solid var(--border)"
          }}>
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "12px 16px",
                  background: "transparent",
                  border: "none",
                  color: activeTab === tab.key ? "var(--text)" : "var(--text-3)",
                  fontSize: 14,
                  fontWeight: activeTab === tab.key ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  position: "relative",
                  flex: 1,
                  textAlign: "center"
                }}
              >
                {tab.label}
                {/* Active indicator */}
                {activeTab === tab.key && (
                  <div style={{
                    position: "absolute",
                    bottom: -1,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: "var(--text)",
                    borderRadius: "1px 1px 0 0"
                  }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 12
          }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{
                background: "var(--surface)",
                borderRadius: 12,
                padding: 16,
                display: "flex",
                alignItems: "center",
                gap: 12,
                animation: "pulse 1.5s ease-in-out infinite"
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  background: "var(--card)",
                  borderRadius: "50%"
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    height: 16,
                    background: "var(--card)",
                    borderRadius: 4,
                    marginBottom: 8,
                    width: "60%"
                  }} />
                  <div style={{
                    height: 12,
                    background: "var(--card)",
                    borderRadius: 4,
                    width: "40%"
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && (
          <div style={{
            background: "var(--red-dim)",
            border: "1px solid var(--red-border)",
            borderRadius: 12,
            padding: 16,
            textAlign: "center"
          }}>
            <p style={{ color: "var(--red)", margin: 0, marginBottom: 8 }}>
              Failed to load tokens
            </p>
            <button
              onClick={fetchTokens}
              style={{
                background: "var(--red)",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontSize: 12,
                cursor: "pointer"
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Searched token result */}
        {searchLoading && (
          <div style={{
            background: "var(--surface)",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
            animation: "pulse 1.5s ease-in-out infinite"
          }}>
            <div style={{
              width: 40,
              height: 40,
              background: "var(--card)",
              borderRadius: "50%"
            }} />
            <div style={{ flex: 1 }}>
              <div style={{
                height: 16,
                background: "var(--card)",
                borderRadius: 4,
                marginBottom: 8,
                width: "60%"
              }} />
              <div style={{
                height: 12,
                background: "var(--card)",
                borderRadius: 4,
                width: "40%"
              }} />
            </div>
          </div>
        )}

        {searchedToken === "not_found" && (
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            textAlign: "center"
          }}>
            <p style={{ color: "var(--muted)", margin: 0 }}>
              Token not found — make sure the address is correct
            </p>
          </div>
        )}

        {searchedToken && typeof searchedToken === "object" && (
          <Link 
            href={`/token/${searchedToken.address}`}
            style={{
              display: "block",
              textDecoration: "none",
              color: "inherit"
            }}
          >
            <div style={{
              background: "var(--surface)",
              border: "2px solid var(--green-border)",
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
              position: "relative",
              cursor: "pointer",
              transition: "all 0.15s"
            }}>
            {/* Custom badge */}
            <div style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "var(--border)",
              color: "var(--text-3)",
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 500
            }}>
              custom
            </div>

            {/* Token logo */}
            <div style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--card)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              flexShrink: 0
            }}>
              {searchedToken.logo ? (
                <img 
                  src={searchedToken.logo} 
                  alt={searchedToken.symbol}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
              ) : (
                <span style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--muted)"
                }}>
                  {searchedToken.symbol.slice(0, 2)}
                </span>
              )}
            </div>

            {/* Token info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 4
              }}>
                <span style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {searchedToken.name}
                </span>
                <span style={{
                  fontSize: 12,
                  color: "var(--muted)",
                  fontFamily: "'Geist Mono', monospace"
                }}>
                  {searchedToken.symbol}
                </span>
              </div>
              
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 11,
                color: "var(--muted)"
              }}>
                <span>MC: {formatNumber(searchedToken.marketCap)}</span>
                <span>Vol: {formatNumber(searchedToken.volume24h)}</span>
                {searchedToken.holders > 0 && (
                  <span>Holders: {searchedToken.holders.toLocaleString()}</span>
                )}
              </div>
            </div>

            {/* Price */}
            <div style={{
              textAlign: "right",
              flexShrink: 0,
              marginRight: 12
            }}>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text)",
                marginBottom: 4
              }}>
                {formatPrice(searchedToken.price)}
              </div>
            </div>

            {/* Arrow */}
            <svg 
              style={{
                width: 16,
                height: 16,
                color: "var(--text-3)",
                flexShrink: 0,
                transition: "transform 0.1s"
              }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          </Link>
        )}

        {/* Token list */}
        {!loading && !error && (
          <div ref={listRef} style={{
            display: "flex",
            flexDirection: "column",
            gap: 12
          }}>
            {filteredAndSortedTokens.map((token, index) => (
              <Link
                key={token.address}
                href={`/token/${token.address}`}
                style={{
                  display: "block",
                  textDecoration: "none",
                  color: "inherit"
                }}
              >
                <div
                  style={{
                    height: 56,
                    borderBottom: index < filteredAndSortedTokens.length - 1 ? "1px solid var(--border)" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "0 4px",
                    transition: "background 0.1s",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "var(--surface)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                  }}
                >
                {/* Rank */}
                <div style={{
                  fontSize: 11,
                  fontFamily: "'Geist Mono', monospace",
                  color: "var(--text-3)",
                  width: 24,
                  textAlign: "right",
                  flexShrink: 0
                }}>
                  {String(index + 1).padStart(2, '0')}
                </div>
                {/* Token logo */}
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--card)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  flexShrink: 0
                }}>
                  {token.logo ? (
                    <img 
                      src={token.logo} 
                      alt={token.symbol}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <span style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-3)"
                    }}>
                      {token.symbol.slice(0, 2)}
                    </span>
                  )}
                </div>

                {/* Token name and symbol */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  minWidth: 0,
                  marginRight: "auto"
                }}>
                  <span style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--text)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 140
                  }}>
                    {token.name}
                  </span>
                  <span style={{
                    fontSize: 11,
                    color: "var(--text-3)",
                    fontFamily: "'Geist Mono', monospace",
                    textTransform: "uppercase"
                  }}>
                    {token.symbol}
                  </span>
                </div>

                {/* Price */}
                <div style={{
                  fontSize: 13,
                  fontFamily: "'Geist Mono', monospace",
                  fontWeight: 500,
                  color: "var(--text)",
                  flexShrink: 0,
                  textAlign: "right",
                  minWidth: 80
                }}>
                  {formatPrice(token.price)}
                </div>

                {/* Change pill */}
                {token.priceChange24h !== 0 && (
                  <div style={{
                    background: token.priceChange24h >= 0 ? "var(--green)" : "var(--red)",
                    color: "white",
                    padding: "2px 6px",
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    flexShrink: 0,
                    minWidth: 50,
                    textAlign: "center"
                  }}>
                    {token.priceChange24h >= 0 ? "+" : ""}{token.priceChange24h.toFixed(1)}%
                  </div>
                )}

                {/* Arrow */}
                <svg 
                  style={{
                    width: 16,
                    height: 16,
                    color: "var(--text-3)",
                    flexShrink: 0,
                    marginLeft: 8,
                    transition: "transform 0.1s"
                  }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              </Link>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && !error && filteredAndSortedTokens.length === 0 && !isValidMintAddress(searchQuery) && searchQuery.trim() && (
          <div style={{
            textAlign: "center",
            padding: 40,
            color: "var(--muted)"
          }}>
            <p>No tokens found matching your search.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}