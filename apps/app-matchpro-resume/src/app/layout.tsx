import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MainNav, Footer } from '@matchpro/ui';
import { AuthProvider } from '@matchpro/data';
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
          <div className="flex min-h-screen flex-col">
            <MainNav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
