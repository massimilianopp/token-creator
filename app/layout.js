import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
export const metadata = {};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body style={{ paddingTop: 48, paddingBottom: 80 }}>
        <Providers>
          <Header />
          <div style={{
            maxWidth: 480,
            margin: "0 auto",
            minHeight: "100vh",
            background: "var(--bg)",
            borderLeft: "1px solid var(--border)",
            borderRight: "1px solid var(--border)",
            position: "relative",
            zIndex: 1,
          }}>
            {children}
          </div>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}