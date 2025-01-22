import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider, MainNav, Footer } from '@matchpro/ui';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MatchPro Resume Optimizer',
  description: 'Professional resume optimization powered by AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <MainNav />
            <main className="flex-grow bg-gradient-to-b from-gray-50 to-white">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
