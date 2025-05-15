"use client";

import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout';
import {
    AlertTriangle,
    Bell,
    Calendar,
    CheckCircle,
    Filter,
    RefreshCw,
    Search,
    Shield,
    Trash2,
    Users,
    XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Interface para as notificações
interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'credit_request' | 'risk_alert' | 'consent_expiring' | 'evaluation_scheduled' | 'system';
  createdAt: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  relatedClient?: {
    id: string;
    name: string;
  };
}

// Componente de Card de Notificação
function NotificationCard({ notification, onMarkAsRead, onDelete }: {
  notification: Notification,
  onMarkAsRead: (id: string) => void,
  onDelete: (id: string) => void
}) {
  const typeConfig = {
    credit_request: {
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    risk_alert: {
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
    },
    consent_expiring: {
      icon: Shield,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    evaluation_scheduled: {
      icon: Calendar,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    system: {
      icon: Bell,
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/20',
    }
  };

  const TypeIcon = typeConfig[notification.type].icon;

  return (
    <div className={`bg-gray-800/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm ${!notification.read ? 'border-l-4 border-l-purple-500' : ''}`}>
      <div className="flex">
        <div className={`h-10 w-10 rounded-lg ${typeConfig[notification.type].bgColor} flex items-center justify-center ${typeConfig[notification.type].color} flex-shrink-0`}>
          <TypeIcon className="h-5 w-5" />
        </div>

        <div className="ml-4 flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-white">{notification.title}</h3>
            <span className="text-xs text-gray-400">{notification.createdAt}</span>
          </div>

          <p className="text-sm text-gray-300 mt-1">{notification.description}</p>

          {notification.relatedClient && (
            <div className="mt-2 flex items-center">
              <Users className="h-3 w-3 text-gray-400 mr-1" />
              <Link
                href={`/avaliador/clientes/${notification.relatedClient.id}`}
                className="text-xs text-purple-400 hover:text-purple-300"
              >
                {notification.relatedClient.name}
              </Link>
            </div>
          )}

          <div className="mt-4 flex justify-between">
            <div className="flex space-x-2">
              {!notification.read && (
                <button
                  className="flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-md transition-colors"
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Marcar como lida
                </button>
              )}

              <button
                className="flex items-center px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs rounded-md transition-colors"
                onClick={() => onDelete(notification.id)}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Excluir
              </button>
            </div>

            {notification.actionUrl && notification.actionLabel && (
              <Link
                href={notification.actionUrl}
                className="flex items-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-md transition-colors"
              >
                {notification.actionLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  // Estado para filtro e busca
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [readFilter, setReadFilter] = useState<string>('all');

  // Dados de exemplo para notificações
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      title: 'Nova Solicitação de Crédito',
      description: 'João da Silva solicitou uma avaliação de crédito. Revise os documentos e métricas para aprovar ou rejeitar.',
      type: 'credit_request',
      createdAt: '5 minutos atrás',
      read: false,
      actionUrl: '/avaliador/solicitacoes/sol-123',
      actionLabel: 'Avaliar Agora',
      relatedClient: {
        id: 'client-1',
        name: 'João da Silva'
      }
    },
    {
      id: 'notif-2',
      title: 'Alerta de Risco',
      description: 'Detectamos um aumento significativo no risco de crédito para Carlos Pereira. Recomendamos uma reavaliação.',
      type: 'risk_alert',
      createdAt: '2 horas atrás',
      read: false,
      actionUrl: '/avaliador/clientes/client-3',
      actionLabel: 'Ver Cliente',
      relatedClient: {
        id: 'client-3',
        name: 'Carlos Pereira'
      }
    },
    {
      id: 'notif-3',
      title: 'Consentimento Expirando',
      description: 'O consentimento de Ana Santos expira em 7 dias. Solicite renovação para continuar o monitoramento.',
      type: 'consent_expiring',
      createdAt: '1 dia atrás',
      read: true,
      actionUrl: '/avaliador/consentimentos/consent-456',
      actionLabel: 'Renovar Consentimento',
      relatedClient: {
        id: 'client-4',
        name: 'Ana Santos'
      }
    },
    {
      id: 'notif-4',
      title: 'Reavaliação Agendada',
      description: 'A reavaliação de Ana Santos está agendada para amanhã. Prepare-se para revisar as métricas atualizadas.',
      type: 'evaluation_scheduled',
      createdAt: '2 dias atrás',
      read: true,
      relatedClient: {
        id: 'client-4',
        name: 'Ana Santos'
      }
    },
    {
      id: 'notif-5',
      title: 'Atualização do Sistema',
      description: 'Novos parâmetros de avaliação foram adicionados ao sistema. Revise as configurações dos seus flows.',
      type: 'system',
      createdAt: '3 dias atrás',
      read: true,
      actionUrl: '/avaliador/parametros',
      actionLabel: 'Ver Parâmetros'
    }
  ]);

  // Filtrar notificações
  const filteredNotifications = notifications.filter(notification => {
    // Filtrar por tipo
    if (typeFilter !== 'all' && notification.type !== typeFilter) {
      return false;
    }

    // Filtrar por status de leitura
    if (readFilter === 'read' && !notification.read) {
      return false;
    }
    if (readFilter === 'unread' && notification.read) {
      return false;
    }

    // Filtrar por busca
    if (searchQuery && !notification.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !notification.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Handlers para ações nas notificações
  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Notificações</h1>

          <button
            className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
            onClick={handleMarkAllAsRead}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar todas como lidas
          </button>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar notificações..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-400">Tipo:</span>
                </div>

                <select
                  className="block pl-3 pr-10 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="credit_request">Solicitações</option>
                  <option value="risk_alert">Alertas de Risco</option>
                  <option value="consent_expiring">Consentimentos</option>
                  <option value="evaluation_scheduled">Agendamentos</option>
                  <option value="system">Sistema</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Filter className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-400">Status:</span>
                </div>

                <select
                  className="block pl-3 pr-10 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  value={readFilter}
                  onChange={(e) => setReadFilter(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="read">Lidas</option>
                  <option value="unread">Não lidas</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <Bell className="h-5 w-5 text-purple-400 mr-2" />
              <h3 className="text-lg font-medium text-white">Total</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {notifications.length}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Notificações recebidas
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <XCircle className="h-5 w-5 text-blue-400 mr-2" />
              <h3 className="text-lg font-medium text-white">Não Lidas</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {notifications.filter(n => !n.read).length}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Notificações pendentes
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              <h3 className="text-lg font-medium text-white">Alertas</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {notifications.filter(n => n.type === 'risk_alert').length}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Alertas de risco
            </p>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center backdrop-blur-sm">
            <Bell className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 mb-2">Nenhuma notificação encontrada</p>
            <p className="text-sm text-gray-500 mb-6">
              {searchQuery || typeFilter !== 'all' || readFilter !== 'all'
                ? 'Tente ajustar seus filtros de busca'
                : 'Você não tem notificações no momento'}
            </p>

            <button
              className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setReadFilter('all');
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
