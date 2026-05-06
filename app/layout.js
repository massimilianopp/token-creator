import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import Providers from "@/components/Providers";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ paddingBottom: 80 }}>
        <div style={{
          maxWidth: 520,
          margin: "0 auto",
          minHeight: "100vh",
          background: "var(--bg)",
          borderLeft: "1px solid var(--border)",
          borderRight: "1px solid var(--border)",
          position: "relative",
        }}>
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}