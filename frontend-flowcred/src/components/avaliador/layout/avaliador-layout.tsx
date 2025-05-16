"use client";

import React, { useState } from 'react';
import { AvaliadorHeader } from './avaliador-header';
import { AvaliadorSidebar } from './avaliador-sidebar';

interface AvaliadorLayoutProps {
  children: React.ReactNode;
}

export function AvaliadorLayout({ children }: AvaliadorLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <AvaliadorSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AvaliadorHeader toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-950 p-4">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
