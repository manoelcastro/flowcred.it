"use client";

import { AvaliadorLayout } from '@/components/avaliador/layout/avaliador-layout';
import {
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Edit,
    FileText,
    Filter,
    Plus,
    Search,
    Shield,
    Tag,
    Trash2,
    XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Interface para os parâmetros
interface Parameter {
  id: string;
  name: string;
  description: string;
  type: 'number' | 'boolean' | 'string' | 'date';
  category: string;
  required: boolean;
  consentRequired: boolean;
  validationRules?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// Componente de Card de Parâmetro
function ParameterCard({ parameter, onEdit, onDelete }: {
  parameter: Parameter,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false);

  const typeConfig = {
    number: {
      label: 'Número',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    boolean: {
      label: 'Booleano',
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    string: {
      label: 'Texto',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    date: {
      label: 'Data',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
      <div
        className="p-4 hover:bg-gray-700/30 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-gray-700 flex items-center justify-center text-gray-300">
              <FileText className="h-5 w-5" />
            </div>

            <div className="ml-3">
              <h3 className="text-lg font-medium text-white">{parameter.name}</h3>
              <p className="text-sm text-gray-400">{parameter.description}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className={`px-2 py-1 rounded-full mr-3 ${typeConfig[parameter.type].bgColor}`}>
              <span className={`text-xs font-medium ${typeConfig[parameter.type].color}`}>
                {typeConfig[parameter.type].label}
              </span>
            </div>

            {expanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-700 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Detalhes</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Categoria:</span>
                  <span className="text-xs text-white">{parameter.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Obrigatório:</span>
                  <span className="text-xs text-white flex items-center">
                    {parameter.required ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-400 mr-1" />
                        Sim
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 text-red-400 mr-1" />
                        Não
                      </>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Requer Consentimento:</span>
                  <span className="text-xs text-white flex items-center">
                    {parameter.consentRequired ? (
                      <>
                        <Shield className="h-3 w-3 text-purple-400 mr-1" />
                        Sim
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 text-red-400 mr-1" />
                        Não
                      </>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Criado em:</span>
                  <span className="text-xs text-white">{parameter.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">Atualizado em:</span>
                  <span className="text-xs text-white">{parameter.updatedAt}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-white mb-2">Regras de Validação</h4>
              {parameter.validationRules ? (
                <div className="space-y-2">
                  {parameter.validationRules.min !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Valor Mínimo:</span>
                      <span className="text-xs text-white">{parameter.validationRules.min}</span>
                    </div>
                  )}
                  {parameter.validationRules.max !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Valor Máximo:</span>
                      <span className="text-xs text-white">{parameter.validationRules.max}</span>
                    </div>
                  )}
                  {parameter.validationRules.pattern && (
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Padrão:</span>
                      <span className="text-xs text-white font-mono">{parameter.validationRules.pattern}</span>
                    </div>
                  )}
                  {parameter.validationRules.options && (
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 mb-1">Opções:</span>
                      <div className="flex flex-wrap gap-1">
                        {parameter.validationRules.options.map((option, index) => (
                          <span key={index} className="text-xs bg-gray-700 text-white px-2 py-1 rounded">
                            {option}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Nenhuma regra de validação definida</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              className="flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(parameter.id);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </button>

            <button
              className="flex items-center px-3 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-400 text-sm rounded-md transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(parameter.id);
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ParametersPage() {
  // Estado para filtro e busca
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Dados de exemplo para parâmetros
  const parameters: Parameter[] = [
    {
      id: 'param-1',
      name: 'Score de Crédito',
      description: 'Pontuação de crédito do cliente',
      type: 'number',
      category: 'Financeiro',
      required: true,
      consentRequired: true,
      validationRules: {
        min: 0,
        max: 1000
      },
      createdAt: '10/01/2023',
      updatedAt: '15/05/2023'
    },
    {
      id: 'param-2',
      name: 'Renda Mensal',
      description: 'Renda mensal comprovada do cliente',
      type: 'number',
      category: 'Financeiro',
      required: true,
      consentRequired: true,
      validationRules: {
        min: 0
      },
      createdAt: '15/01/2023',
      updatedAt: '10/05/2023'
    },
    {
      id: 'param-3',
      name: 'Possui Imóvel',
      description: 'Cliente possui imóvel próprio',
      type: 'boolean',
      category: 'Patrimônio',
      required: false,
      consentRequired: true,
      createdAt: '20/01/2023',
      updatedAt: '05/05/2023'
    },
    {
      id: 'param-4',
      name: 'Histórico de Pagamentos',
      description: 'Histórico de pagamentos do cliente',
      type: 'string',
      category: 'Financeiro',
      required: true,
      consentRequired: true,
      validationRules: {
        options: ['Excelente', 'Bom', 'Regular', 'Ruim']
      },
      createdAt: '25/01/2023',
      updatedAt: '01/05/2023'
    },
    {
      id: 'param-5',
      name: 'Data de Nascimento',
      description: 'Data de nascimento do cliente',
      type: 'date',
      category: 'Pessoal',
      required: true,
      consentRequired: true,
      createdAt: '30/01/2023',
      updatedAt: '20/04/2023'
    }
  ];

  // Extrair categorias únicas para o filtro
  const categories = ['all', ...new Set(parameters.map(p => p.category))];

  // Filtrar parâmetros
  const filteredParameters = parameters.filter(parameter => {
    // Filtrar por categoria
    if (categoryFilter !== 'all' && parameter.category !== categoryFilter) {
      return false;
    }

    // Filtrar por tipo
    if (typeFilter !== 'all' && parameter.type !== typeFilter) {
      return false;
    }

    // Filtrar por busca
    if (searchQuery && !parameter.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !parameter.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  // Handlers para ações nos parâmetros
  const handleEditParameter = (id: string) => {
    console.log(`Editar parâmetro ${id}`);
    window.location.href = `/avaliador/parametros/${id}/edit`;
  };

  const handleDeleteParameter = (id: string) => {
    console.log(`Excluir parâmetro ${id}`);
    // Lógica para excluir parâmetro
  };

  return (
    <AvaliadorLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Parâmetros de Avaliação</h1>

          <Link
            href="/avaliador/parametros/novo"
            className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Parâmetro
          </Link>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar parâmetros..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Tag className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-400">Categoria:</span>
                </div>

                <select
                  className="block pl-3 pr-10 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="all">Todas</option>
                  {categories.filter(c => c !== 'all').map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Filter className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-400">Tipo:</span>
                </div>

                <select
                  className="block pl-3 pr-10 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="number">Número</option>
                  <option value="boolean">Booleano</option>
                  <option value="string">Texto</option>
                  <option value="date">Data</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {filteredParameters.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12 text-center backdrop-blur-sm">
            <FileText className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 mb-2">Nenhum parâmetro encontrado</p>
            <p className="text-sm text-gray-500 mb-6">
              {searchQuery || categoryFilter !== 'all' || typeFilter !== 'all'
                ? 'Tente ajustar seus filtros de busca'
                : 'Crie seu primeiro parâmetro de avaliação'}
            </p>

            {!searchQuery && categoryFilter === 'all' && typeFilter === 'all' && (
              <Link
                href="/avaliador/parametros/novo"
                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Novo Parâmetro
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredParameters.map((parameter) => (
              <ParameterCard
                key={parameter.id}
                parameter={parameter}
                onEdit={handleEditParameter}
                onDelete={handleDeleteParameter}
              />
            ))}
          </div>
        )}
      </div>
    </AvaliadorLayout>
  );
}
