import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FolioAI — Turn Your Resume Into a Stunning Portfolio',
  description: 'Upload your PDF or DOCX resume. GPT-4o generates a beautiful, role-adaptive portfolio website with AI editing, analytics, voice mode, and one-click publishing — in 60 seconds.',
  keywords: ['portfolio', 'resume', 'AI', 'GPT-4o', 'portfolio builder', 'career'],
  authors: [{ name: 'FolioAI' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'FolioAI — AI Portfolio Generator',
    description: 'Transform your resume into a stunning portfolio in 60 seconds.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FolioAI — AI Portfolio Generator',
    description: 'Transform your resume into a stunning portfolio in 60 seconds.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col font-[var(--font-inter)]">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0f1e35',
              color: '#f0f4ff',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: '12px',
              fontSize: '0.875rem',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            },
            success: {
              iconTheme: { primary: '#34d399', secondary: '#0f1e35' },
            },
            error: {
              iconTheme: { primary: '#fb7185', secondary: '#0f1e35' },
            },
          }}
        />
      </body>
    </html>
  );
}
