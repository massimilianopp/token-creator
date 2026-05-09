"use client";

import { useState, useEffect, useRef } from "react";
import { useGSAP, DURATIONS, EASE_CONFIGS } from "@/hooks/useGSAP";

const SORT_OPTIONS = [
  { key: "marketCap", label: "Market Cap" },
  { key: "volume", label: "Volume" },
  { key: "priceChange", label: "24h Change" }
];

export default function ExplorePage() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("marketCap");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastUpdate, setLastUpdate] = useState(null);
  const [searchedToken, setSearchedToken] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const { gsap } = useGSAP();

  // Check if query is a valid Solana mint address (43-44 characters, alphanumeric + certain special chars)
  const isValidMintAddress = (query) => {
    const mintPattern = /^[1-9A-HJ-NP-Za-km-z]{43,44}$/;
    return mintPattern.test(query.trim());
  };

  // Search for specific token by mint address using Solscan
  const searchTokenByMint = async (mintAddress) => {
    try {
      setSearchLoading(true);
      setSearchedToken(null);

      // Fetch metadata and market data in parallel
      const [metaRes, marketRes] = await Promise.all([
        fetch(`https://public-api.solscan.io/token/meta?tokenAddress=${mintAddress}`),
        fetch(`https://public-api.solscan.io/market/token/${mintAddress}`)
      ]);

      let tokenData = null;

      if (metaRes.ok) {
        const metaData = await metaRes.json();
        tokenData = {
          address: mintAddress,
          name: metaData.name || "Unknown Token",
          symbol: metaData.symbol || "???",
          decimals: metaData.decimals || 9,
          logo: metaData.icon || null,
          supply: metaData.supply || 0,
          holders: metaData.holder || 0,
          price: 0,
          marketCap: 0,
          volume24h: 0,
          priceChange24h: 0,
          source: "solscan"
        };

        // Try to get market data
        if (marketRes.ok) {
          const marketData = await marketRes.json();
          tokenData.price = parseFloat(marketData.priceUsdt || 0);
          tokenData.volume24h = parseFloat(marketData.volumeUsdt || 0);
          tokenData.marketCap = parseFloat(marketData.marketCapFD || 0);
        }

        setSearchedToken(tokenData);
      } else {
        // Token not found on Solscan
        setSearchedToken("not_found");
      }
    } catch (err) {
      console.error("Error searching token:", err);
      setSearchedToken("error");
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchTokens = async () => {
    try {
      setError(null);
      
      // Fetch both endpoints
      const [topTokensRes, latestTokensRes] = await Promise.all([
        fetch("https://api.dexscreener.com/token-boosts/top/v1"),
        fetch("https://api.dexscreener.com/latest/dex/tokens/solana")
      ]);

      if (!topTokensRes.ok || !latestTokensRes.ok) {
        throw new Error("Failed to fetch token data");
      }

      const [topTokensData, latestTokensData] = await Promise.all([
        topTokensRes.json(),
        latestTokensRes.json()
      ]);

      // Combine and deduplicate tokens
      const allTokens = [];
      
      // Add top tokens
      if (topTokensData?.data) {
        allTokens.push(...topTokensData.data.map(token => ({
          address: token.tokenAddress,
          name: token.name || "Unknown",
          symbol: token.symbol || "???",
          price: parseFloat(token.priceUsd || 0),
          marketCap: parseFloat(token.marketCap || 0),
          volume24h: parseFloat(token.volume24h || 0),
          priceChange24h: parseFloat(token.priceChange24h || 0),
          logo: token.imageUrl || null
        })));
      }

      // Add latest tokens (avoid duplicates)
      if (latestTokensData?.pairs) {
        const existingAddresses = new Set(allTokens.map(t => t.address));
        latestTokensData.pairs
          .filter(pair => pair.chainId === "solana" && !existingAddresses.has(pair.baseToken.address))
          .slice(0, 20)
          .forEach(pair => {
            allTokens.push({
              address: pair.baseToken.address,
              name: pair.baseToken.name || "Unknown",
              symbol: pair.baseToken.symbol || "???",
              price: parseFloat(pair.priceUsd || 0),
              marketCap: parseFloat(pair.marketCap || 0),
              volume24h: parseFloat(pair.volume?.h24 || 0),
              priceChange24h: parseFloat(pair.priceChange?.h24 || 0),
              logo: pair.info?.imageUrl || null
            });
          });
      }

      setTokens(allTokens.slice(0, 50)); // Limit to 50 tokens
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Initial fetch and auto-refresh every 30s
  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 30000);
    return () => clearInterval(interval);
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

  // Filter and sort tokens (exclude searched token if it's a mint address search)
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
      switch (sortBy) {
        case "volume":
          return b.volume24h - a.volume24h;
        case "priceChange":
          return b.priceChange24h - a.priceChange24h;
        default:
          return b.marketCap - a.marketCap;
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
          textAlign: "center"
        }}>
          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            fontFamily: "'Syne', sans-serif",
            marginBottom: 8,
            background: "linear-gradient(135deg, var(--text) 0%, var(--muted) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Explore Tokens
          </h1>
          <p style={{
            fontSize: 13,
            color: "var(--muted)",
            marginBottom: 0
          }}>
            Discover trending Solana tokens
            {lastUpdate && (
              <span style={{ display: "block", fontSize: 11 }}>
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>

        {/* Search */}
        <div style={{
          marginBottom: 16
        }}>
          <input
            type="text"
            placeholder="Search by name, symbol or mint address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              color: "var(--text)",
              fontSize: 14,
              outline: "none",
              transition: "border-color 0.15s"
            }}
            onFocus={(e) => e.target.style.borderColor = "var(--dim)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        {/* Sort options */}
        <div style={{
          display: "flex",
          gap: 8,
          marginBottom: 20,
          overflowX: "auto",
          paddingBottom: 4
        }}>
          {SORT_OPTIONS.map(option => (
            <button
              key={option.key}
              onClick={() => setSortBy(option.key)}
              style={{
                padding: "6px 12px",
                background: sortBy === option.key ? "var(--surface)" : "transparent",
                border: `1px solid ${sortBy === option.key ? "var(--border)" : "transparent"}`,
                borderRadius: 8,
                color: sortBy === option.key ? "var(--text)" : "var(--muted)",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap"
              }}
            >
              {option.label}
            </button>
          ))}
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
          <div style={{
            background: "var(--surface)",
            border: "2px solid var(--green-border)",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
            position: "relative"
          }}>
            {/* Solscan badge */}
            <div style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "var(--green)",
              color: "white",
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 600
            }}>
              Found on Solscan
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

            {/* Trade button */}
            <a
              href={`https://jup.ag/swap/SOL-${searchedToken.address}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "var(--text)",
                color: "var(--bg)",
                border: "none",
                borderRadius: 8,
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.15s",
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "var(--dim)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "var(--text)";
              }}
            >
              Trade
            </a>
          </div>
        )}

        {/* Token list */}
        {!loading && !error && (
          <div ref={listRef} style={{
            display: "flex",
            flexDirection: "column",
            gap: 12
          }}>
            {filteredAndSortedTokens.map((token, index) => (
              <div
                key={token.address}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  transition: "all 0.15s",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "var(--dim)";
                  e.target.style.background = "var(--card)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.background = "var(--surface)";
                }}
              >
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
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--muted)"
                    }}>
                      {token.symbol.slice(0, 2)}
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
                      {token.name}
                    </span>
                    <span style={{
                      fontSize: 12,
                      color: "var(--muted)",
                      fontFamily: "'Geist Mono', monospace"
                    }}>
                      {token.symbol}
                    </span>
                  </div>
                  
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 11,
                    color: "var(--muted)"
                  }}>
                    <span>MC: {formatNumber(token.marketCap)}</span>
                    <span>Vol: {formatNumber(token.volume24h)}</span>
                  </div>
                </div>

                {/* Price and change */}
                <div style={{
                  textAlign: "right",
                  flexShrink: 0
                }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text)",
                    marginBottom: 4
                  }}>
                    {formatPrice(token.price)}
                  </div>
                  
                  <div style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: token.priceChange24h >= 0 ? "var(--green)" : "var(--red)"
                  }}>
                    {token.priceChange24h >= 0 ? "+" : ""}{token.priceChange24h.toFixed(2)}%
                  </div>
                </div>

                {/* Trade button */}
                <a
                  href={`https://jup.ag/swap/SOL-${token.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "var(--text)",
                    color: "var(--bg)",
                    border: "none",
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "all 0.15s",
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "var(--dim)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "var(--text)";
                  }}
                >
                  Trade
                </a>
              </div>
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
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}