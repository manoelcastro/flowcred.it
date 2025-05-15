"use client";

import {
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Download,
    Info,
    Play,
    Zap
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface FlowNode {
  id: string;
  type: string;
  label: string;
  description?: string;
  requiredValue?: string | number;
  comparisonOperator?: string;
  position: { x: number; y: number };
  connectedTo?: string[];
  status?: string;
}

interface CreditFlow {
  id: string;
  name: string;
  description: string;
  institution: {
    name: string;
    logo?: string;
  };
  nodes: FlowNode[];
  edges: { source: string; target: string; label?: string }[];
  successRate?: number;
  requiredDocuments?: string[];
  requiredMetrics?: string[];
}

interface CreditFlowViewerProps {
  flow: CreditFlow;
  onSimulate?: () => void;
}

export function CreditFlowViewer({ flow, onSimulate }: CreditFlowViewerProps) {
  const [expanded, setExpanded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Renderizar o flow no canvas
  useEffect(() => {
    if (!expanded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpar o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Definir dimensões do canvas
    canvas.width = 800;
    canvas.height = 400;

    // Desenhar as conexões (edges)
    ctx.strokeStyle = '#4B5563';
    ctx.lineWidth = 2;

    flow.edges.forEach(edge => {
      const sourceNode = flow.nodes.find(n => n.id === edge.source);
      const targetNode = flow.nodes.find(n => n.id === edge.target);

      if (sourceNode && targetNode) {
        ctx.beginPath();
        ctx.moveTo(sourceNode.position.x + 75, sourceNode.position.y + 30);
        ctx.lineTo(targetNode.position.x, targetNode.position.y + 30);
        ctx.stroke();

        // Desenhar seta
        const arrowSize = 8;
        const angle = Math.atan2(
          targetNode.position.y + 30 - (sourceNode.position.y + 30),
          targetNode.position.x - (sourceNode.position.x + 75)
        );

        ctx.beginPath();
        ctx.moveTo(
          targetNode.position.x - arrowSize * Math.cos(angle - Math.PI / 6),
          targetNode.position.y + 30 - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(targetNode.position.x, targetNode.position.y + 30);
        ctx.lineTo(
          targetNode.position.x - arrowSize * Math.cos(angle + Math.PI / 6),
          targetNode.position.y + 30 - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = '#4B5563';
        ctx.fill();

        // Desenhar label da conexão
        if (edge.label) {
          const midX = (sourceNode.position.x + 75 + targetNode.position.x) / 2;
          const midY = (sourceNode.position.y + 30 + targetNode.position.y + 30) / 2;

          ctx.font = '12px sans-serif';
          ctx.fillStyle = '#9CA3AF';
          ctx.textAlign = 'center';
          ctx.fillText(edge.label, midX, midY - 5);
        }
      }
    });

    // Desenhar os nós
    flow.nodes.forEach(node => {
      // Definir cores baseadas no tipo e status
      let bgColor = '#1F2937';
      let borderColor = '#374151';
      const textColor = '#F9FAFB';

      switch (node.type) {
        case 'metric':
          bgColor = '#1E3A8A';
          borderColor = '#3B82F6';
          break;
        case 'condition':
          bgColor = '#3F2A4F';
          borderColor = '#8B5CF6';
          break;
        case 'document':
          bgColor = '#1E3A3A';
          borderColor = '#10B981';
          break;
        case 'integration':
          bgColor = '#3A291E';
          borderColor = '#F59E0B';
          break;
        case 'result':
          bgColor = '#3A1E1E';
          borderColor = '#EF4444';
          break;
      }

      if (node.status === 'pass') {
        borderColor = '#10B981';
      } else if (node.status === 'fail') {
        borderColor = '#EF4444';
      }

      // Desenhar o retângulo do nó
      ctx.fillStyle = bgColor;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(node.position.x, node.position.y, 150, 60, 8);
      ctx.fill();
      ctx.stroke();

      // Desenhar o texto do nó
      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.position.x + 75, node.position.y + 25);

      // Desenhar descrição ou valor requerido
      if (node.requiredValue !== undefined && node.comparisonOperator) {
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#9CA3AF';
        ctx.fillText(
          `${node.comparisonOperator} ${node.requiredValue}`,
          node.position.x + 75,
          node.position.y + 45
        );
      } else if (node.description) {
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#9CA3AF';
        ctx.fillText(
          node.description.length > 20 ? node.description.substring(0, 20) + '...' : node.description,
          node.position.x + 75,
          node.position.y + 45
        );
      }

      // Desenhar ícone de status
      if (node.status) {
        const iconX = node.position.x + 135;
        const iconY = node.position.y + 15;
        const iconRadius = 8;

        ctx.beginPath();
        ctx.arc(iconX, iconY, iconRadius, 0, Math.PI * 2);

        if (node.status === 'pass') {
          ctx.fillStyle = '#10B981';
        } else if (node.status === 'fail') {
          ctx.fillStyle = '#EF4444';
        } else {
          ctx.fillStyle = '#9CA3AF';
        }

        ctx.fill();

        // Desenhar símbolo dentro do ícone
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (node.status === 'pass') {
          ctx.fillText('✓', iconX, iconY);
        } else if (node.status === 'fail') {
          ctx.fillText('✗', iconX, iconY);
        } else {
          ctx.fillText('?', iconX, iconY);
        }
      }
    });

  }, [expanded, flow]);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden backdrop-blur-sm">
      <div
        className="p-4 hover:bg-gray-700/30 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Zap className="h-5 w-5" />
            </div>

            <div className="ml-3">
              <h3 className="text-lg font-medium text-white">{flow.name}</h3>
              <p className="text-sm text-gray-400">{flow.institution.name}</p>
            </div>
          </div>

          <div className="flex items-center">
            {flow.successRate !== undefined && (
              <div className="mr-4 text-right">
                <p className="text-xs text-gray-400">Taxa de Aprovação</p>
                <p className={`text-sm font-medium ${
                  flow.successRate > 70 ? 'text-green-400' :
                  flow.successRate > 40 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {flow.successRate}%
                </p>
              </div>
            )}

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
          <p className="text-sm text-gray-400 mb-4">{flow.description}</p>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-white mb-2">Requisitos</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3">
                <h5 className="text-xs font-medium text-gray-300 mb-2">Documentos Necessários</h5>
                <ul className="space-y-1">
                  {flow.requiredDocuments?.map((doc, index) => (
                    <li key={index} className="text-xs text-gray-400 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-400" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3">
                <h5 className="text-xs font-medium text-gray-300 mb-2">Métricas Avaliadas</h5>
                <ul className="space-y-1">
                  {flow.requiredMetrics?.map((metric, index) => (
                    <li key={index} className="text-xs text-gray-400 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1 text-blue-400" />
                      {metric}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-white mb-2">Fluxo de Avaliação</h4>
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-2 overflow-auto">
              <canvas
                ref={canvasRef}
                className="w-full h-[400px]"
                style={{ minWidth: '800px' }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              <Info className="h-3 w-3 inline mr-1" />
              Este é o fluxo de avaliação utilizado pela instituição para analisar seu perfil de crédito.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button className="flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Exportar Flow
            </button>

            <button
              className="flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md transition-colors"
              onClick={onSimulate}
            >
              <Play className="h-4 w-4 mr-2" />
              Simular Avaliação
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
