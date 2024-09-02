import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: 'Quizin',
    template: '%s | Quizin', 
  },
  description: 'The easiest way to create flashcards from your text.',
  icons: {
    icon: '/quizin.svg', 
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
      <head>
          {/* GTM Script */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-2HK40C4CYN"
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-2HK40C4CYN');
            `}
          </Script>
        </head>
      <body className={inter.className}>{children}</body>
    </html>
    </ClerkProvider>
    
  );
}
