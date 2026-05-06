import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import Providers from "@/components/Providers";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-grid min-h-screen" style={{ paddingBottom: 120 }}>
  <div style={{
    maxWidth: 520,
    margin: "0 auto",
    minHeight: "100vh",
    background: "#080810",
    borderLeft: "1px solid #1e1e30",
    borderRight: "1px solid #1e1e30",
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
