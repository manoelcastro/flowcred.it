"use client";

import React from 'react';

interface AvaliadorLayoutProps {
  children: React.ReactNode;
}

export function AvaliadorLayout({ children }: AvaliadorLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-900 border-b border-gray-800 h-16 flex items-center px-4 lg:px-6">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center text-white font-bold">
              AC
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Ana Cardoso</p>
              <p className="text-xs text-gray-400">Avaliadora de Crédito</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-950 p-4">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
