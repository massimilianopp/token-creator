"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

// Wallet icons
const PhantomIcon = () => (
  <svg width="32" height="32" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="128" height="128" rx="25" fill="#AB9FF2"/>
    <path d="M64 118.5C94.0427 118.5 118.5 94.0427 118.5 64C118.5 33.9573 94.0427 9.5 64 9.5C33.9573 9.5 9.5 33.9573 9.5 64C9.5 94.0427 33.9573 118.5 64 118.5Z" fill="#534FBA"/>
    <path d="M64 105C86.6437 105 105 86.6437 105 64C105 41.3563 86.6437 23 64 23C41.3563 23 23 41.3563 23 64C23 86.6437 41.3563 105 64 105Z" fill="#A580F7"/>
    <path d="M45.5 41.5V67.5C45.5 75.2 52.3 81.5 60.5 81.5C68.7 81.5 75.5 75.2 75.5 67.5V54.5C75.5 48.2 79.8 43 85.5 43V67.5C85.5 81.2 74.2 92.5 60.5 92.5C46.8 92.5 35.5 81.2 35.5 67.5V41.5C35.5 35.7 39.7 31.5 45.5 31.5V41.5Z" fill="white"/>
    <ellipse cx="54.5" cy="50.5" rx="4" ry="4" fill="#534FBA"/>
    <ellipse cx="66.5" cy="50.5" rx="4" ry="4" fill="#534FBA"/>
  </svg>
);

const SolflareIcon = () => (
  <svg width="32" height="32" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="128" fill="#000"/>
    <path d="M398.24 209.314L250.24 61.3145C239.484 50.5584 222.516 50.5584 211.76 61.3145L63.7598 209.314C53.0037 220.07 53.0037 237.038 63.7598 247.794L211.76 395.794C222.516 406.55 239.484 406.55 250.24 395.794L398.24 247.794C408.996 237.038 408.996 220.07 398.24 209.314Z" fill="url(#paint0_linear)"/>
    <defs>
      <linearGradient id="paint0_linear" x1="96" y1="96" x2="416" y2="416" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FC8C3C"/>
        <stop offset="1" stopColor="#FC3C8C"/>
      </linearGradient>
    </defs>
  </svg>
);

const BackpackIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#E33E3F"/>
    <path d="M8 12C8 10.8954 8.89543 10 10 10H22C23.1046 10 24 10.8954 24 12V22C24 23.1046 23.1046 24 22 24H10C8.89543 24 8 23.1046 8 22V12Z" fill="white"/>
    <path d="M12 8C12 6.89543 12.8954 6 14 6H18C19.1046 6 20 6.89543 20 8V10H12V8Z" fill="white"/>
    <circle cx="16" cy="17" r="2" fill="#E33E3F"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function CustomWalletModal({ visible, onClose }) {
  const { wallets, select, connecting } = useWallet();
  const [showPhantomConnect, setShowPhantomConnect] = useState(false);

  const handleWalletSelect = useCallback((walletName) => {
    select(walletName);
    onClose();
  }, [select, onClose]);

  const handlePhantomConnect = useCallback(() => {
    setShowPhantomConnect(true);
  }, []);

  const handleBackToWallets = useCallback(() => {
    setShowPhantomConnect(false);
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setShowPhantomConnect(false);
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(8px)",
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "rgba(20, 20, 20, 0.95)",
          borderRadius: 16,
          padding: 32,
          maxWidth: 420,
          width: "100%",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24
        }}>
          <h2 style={{
            fontSize: 24,
            fontWeight: 600,
            color: "white",
            margin: 0,
            fontFamily: "'Inter', sans-serif",
          }}>
            {showPhantomConnect ? "Connect with Phantom" : "Connect Wallet"}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              padding: 4,
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {showPhantomConnect ? (
          /* Phantom Connect Options */
          <div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
              padding: 16,
              background: "rgba(171, 159, 242, 0.1)",
              borderRadius: 12,
              border: "1px solid rgba(171, 159, 242, 0.2)",
            }}>
              <PhantomIcon />
              <div>
                <div style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "white",
                  marginBottom: 4,
                }}>
                  Phantom Connect
                </div>
                <div style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.6)",
                }}>
                  Create a wallet instantly with your email or social account
                </div>
              </div>
            </div>

            {/* Social login options */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 14,
                fontWeight: 500,
                color: "rgba(255,255,255,0.8)",
                marginBottom: 12,
              }}>
                Quick Sign-in Options
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button
                  onClick={() => handleWalletSelect("Phantom")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 16,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "white",
                    fontSize: 15,
                    fontWeight: 500,
                    fontFamily: "'Inter', sans-serif",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    width: "100%",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.08)";
                    e.target.style.borderColor = "rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.05)";
                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  <GoogleIcon />
                  Continue with Google
                </button>

                <button
                  onClick={() => handleWalletSelect("Phantom")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: 16,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "white",
                    fontSize: 15,
                    fontWeight: 500,
                    fontFamily: "'Inter', sans-serif",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    width: "100%",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.08)";
                    e.target.style.borderColor = "rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(255,255,255,0.05)";
                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  <EmailIcon />
                  Continue with Email
                </button>
              </div>
            </div>

            {/* Back button */}
            <button
              onClick={handleBackToWallets}
              style={{
                display: "block",
                margin: "0 auto",
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.6)",
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Choose different wallet
            </button>
          </div>
        ) : (
          /* Wallet Selection */
          <div>
            {/* Phantom Connect Featured */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 14,
                fontWeight: 500,
                color: "rgba(255,255,255,0.8)",
                marginBottom: 12,
              }}>
                Recommended
              </div>
              
              <button
                onClick={handlePhantomConnect}
                disabled={connecting}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: 20,
                  background: "linear-gradient(45deg, rgba(171, 159, 242, 0.15), rgba(155, 140, 232, 0.15))",
                  border: "1px solid rgba(171, 159, 242, 0.3)",
                  borderRadius: 12,
                  color: "white",
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  cursor: connecting ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  width: "100%",
                  textAlign: "left",
                  opacity: connecting ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!connecting) {
                    e.target.style.background = "linear-gradient(45deg, rgba(171, 159, 242, 0.2), rgba(155, 140, 232, 0.2))";
                    e.target.style.borderColor = "rgba(171, 159, 242, 0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!connecting) {
                    e.target.style.background = "linear-gradient(45deg, rgba(171, 159, 242, 0.15), rgba(155, 140, 232, 0.15))";
                    e.target.style.borderColor = "rgba(171, 159, 242, 0.3)";
                  }
                }}
              >
                <PhantomIcon />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Phantom Connect</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 400 }}>
                    Create wallet instantly with email or Google
                  </div>
                </div>
                <div style={{
                  background: "rgba(171, 159, 242, 0.3)",
                  borderRadius: 6,
                  padding: "4px 8px",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "white",
                }}>
                  NEW
                </div>
              </button>
            </div>

            {/* Other wallets */}
            <div>
              <div style={{
                fontSize: 14,
                fontWeight: 500,
                color: "rgba(255,255,255,0.8)",
                marginBottom: 12,
              }}>
                Other Options
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {wallets.filter(wallet => wallet.readyState === "Installed" || wallet.readyState === "Loadable").map((wallet) => {
                  let Icon = PhantomIcon;
                  if (wallet.adapter.name === "Solflare") Icon = SolflareIcon;
                  else if (wallet.adapter.name === "Backpack") Icon = BackpackIcon;
                  
                  return (
                    <button
                      key={wallet.adapter.name}
                      onClick={() => handleWalletSelect(wallet.adapter.name)}
                      disabled={connecting}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        padding: 16,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 12,
                        color: "white",
                        fontSize: 15,
                        fontWeight: 500,
                        fontFamily: "'Inter', sans-serif",
                        cursor: connecting ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                        width: "100%",
                        textAlign: "left",
                        opacity: connecting ? 0.6 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!connecting) {
                          e.target.style.background = "rgba(255,255,255,0.08)";
                          e.target.style.borderColor = "rgba(255,255,255,0.2)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!connecting) {
                          e.target.style.background = "rgba(255,255,255,0.05)";
                          e.target.style.borderColor = "rgba(255,255,255,0.1)";
                        }
                      }}
                    >
                      {wallet.adapter.icon ? (
                        <img 
                          src={wallet.adapter.icon} 
                          alt={wallet.adapter.name} 
                          width="32" 
                          height="32"
                          style={{ borderRadius: 6 }}
                        />
                      ) : (
                        <Icon />
                      )}
                      <span>{wallet.adapter.name}</span>
                      {wallet.readyState === "Installed" && (
                        <div style={{
                          marginLeft: "auto",
                          background: "rgba(34, 197, 94, 0.2)",
                          color: "#22c55e",
                          borderRadius: 4,
                          padding: "2px 6px",
                          fontSize: 10,
                          fontWeight: 600,
                        }}>
                          INSTALLED
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}