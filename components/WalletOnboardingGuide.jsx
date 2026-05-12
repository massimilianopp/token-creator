"use client";

import { useState, useEffect } from "react";

const PhantomIcon = () => (
  <svg width="24" height="24" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="128" height="128" rx="25" fill="#AB9FF2"/>
    <path d="M64 118.5C94.0427 118.5 118.5 94.0427 118.5 64C118.5 33.9573 94.0427 9.5 64 9.5C33.9573 9.5 9.5 33.9573 9.5 64C9.5 94.0427 33.9573 118.5 64 118.5Z" fill="#534FBA"/>
    <path d="M64 105C86.6437 105 105 86.6437 105 64C105 41.3563 86.6437 23 64 23C41.3563 23 23 41.3563 23 64C23 86.6437 41.3563 105 64 105Z" fill="#A580F7"/>
    <path d="M45.5 41.5V67.5C45.5 75.2 52.3 81.5 60.5 81.5C68.7 81.5 75.5 75.2 75.5 67.5V54.5C75.5 48.2 79.8 43 85.5 43V67.5C85.5 81.2 74.2 92.5 60.5 92.5C46.8 92.5 35.5 81.2 35.5 67.5V41.5C35.5 35.7 39.7 31.5 45.5 31.5V41.5Z" fill="white"/>
    <ellipse cx="54.5" cy="50.5" rx="4" ry="4" fill="#534FBA"/>
    <ellipse cx="66.5" cy="50.5" rx="4" ry="4" fill="#534FBA"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function WalletOnboardingGuide({ visible, onClose, onContinue }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false);

  useEffect(() => {
    // Check if Phantom is installed
    const checkPhantomInstallation = () => {
      const isInstalled = window.phantom?.solana?.isPhantom;
      setIsPhantomInstalled(isInstalled);
    };

    if (visible) {
      checkPhantomInstallation();
      // Recheck periodically in case user installs during the guide
      const interval = setInterval(checkPhantomInstallation, 2000);
      return () => clearInterval(interval);
    }
  }, [visible]);

  const steps = [
    {
      title: "Welcome to Solana!",
      content: "We'll help you set up a wallet to interact with this application. It only takes a minute.",
    },
    {
      title: "Phantom Connect - The Easy Way",
      content: "Create a wallet instantly using your email or Google account. No downloads required!",
    },
    {
      title: "Install Phantom (Optional)",
      content: "For advanced users, you can install the full Phantom browser extension for additional features.",
    }
  ];

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.9)",
        backdropFilter: "blur(12px)",
        zIndex: 10001,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          background: "rgba(20, 20, 20, 0.95)",
          borderRadius: 16,
          padding: 32,
          maxWidth: 480,
          width: "100%",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Progress indicator */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 32,
          justifyContent: "center",
        }}>
          {steps.map((_, index) => (
            <div
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: index <= currentStep ? "#AB9FF2" : "rgba(255,255,255,0.2)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {currentStep === 0 && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 24,
            }}>
              <div style={{
                background: "linear-gradient(45deg, #AB9FF2, #9B8CE8)",
                borderRadius: 16,
                padding: 16,
                display: "inline-flex",
              }}>
                <PhantomIcon />
              </div>
            </div>
            
            <h2 style={{
              fontSize: 24,
              fontWeight: 600,
              color: "white",
              margin: "0 0 16px 0",
              fontFamily: "'Inter', sans-serif",
            }}>
              {steps[0].title}
            </h2>
            
            <p style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.5,
              margin: "0 0 32px 0",
            }}>
              {steps[0].content}
            </p>
            
            <button
              onClick={() => setCurrentStep(1)}
              style={{
                background: "linear-gradient(45deg, #AB9FF2, #9B8CE8)",
                border: "none",
                borderRadius: 8,
                padding: "12px 24px",
                color: "white",
                fontSize: 16,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Get Started
            </button>
          </div>
        )}

        {currentStep === 1 && (
          <div style={{ textAlign: "center" }}>
            <h2 style={{
              fontSize: 24,
              fontWeight: 600,
              color: "white",
              margin: "0 0 16px 0",
              fontFamily: "'Inter', sans-serif",
            }}>
              {steps[1].title}
            </h2>
            
            <p style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.5,
              margin: "0 0 32px 0",
            }}>
              {steps[1].content}
            </p>

            <div style={{
              background: "rgba(171, 159, 242, 0.1)",
              border: "1px solid rgba(171, 159, 242, 0.3)",
              borderRadius: 12,
              padding: 24,
              marginBottom: 32,
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
              }}>
                <PhantomIcon />
                <div style={{ textAlign: "left" }}>
                  <div style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: "white",
                    marginBottom: 4,
                  }}>
                    Phantom Connect
                  </div>
                  <div style={{
                    fontSize: 14,
                    color: "rgba(255,255,255,0.7)",
                  }}>
                    No downloads, no seed phrases to remember
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "left" }}>
                {[
                  "Sign in with email or Google",
                  "Wallet created instantly",
                  "Secured by Phantom's infrastructure",
                  "Access from any device"
                ].map((feature, index) => (
                  <div key={index} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 14,
                    color: "rgba(255,255,255,0.8)",
                  }}>
                    <div style={{
                      background: "#22c55e",
                      borderRadius: "50%",
                      width: 16,
                      height: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <CheckIcon />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={onContinue}
                style={{
                  background: "linear-gradient(45deg, #AB9FF2, #9B8CE8)",
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 24px",
                  color: "white",
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Use Phantom Connect
              </button>
              
              <button
                onClick={() => setCurrentStep(2)}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 8,
                  padding: "12px 24px",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 16,
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Advanced Options
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div style={{ textAlign: "center" }}>
            <h2 style={{
              fontSize: 24,
              fontWeight: 600,
              color: "white",
              margin: "0 0 16px 0",
              fontFamily: "'Inter', sans-serif",
            }}>
              {steps[2].title}
            </h2>
            
            <p style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.5,
              margin: "0 0 32px 0",
            }}>
              {steps[2].content}
            </p>

            <div style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: 24,
              marginBottom: 24,
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <PhantomIcon />
                  <div style={{ textAlign: "left" }}>
                    <div style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "white",
                      marginBottom: 2,
                    }}>
                      Phantom Browser Extension
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.6)",
                    }}>
                      Full wallet features and maximum security
                    </div>
                  </div>
                </div>
                
                {isPhantomInstalled ? (
                  <div style={{
                    background: "rgba(34, 197, 94, 0.2)",
                    color: "#22c55e",
                    borderRadius: 6,
                    padding: "4px 8px",
                    fontSize: 12,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}>
                    <CheckIcon />
                    INSTALLED
                  </div>
                ) : (
                  <a
                    href="https://phantom.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: "linear-gradient(45deg, #AB9FF2, #9B8CE8)",
                      border: "none",
                      borderRadius: 6,
                      padding: "8px 12px",
                      color: "white",
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: "'Inter', sans-serif",
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Install
                    <ExternalLinkIcon />
                  </a>
                )}
              </div>
            </div>
            
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={onContinue}
                style={{
                  background: "linear-gradient(45deg, #AB9FF2, #9B8CE8)",
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 24px",
                  color: "white",
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Continue
              </button>
              
              <button
                onClick={() => setCurrentStep(1)}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 8,
                  padding: "12px 24px",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 16,
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* Skip option */}
        <div style={{
          marginTop: 24,
          textAlign: "center",
        }}>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.5)",
              fontSize: 14,
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Skip guide
          </button>
        </div>
      </div>
    </div>
  );
}