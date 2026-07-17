import "./globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Script from "next/script";

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

        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NRB5BXQ2');
          `}
        </Script>

        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const urlParams = new URLSearchParams(window.location.search);
              const ref = urlParams.get('ref');
              if (ref && /^[a-zA-Z0-9_-]{1,50}$/.test(ref)) {
                localStorage.setItem('tc_ref', ref);
                document.cookie = 'tc_ref=' + ref + ';max-age=2592000;path=/;domain=.token-creator.space;SameSite=Lax';
              }
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
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NRB5BXQ2"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

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