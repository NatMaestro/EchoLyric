import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { AuthSessionProvider } from '@/components/providers/session-provider'
import { ReduxProvider } from '@/components/providers/redux-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ThemeMeta } from '@/components/providers/theme-meta'
import { MainLayout } from '@/components/layout/main-layout'
import './globals.css'

const _geist = Geist({ subsets: ["latin"], variable: '--font-geist' });
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: 'Echolyric - Discover & Preserve Song Lyrics',
  description: 'A digital archive for discovering, preserving, and interacting with song lyrics—especially old and hard-to-find songs.',
  applicationName: 'Echolyric',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1625',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${_geist.variable} ${_geistMono.variable} font-sans antialiased`}>
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            id="adsense-script"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <ThemeMeta />
          <AuthSessionProvider>
            <ReduxProvider>
              <MainLayout>
                {children}
              </MainLayout>
            </ReduxProvider>
          </AuthSessionProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
