
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/hooks/use-auth';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'ScholarSage',
  description: 'AI-powered study assistant for ScholarSage',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full">
      <head/>
      <body className="font-body antialiased flex flex-col h-full">
        <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <div className="flex-grow">
                {children}
              </div>
              <Footer />
            </div>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
