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
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const urlParams = new URLSearchParams(window.location.search);
              const ref = urlParams.get('ref');
              
              if (ref && /^[a-zA-Z0-9_-]{1,50}$/.test(ref)) {
                localStorage.setItem('tc_ref', ref);
                document.cookie = 'tc_ref=' + ref + ';max-age=2592000;path=/;domain=.token-creator.space;SameSite=Lax';
              }
              
              // Fallback: read from cookie if no ref in URL
              const storedRef = localStorage.getItem('tc_ref') || 
                document.cookie.match(/tc_ref=([^;]+)/)?.[1];
                
              if (storedRef) {
                window.__TC_REF__ = storedRef;
              }
            })();
          `
        }} />
      </head>
      <body style={{ paddingTop: 48, paddingBottom: 100 }}>
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