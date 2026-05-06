import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import Providers from "@/components/Providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ paddingBottom: 80 }}>
        <div style={{
          maxWidth: 480,
          margin: "0 auto",
          minHeight: "100vh",
          background: "var(--bg)",
          borderLeft: "1px solid var(--border)",
          borderRight: "1px solid var(--border)",
        }}>
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}