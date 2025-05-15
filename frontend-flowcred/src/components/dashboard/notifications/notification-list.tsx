"use client";

import {
    BarChart3,
    Bell,
    Check,
    FileText,
    Link2,
    MoreVertical,
    Shield,
    Trash2
} from 'lucide-react';
import React, { useState } from 'react';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'access_request' | 'document_verified' | 'metric_generated' | 'integration_connected' | 'system';
  read: boolean;
  actionable?: boolean;
}

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onAction?: (id: string) => void;
}

export function NotificationList({ notifications, onMarkAsRead, onDelete, onAction }: NotificationListProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'access_request':
        return <Shield className="h-6 w-6 text-purple-400" />;
      case 'document_verified':
        return <FileText className="h-6 w-6 text-green-400" />;
      case 'metric_generated':
        return <BarChart3 className="h-6 w-6 text-blue-400" />;
      case 'integration_connected':
        return <Link2 className="h-6 w-6 text-orange-400" />;
      default:
        return <Bell className="h-6 w-6 text-gray-400" />;
    }
  };

  const getTimeAgo = (time: string) => {
    // Aqui poderia ter uma lógica para calcular o tempo relativo
    return time;
  };

  return (
    <div className="divide-y divide-gray-700">
      {notifications.length === 0 ? (
        <div className="p-12 text-center">
          <Bell className="h-12 w-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400 mb-2">Nenhuma notificação</p>
          <p className="text-sm text-gray-500">
            Você será notificado sobre solicitações de acesso e atualizações importantes
          </p>
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-gray-700/30 transition-colors ${
              !notification.read ? 'bg-gray-800/50' : ''
            }`}
          >
            <div className="flex">
              <div className="flex-shrink-0 mt-1">
                {getIcon(notification.type)}
              </div>

              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <p className={`text-sm font-medium ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                    {notification.title}
                  </p>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-400 mr-2">
                      {getTimeAgo(notification.time)}
                    </span>

                    <button
                      className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-700"
                      onClick={(e) => toggleMenu(notification.id, e)}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {activeMenu === notification.id && (
                      <div className="absolute mt-1 right-6 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          {!notification.read && (
                            <button
                              className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkAsRead(notification.id);
                                setActiveMenu(null);
                              }}
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Marcar como lida
                            </button>
                          )}
                          <button
                            className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(notification.id);
                              setActiveMenu(null);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <p className="mt-1 text-sm text-gray-400">
                  {notification.description}
                </p>

                {notification.actionable && (
                  <div className="mt-3 flex space-x-3">
                    <button
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors"
                      onClick={() => onAction && onAction(notification.id)}
                    >
                      Ver Detalhes
                    </button>
                    {notification.type === 'access_request' && (
                      <>
                        <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md transition-colors">
                          Aprovar
                        </button>
                        <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-md transition-colors">
                          Recusar
                        </button>
                      </>
                    )}
                  </div>
                )}

                {!notification.read && (
                  <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-500"></div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
