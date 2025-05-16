"use client";

import { AvaliadorLayout } from '@/components/avaliador/layout/avaliador-layout';
import {
    AlertTriangle,
    BarChart3,
    CheckCircle,
    FileText,
    Link2,
    Play,
    Save
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import ReactFlow, {
    addEdge,
    Background,
    Connection,
    Controls,
    Edge,
    MiniMap,
    Node,
    NodeTypes,
    ReactFlowProvider,
    useEdgesState,
    useNodesState
} from 'reactflow';
import 'reactflow/dist/style.css';

// Componentes de nós personalizados
const DocumentNode = ({ data }: any) => {
  return (
    <div className="p-3 rounded-lg border border-green-500 bg-green-500/10 text-white min-w-[180px]">
      <div className="flex items-center mb-2">
        <FileText className="h-5 w-5 text-green-400 mr-2" />
        <div className="text-sm font-medium">{data.label}</div>
      </div>
      <div className="text-xs text-gray-300">{data.description || 'Verificação de documento'}</div>
    </div>
  );
};

const MetricNode = ({ data }: any) => {
  return (
    <div className="p-3 rounded-lg border border-blue-500 bg-blue-500/10 text-white min-w-[180px]">
      <div className="flex items-center mb-2">
        <BarChart3 className="h-5 w-5 text-blue-400 mr-2" />
        <div className="text-sm font-medium">{data.label}</div>
      </div>
      <div className="text-xs text-gray-300">
        {data.operator && data.value
          ? `${data.operator} ${data.value}`
          : 'Verificação de métrica'}
      </div>
    </div>
  );
};

const IntegrationNode = ({ data }: any) => {
  return (
    <div className="p-3 rounded-lg border border-orange-500 bg-orange-500/10 text-white min-w-[180px]">
      <div className="flex items-center mb-2">
        <Link2 className="h-5 w-5 text-orange-400 mr-2" />
        <div className="text-sm font-medium">{data.label}</div>
      </div>
      <div className="text-xs text-gray-300">{data.description || 'Integração externa'}</div>
    </div>
  );
};

const ConditionNode = ({ data }: any) => {
  return (
    <div className="p-3 rounded-lg border border-purple-500 bg-purple-500/10 text-white min-w-[180px]">
      <div className="flex items-center mb-2">
        <AlertTriangle className="h-5 w-5 text-purple-400 mr-2" />
        <div className="text-sm font-medium">{data.label}</div>
      </div>
      <div className="text-xs text-gray-300">{data.description || 'Condição de avaliação'}</div>
    </div>
  );
};

const ResultNode = ({ data }: any) => {
  return (
    <div className="p-3 rounded-lg border border-red-500 bg-red-500/10 text-white min-w-[180px]">
      <div className="flex items-center mb-2">
        <CheckCircle className="h-5 w-5 text-red-400 mr-2" />
        <div className="text-sm font-medium">{data.label}</div>
      </div>
      <div className="text-xs text-gray-300">{data.description || 'Resultado final'}</div>
    </div>
  );
};

// Definição dos tipos de nós
const nodeTypes: NodeTypes = {
  documentNode: DocumentNode,
  metricNode: MetricNode,
  integrationNode: IntegrationNode,
  conditionNode: ConditionNode,
  resultNode: ResultNode,
};

// Componente de Sidebar para o Editor
function FlowEditorSidebar({ onAddNode }: { onAddNode: (type: string) => void }) {
  return (
    <div className="bg-gray-800 border-l border-gray-700 w-64 p-4 overflow-y-auto">
      <h3 className="text-sm font-semibold text-white mb-4">Blocos Disponíveis</h3>

      <div className="space-y-3">
        <div
          className="p-3 rounded-lg border border-green-500 bg-green-500/10 text-white cursor-pointer hover:bg-green-500/20 transition-colors"
          onClick={() => onAddNode('documentNode')}
        >
          <div className="flex items-center mb-1">
            <FileText className="h-4 w-4 text-green-400 mr-2" />
            <div className="text-sm font-medium">Documento</div>
          </div>
          <div className="text-xs text-gray-300">Verificação de documento</div>
        </div>

        <div
          className="p-3 rounded-lg border border-blue-500 bg-blue-500/10 text-white cursor-pointer hover:bg-blue-500/20 transition-colors"
          onClick={() => onAddNode('metricNode')}
        >
          <div className="flex items-center mb-1">
            <BarChart3 className="h-4 w-4 text-blue-400 mr-2" />
            <div className="text-sm font-medium">Métrica</div>
          </div>
          <div className="text-xs text-gray-300">Verificação de métrica</div>
        </div>

        <div
          className="p-3 rounded-lg border border-orange-500 bg-orange-500/10 text-white cursor-pointer hover:bg-orange-500/20 transition-colors"
          onClick={() => onAddNode('integrationNode')}
        >
          <div className="flex items-center mb-1">
            <Link2 className="h-4 w-4 text-orange-400 mr-2" />
            <div className="text-sm font-medium">Integração</div>
          </div>
          <div className="text-xs text-gray-300">Integração externa</div>
        </div>

        <div
          className="p-3 rounded-lg border border-purple-500 bg-purple-500/10 text-white cursor-pointer hover:bg-purple-500/20 transition-colors"
          onClick={() => onAddNode('conditionNode')}
        >
          <div className="flex items-center mb-1">
            <AlertTriangle className="h-4 w-4 text-purple-400 mr-2" />
            <div className="text-sm font-medium">Condição</div>
          </div>
          <div className="text-xs text-gray-300">Condição de avaliação</div>
        </div>

        <div
          className="p-3 rounded-lg border border-red-500 bg-red-500/10 text-white cursor-pointer hover:bg-red-500/20 transition-colors"
          onClick={() => onAddNode('resultNode')}
        >
          <div className="flex items-center mb-1">
            <CheckCircle className="h-4 w-4 text-red-400 mr-2" />
            <div className="text-sm font-medium">Resultado</div>
          </div>
          <div className="text-xs text-gray-300">Resultado final</div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-white mb-4">Propriedades</h3>
        <div className="p-3 rounded-lg border border-gray-700 bg-gray-700/30 text-white">
          <p className="text-xs text-gray-400">Selecione um nó para editar suas propriedades</p>
        </div>
      </div>
    </div>
  );
}

// Componente principal do Editor de Flows
function FlowEditor() {
  // Estado para nós e arestas
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Estado para o nó selecionado
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Referência para o wrapper do ReactFlow
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Referência para a instância do ReactFlow
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Estado para o nome e descrição do flow
  const [flowName, setFlowName] = useState('Novo Flow de Avaliação');
  const [flowDescription, setFlowDescription] = useState('Descrição do flow');

  // Handler para conexão de nós
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Handler para adicionar um novo nó
  const onAddNode = useCallback(
    (type: string) => {
      if (!reactFlowInstance) return;

      const position = reactFlowInstance.project({
        x: Math.random() * 400,
        y: Math.random() * 400,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          label: type === 'documentNode' ? 'Documento' :
                 type === 'metricNode' ? 'Métrica' :
                 type === 'integrationNode' ? 'Integração' :
                 type === 'conditionNode' ? 'Condição' : 'Resultado'
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  // Handler para salvar o flow
  const onSave = useCallback(() => {
    if (!reactFlowInstance) return;

    const flow = reactFlowInstance.toObject();
    console.log(flow);

    // Aqui você implementaria a lógica para salvar o flow no backend
    alert('Flow salvo com sucesso!');
  }, [reactFlowInstance]);

  // Handler para testar o flow
  const onTest = useCallback(() => {
    if (!reactFlowInstance) return;

    // Aqui você implementaria a lógica para testar o flow
    alert('Iniciando teste do flow...');
  }, [reactFlowInstance]);

  // Handler para selecionar um nó
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div>
            <input
              type="text"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              className="bg-transparent border-none text-xl font-bold text-white focus:outline-none focus:ring-0 p-0"
            />
            <input
              type="text"
              value={flowDescription}
              onChange={(e) => setFlowDescription(e.target.value)}
              className="bg-transparent border-none text-sm text-gray-400 focus:outline-none focus:ring-0 p-0 mt-1 w-full"
            />
          </div>

          <div className="flex space-x-2">
            <button
              className="flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
              onClick={onTest}
            >
              <Play className="h-4 w-4 mr-2" />
              Testar
            </button>

            <button
              className="flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
              onClick={onSave}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
          >
            <Controls />
            <MiniMap
              nodeStrokeWidth={3}
              zoomable
              pannable
              style={{ backgroundColor: '#1F2937' }}
            />
            <Background color="#374151" gap={16} />
          </ReactFlow>
        </div>

        <FlowEditorSidebar onAddNode={onAddNode} />
      </div>
    </div>
  );
}

// Página principal do Editor de Flows
export default function NewFlowPage() {
  return (
    <AvaliadorLayout>
      <ReactFlowProvider>
        <FlowEditor />
      </ReactFlowProvider>
    </AvaliadorLayout>
  );
}
