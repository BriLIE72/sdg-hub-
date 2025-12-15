import { ReactNode } from 'react';
import Website from './Website';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return <Website>{children}</Website>;
}
