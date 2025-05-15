"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Link2, 
  Shield, 
  Bell, 
  BarChart3,
  Settings,
  HelpCircle,
  X
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();
  
  const navigation = [
    { name: 'Visão Geral', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Documentos', href: '/dashboard/documentos', icon: FileText },
    { name: 'Integrações', href: '/dashboard/integracoes', icon: Link2 },
    { name: 'Consentimentos', href: '/dashboard/consentimentos', icon: Shield },
    { name: 'Notificações', href: '/dashboard/notificacoes', icon: Bell },
    { name: 'Métricas', href: '/dashboard/metricas', icon: BarChart3 },
  ];
  
  const secondaryNavigation = [
    { name: 'Configurações', href: '/dashboard/configuracoes', icon: Settings },
    { name: 'Ajuda', href: '/dashboard/ajuda', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-sm ${
          open ? 'block' : 'hidden'
        }`}
        onClick={() => setOpen(false)}
      />
      
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 border-r border-gray-800 lg:static lg:block transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <Link href="/dashboard" className="flex items-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
              <path fillRule="evenodd" clipRule="evenodd" d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32ZM12.4306 9.70695C12.742 9.33317 13.2633 9.30058 13.6052 9.62118L19.1798 14.8165C19.4894 15.1054 19.4894 15.5841 19.1798 15.873L13.6052 21.0683C13.2633 21.3889 12.742 21.3563 12.4306 19.9991V9.70695Z" fill="currentColor" />
            </svg>
            <span className="ml-2 text-xl font-bold">flowCred.it</span>
          </Link>
          
          <button
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-white"
            onClick={() => setOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="px-2 py-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
          
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Suporte
            </h3>
            <div className="mt-2 space-y-1">
              {secondaryNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-400' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold">
                JD
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">João da Silva</p>
              <p className="text-xs text-gray-400">Tomador de Crédito</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
