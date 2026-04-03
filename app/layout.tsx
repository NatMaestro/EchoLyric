import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
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
