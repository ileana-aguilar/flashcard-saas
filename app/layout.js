import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import { GTM_ID } from '../utils/gtm';

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
            src={`https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GTM_ID}');
            `}
          </Script>
        </head>
      <body className={inter.className}>{children}</body>
    </html>
    </ClerkProvider>
    
  );
}
