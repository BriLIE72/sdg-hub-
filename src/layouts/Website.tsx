import { ReactNode } from 'react';
import Header from './parts/Header';
import Footer from './parts/Footer';

interface WebsiteProps {
  children: ReactNode;
}

export default function Website({ children }: WebsiteProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
