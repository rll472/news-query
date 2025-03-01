// src/app/layout.jsx
import Head from "next/head";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        {/* AdSense verification script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7048403758820777"
          crossOrigin="anonymous"
        ></script>
        {/* Optional: Meta tag alternative */}
        {/* <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX" /> */}
      </Head>
      <body>{children}</body>
    </html>
  );
}