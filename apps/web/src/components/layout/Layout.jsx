import React from 'react';
import { Header } from './Header.jsx';
import { Footer } from './Footer.jsx';

export function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col relative w-full overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-45">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.075)_1px,transparent_0)] [background-size:28px_28px]" />
      </div>
      <Header />
      <main className="flex-1 w-full relative z-0">
        {children}
      </main>
      <Footer />
    </div>
  );
}
