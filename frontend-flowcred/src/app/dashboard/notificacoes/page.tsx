"use client";

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout';
import { NotificationList } from '@/components/dashboard/notifications/notification-list';
import { Bell, Filter, CheckSquare, Trash2 } from 'lucide-react';

export default function NotificacoesPage() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'actionable'>('all');
  
  // Dados de exemplo para notificações
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Solicitação de Acesso',
      description: 'Banco XYZ solicita acesso às suas métricas financeiras',
      time: '5 min atrás',
      type: 'access_request' as const,
      read: false,
      actionable: true,
    },
    {
      id: '2',
      title: 'Documento Verificado',
      description: 'Seu balanço patrimonial foi verificado com sucesso',
      time: '1 hora atrás',
      type: 'document_verified' as const,
      read: false,
      actionable: true,
    },
    {
      id: '3',
      title: 'Nova Métrica Disponível',
      description: 'Índice de liquidez calculado com base nos seus documentos',
      time: '3 horas atrás',
      type: 'metric_generated' as const,
      read: true,
      actionable: true,
    },
    {
      id: '4',
      title: 'Integração Conectada',
      description: 'Sua conta do Open Finance foi conectada com sucesso',
      time: '1 dia atrás',
      type: 'integration_connected' as const,
      read: true,
      actionable: false,
    },
    {
      id: '5',
      title: 'Solicitação de Acesso',
      description: 'Financeira ABC solicita acesso às suas métricas de identidade',
      time: '2 dias atrás',
      type: 'access_request' as const,
      read: true,
      actionable: true,
    },
    {
      id: '6',
      title: 'Atualização do Sistema',
      description: 'Novas funcionalidades foram adicionadas à plataforma',
      time: '3 dias atrás',
      type: 'system' as const,
      read: true,
      actionable: false,
    },
  ]);
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };
  
  const handleDelete = (id: string) => {
    setNotifications(
      notifications.filter(notification => notification.id !== id)
    );
  };
  
  const handleAction = (id: string) => {
    console.log(`Ação para notificação ${id}`);
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const handleDeleteAll = () => {
    setNotifications([]);
  };
  
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'actionable') return notification.actionable;
    return true;
  });
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">Notificações</h1>
            {unreadCount > 0 && (
              <span className="ml-3 px-2 py-1 text-xs rounded-full bg-blue-500 text-white">
                {unreadCount} não lidas
              </span>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button 
              className="flex items-center px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </button>
            
            <button 
              className="flex items-center px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
              onClick={handleDeleteAll}
              disabled={notifications.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpar todas
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm mb-8">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-blue-400 mr-2" />
            <h2 className="text-lg font-semibold text-white">Centro de Notificações</h2>
          </div>
          <p className="text-sm text-gray-400">
            Aqui você encontra todas as notificações sobre solicitações de acesso, documentos verificados, métricas geradas e outras atualizações importantes.
          </p>
        </div>
        
        <div className="mb-6">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setFilter('all')}
            >
              Todas ({notifications.length})
            </button>
            
            <button
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                filter === 'unread'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setFilter('unread')}
            >
              Não lidas ({unreadCount})
            </button>
            
            <button
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                filter === 'actionable'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setFilter('actionable')}
            >
              Acionáveis ({notifications.filter(n => n.actionable).length})
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">
              {filter === 'all' && 'Todas as Notificações'}
              {filter === 'unread' && 'Notificações Não Lidas'}
              {filter === 'actionable' && 'Notificações Acionáveis'}
            </h2>
          </div>
          
          <NotificationList 
            notifications={filteredNotifications}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
            onAction={handleAction}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
