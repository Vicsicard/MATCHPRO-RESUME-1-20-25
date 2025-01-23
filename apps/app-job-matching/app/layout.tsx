import { AuthProvider } from '@matchpro/ui';
import './globals.css';

export const metadata = {
  title: 'MatchPro - Resume Matching',
  description: 'AI-powered resume matching and job application platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
