"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import CustomWalletModal from "./WalletModal";
import WalletOnboardingGuide from "./WalletOnboardingGuide";

// Wallet icons SVGs
const PhantomIcon = () => (
  <svg width="20" height="20" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="128" height="128" rx="25" fill="#AB9FF2"/>
    <path d="M64 118.5C94.0427 118.5 118.5 94.0427 118.5 64C118.5 33.9573 94.0427 9.5 64 9.5C33.9573 9.5 9.5 33.9573 9.5 64C9.5 94.0427 33.9573 118.5 64 118.5Z" fill="#534FBA"/>
    <path d="M64 105C86.6437 105 105 86.6437 105 64C105 41.3563 86.6437 23 64 23C41.3563 23 23 41.3563 23 64C23 86.6437 41.3563 105 64 105Z" fill="#A580F7"/>
    <path d="M45.5 41.5V67.5C45.5 75.2 52.3 81.5 60.5 81.5C68.7 81.5 75.5 75.2 75.5 67.5V54.5C75.5 48.2 79.8 43 85.5 43V67.5C85.5 81.2 74.2 92.5 60.5 92.5C46.8 92.5 35.5 81.2 35.5 67.5V41.5C35.5 35.7 39.7 31.5 45.5 31.5V41.5Z" fill="white"/>
    <ellipse cx="54.5" cy="50.5" rx="4" ry="4" fill="#534FBA"/>
    <ellipse cx="66.5" cy="50.5" rx="4" ry="4" fill="#534FBA"/>
  </svg>
);

const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 18V6C21 4.9 20.1 4 19 4H5C3.9 4 3 4.9 3 6V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18ZM19 6V8H17C15.9 8 15 8.9 15 10C15 11.1 15.9 12 17 12H19V18H5V6H19ZM17 10.5C17.3 10.5 17.5 10.3 17.5 10C17.5 9.7 17.3 9.5 17 9.5C16.7 9.5 16.5 9.7 16.5 10C16.5 10.3 16.7 10.5 17 10.5Z" fill="currentColor"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 10L12 15L17 10H7Z" fill="currentColor"/>
  </svg>
);

const generateGradientAvatar = (address) => {
  const hash = address.slice(2, 10);
  const hue = parseInt(hash, 16) % 360;
  return {
    background: `linear-gradient(45deg, hsl(${hue}, 70%, 60%), hsl(${(hue + 60) % 360}, 70%, 70%))`,
  };
};

const truncateAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export default function WalletButton() {
  const { wallet, connected, connecting, publicKey, disconnect, wallets } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showOnboardingGuide, setShowOnboardingGuide] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const dropdownRef = useRef(null);

  // Check if user is new to wallets
  useEffect(() => {
    const seenOnboarding = localStorage.getItem('wallet-onboarding-seen');
    setHasSeenOnboarding(!!seenOnboarding);
  }, []);

  const hasTrackedConnection = useRef(false);

  useEffect(() => {
    if (connected && publicKey && !hasTrackedConnection.current) {
      hasTrackedConnection.current = true;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'wallet_connected',
        wallet_type: wallet?.adapter?.name || 'unknown'
      });
    }
    if (!connected) {
      hasTrackedConnection.current = false;
    }
  }, [connected, publicKey, wallet]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleConnect = useCallback(() => {
    // Check if user might be new (no wallets installed and hasn't seen onboarding)
    const hasInstalledWallets = wallets.some(wallet => wallet.readyState === "Installed");
    
    if (!hasInstalledWallets && !hasSeenOnboarding) {
      setShowOnboardingGuide(true);
    } else {
      setIsModalOpen(true);
    }
  }, [wallets, hasSeenOnboarding]);

  const handleOnboardingComplete = useCallback(() => {
    localStorage.setItem('wallet-onboarding-seen', 'true');
    setHasSeenOnboarding(true);
    setShowOnboardingGuide(false);
    setIsModalOpen(true);
  }, []);

  const handleOnboardingClose = useCallback(() => {
    localStorage.setItem('wallet-onboarding-seen', 'true');
    setHasSeenOnboarding(true);
    setShowOnboardingGuide(false);
  }, []);

  const handleDisconnect = useCallback(() => {
    disconnect();
    setIsDropdownOpen(false);
  }, [disconnect]);

  const address = publicKey?.toBase58();

  // Loading state while connecting
  if (connecting) {
    return (
      <button
        disabled
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8,
          color: "rgba(255,255,255,0.7)",
          fontSize: 14,
          fontWeight: 500,
          fontFamily: "'Inter', sans-serif",
          cursor: "not-allowed",
          minWidth: 100,
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            border: "2px solid rgba(255,255,255,0.2)",
            borderTopColor: "white",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        Connecting...
      </button>
    );
  }

  // Connected state - show address with avatar
  if (connected && address) {
    return (
      <div style={{ position: "relative" }} ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 10px",
            background: "rgba(171, 159, 242, 0.1)",
            border: "1px solid rgba(171, 159, 242, 0.3)",
            borderRadius: 8,
            color: "white",
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "'Inter', sans-serif",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(171, 159, 242, 0.15)";
            e.target.style.borderColor = "rgba(171, 159, 242, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(171, 159, 242, 0.1)";
            e.target.style.borderColor = "rgba(171, 159, 242, 0.3)";
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              ...generateGradientAvatar(address),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 600,
              color: "white",
            }}
          >
            {address.slice(0, 2).toUpperCase()}
          </div>
          
          {/* Truncated address */}
          <span>{truncateAddress(address)}</span>
          
          {/* Dropdown arrow */}
          <ChevronDownIcon />
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              minWidth: 200,
              background: "rgba(20, 20, 20, 0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              padding: 8,
              zIndex: 1000,
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
          >
            {/* Wallet info */}
            <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                {wallet?.adapter?.icon ? (
                  <img src={wallet.adapter.icon} alt={wallet.adapter.name} width="20" height="20" />
                ) : (
                  <WalletIcon />
                )}
                <span style={{ fontSize: 14, fontWeight: 600, color: "white" }}>
                  {wallet?.adapter?.name || "Wallet"}
                </span>
              </div>
              <div style={{ 
                fontSize: 12, 
                color: "rgba(255,255,255,0.6)", 
                fontFamily: "monospace",
                wordBreak: "break-all" 
              }}>
                {address}
              </div>
            </div>

            {/* Actions */}
            <div style={{ padding: 4 }}>
              <button
                onClick={handleDisconnect}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "8px 12px",
                  background: "transparent",
                  border: "none",
                  borderRadius: 8,
                  color: "#ff6b6b",
                  fontSize: 14,
                  fontWeight: 500,
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255, 107, 107, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                }}
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Not connected state - show connect button with Phantom branding
  return (
    <>
      <button
        onClick={handleConnect}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          background: "linear-gradient(45deg, #AB9FF2, #9B8CE8)",
          border: "none",
          borderRadius: 8,
          color: "white",
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "'Inter', sans-serif",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 4px 16px rgba(171, 159, 242, 0.3)",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-1px)";
          e.target.style.boxShadow = "0 6px 20px rgba(171, 159, 242, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 4px 16px rgba(171, 159, 242, 0.3)";
        }}
      >
        <PhantomIcon />
        Connect
      </button>
      
      <CustomWalletModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      
      <WalletOnboardingGuide
        visible={showOnboardingGuide}
        onClose={handleOnboardingClose}
        onContinue={handleOnboardingComplete}
      />
    </>
  );
}