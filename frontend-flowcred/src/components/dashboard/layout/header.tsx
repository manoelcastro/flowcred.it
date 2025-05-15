"use client";

import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  Search,
  ChevronDown,
  LogOut
} from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const notifications = [
    {
      id: 1,
      title: 'Solicitação de Acesso',
      description: 'Banco XYZ solicita acesso às suas métricas financeiras',
      time: '5 min atrás',
      unread: true,
    },
    {
      id: 2,
      title: 'Documento Verificado',
      description: 'Seu balanço patrimonial foi verificado com sucesso',
      time: '1 hora atrás',
      unread: false,
    },
    {
      id: 3,
      title: 'Nova Métrica Disponível',
      description: 'Índice de liquidez calculado com base nos seus documentos',
      time: '3 horas atrás',
      unread: false,
    },
  ];

  return (
    <header className="bg-gray-900 border-b border-gray-800 h-16 flex items-center px-4 lg:px-6">
      <button
        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>
      
      <div className="ml-4 lg:ml-0 flex-1 flex justify-between items-center">
        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white relative"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell size={20} />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-gray-900"></span>
              )}
            </button>
            
            {notificationsOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-2 px-3 border-b border-gray-700">
                  <h3 className="text-sm font-medium text-white">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-700 transition-colors ${
                        notification.unread ? 'bg-gray-700/50' : ''
                      }`}
                    >
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-white">{notification.title}</p>
                        <p className="text-xs text-gray-400">{notification.time}</p>
                      </div>
                      <p className="text-xs text-gray-300 mt-1">{notification.description}</p>
                    </div>
                  ))}
                </div>
                <div className="py-2 px-3 border-t border-gray-700">
                  <Link href="/dashboard/notificacoes" className="text-xs text-blue-400 hover:text-blue-300">
                    Ver todas as notificações
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button
              className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold">
                JD
              </div>
              <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
            </button>
            
            {profileOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <Link href="/dashboard/perfil" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                    Seu Perfil
                  </Link>
                  <Link href="/dashboard/configuracoes" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                    Configurações
                  </Link>
                  <div className="border-t border-gray-700 my-1"></div>
                  <Link href="/logout" className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
