import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GovAIx - AI-Powered Government Services',
  description: 'Transforming government services with AI-powered multi-agent systems for faster, more efficient citizen services.',
  keywords: 'government, AI, automation, citizen services, permits, licenses',
  authors: [{ name: 'GovAIx Team' }],
  openGraph: {
    title: 'GovAIx - AI-Powered Government Services',
    description: 'Transforming government services with AI-powered multi-agent systems.',
    type: 'website',
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main id="main-content" role="main">
          {children}
        </main>
      </body>
    </html>
  )
}
