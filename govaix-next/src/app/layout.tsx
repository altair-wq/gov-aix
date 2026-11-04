import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

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
  children: ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
        >
          Skip to content
        </a>
        <Navigation />
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  )
}
