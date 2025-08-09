
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'SmartStudy Lite',
  description: 'AI-powered study assistant',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <div className="flex-grow">
            <AuthProvider>
                {children}
            </AuthProvider>
        </div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
