
import React from 'react';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';

export function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col relative w-full overflow-x-hidden">
      <Header />
      <main className="flex-1 w-full relative z-0">
        {children}
      </main>
      <Footer />
    </div>
  );
}
