"use client";

import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ArrowRight,
  FileText,
  BarChart3,
  Link2,
  RefreshCw,
  Download,
  Zap
} from 'lucide-react';

interface SimulationStep {
  id: string;
  type: 'metric' | 'document' | 'integration' | 'condition' | 'result';
  name: string;
  description?: string;
  status: 'pending' | 'processing' | 'success' | 'failure' | 'warning';
  value?: string | number;
  requiredValue?: string | number;
  comparisonOperator?: '<' | '>' | '=' | '<=' | '>=' | '!=';
  message?: string;
}

interface SimulationResult {
  approved: boolean;
  score: number;
  maxScore: number;
  message: string;
  missingRequirements?: {
    type: 'document' | 'metric' | 'integration';
    name: string;
  }[];
  potentialOfferDetails?: {
    type: string;
    amount: string;
    interestRate: string;
    term: string;
  };
}

interface CreditFlowSimulatorProps {
  flowId: string;
  flowName: string;
  institutionName: string;
  onClose: () => void;
}

export function CreditFlowSimulator({ 
  flowId, 
  flowName, 
  institutionName, 
  onClose 
}: CreditFlowSimulatorProps) {
  const [simulationState, setSimulationState] = useState<'initial' | 'running' | 'complete'>('initial');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  
  // Dados de exemplo para os passos da simulação
  const [steps, setSteps] = useState<SimulationStep[]>([
    {
      id: 'doc1',
      type: 'document',
      name: 'Verificação de Documentos',
      description: 'Verificando documentos necessários para avaliação',
      status: 'pending',
    },
    {
      id: 'metric1',
      type: 'metric',
      name: 'Score de Crédito',
      description: 'Verificando score de crédito',
      status: 'pending',
      value: 780,
      requiredValue: 700,
      comparisonOperator: '>=',
    },
    {
      id: 'metric2',
      type: 'metric',
      name: 'Índice de Liquidez',
      description: 'Verificando índice de liquidez',
      status: 'pending',
      value: 1.8,
      requiredValue: 1.5,
      comparisonOperator: '>=',
    },
    {
      id: 'integration1',
      type: 'integration',
      name: 'Verificação de Open Finance',
      description: 'Verificando dados bancários via Open Finance',
      status: 'pending',
    },
    {
      id: 'condition1',
      type: 'condition',
      name: 'Análise de Risco',
      description: 'Avaliando risco geral do perfil',
      status: 'pending',
    },
    {
      id: 'result1',
      type: 'result',
      name: 'Resultado Final',
      description: 'Determinando resultado da avaliação',
      status: 'pending',
    },
  ]);
  
  const startSimulation = () => {
    setSimulationState('running');
    setCurrentStepIndex(0);
    
    // Resetar status dos passos
    setSteps(steps.map(step => ({ ...step, status: 'pending' })));
    
    // Iniciar o primeiro passo
    processStep(0);
  };
  
  const processStep = (index: number) => {
    if (index >= steps.length) {
      completeSimulation();
      return;
    }
    
    // Atualizar o passo atual para "processing"
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      newSteps[index] = { ...newSteps[index], status: 'processing' };
      return newSteps;
    });
    
    // Simular processamento
    setTimeout(() => {
      // Determinar o resultado do passo
      let stepResult: 'success' | 'failure' | 'warning' = 'success';
      let message = '';
      
      const step = steps[index];
      
      if (step.type === 'metric' && step.value !== undefined && step.requiredValue !== undefined && step.comparisonOperator) {
        // Verificar se o valor atende ao requisito
        let passes = false;
        switch (step.comparisonOperator) {
          case '>':
            passes = step.value > step.requiredValue;
            break;
          case '<':
            passes = step.value < step.requiredValue;
            break;
          case '=':
            passes = step.value === step.requiredValue;
            break;
          case '>=':
            passes = step.value >= step.requiredValue;
            break;
          case '<=':
            passes = step.value <= step.requiredValue;
            break;
          case '!=':
            passes = step.value !== step.requiredValue;
            break;
        }
        
        if (!passes) {
          stepResult = 'failure';
          message = `Valor ${step.value} não atende ao requisito ${step.comparisonOperator} ${step.requiredValue}`;
        }
      } else if (step.id === 'doc1') {
        // Simular que um documento está faltando
        stepResult = 'warning';
        message = 'Comprovante de renda não encontrado';
      }
      
      // Atualizar o status do passo
      setSteps(prevSteps => {
        const newSteps = [...prevSteps];
        newSteps[index] = { 
          ...newSteps[index], 
          status: stepResult,
          message: message || undefined
        };
        return newSteps;
      });
      
      // Avançar para o próximo passo
      setCurrentStepIndex(index + 1);
      
      // Se o passo falhou e é crítico, encerrar a simulação
      if (stepResult === 'failure' && (step.type === 'condition' || step.type === 'result')) {
        completeSimulation(false);
        return;
      }
      
      // Processar o próximo passo
      processStep(index + 1);
    }, 1500); // Simular um delay de 1.5 segundos
  };
  
  const completeSimulation = (success = true) => {
    // Determinar o resultado final
    const failedSteps = steps.filter(step => step.status === 'failure');
    const warningSteps = steps.filter(step => step.status === 'warning');
    
    const approved = success && failedSteps.length === 0;
    const score = Math.round((steps.length - failedSteps.length - (warningSteps.length * 0.5)) / steps.length * 100);
    
    // Criar o resultado da simulação
    const result: SimulationResult = {
      approved,
      score,
      maxScore: 100,
      message: approved 
        ? 'Sua avaliação foi aprovada! Você atende aos critérios para obter crédito.'
        : 'Sua avaliação não foi aprovada. Alguns requisitos não foram atendidos.',
      missingRequirements: [
        ...failedSteps.map(step => ({ type: step.type as any, name: step.name })),
        ...warningSteps.map(step => ({ type: step.type as any, name: step.name }))
      ],
    };
    
    // Se aprovado, adicionar detalhes da oferta potencial
    if (approved) {
      result.potentialOfferDetails = {
        type: 'Empréstimo Pessoal',
        amount: 'R$ 30.000,00',
        interestRate: '1,99% a.m.',
        term: '36 meses',
      };
    }
    
    setSimulationResult(result);
    setSimulationState('complete');
  };
  
  const resetSimulation = () => {
    setSimulationState('initial');
    setCurrentStepIndex(0);
    setSimulationResult(null);
    setSteps(steps.map(step => ({ ...step, status: 'pending', message: undefined })));
  };
  
  const getStepIcon = (step: SimulationStep) => {
    switch (step.type) {
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'metric':
        return <BarChart3 className="h-5 w-5" />;
      case 'integration':
        return <Link2 className="h-5 w-5" />;
      case 'condition':
        return <AlertTriangle className="h-5 w-5" />;
      case 'result':
        return <Zap className="h-5 w-5" />;
      default:
        return <ArrowRight className="h-5 w-5" />;
    }
  };
  
  const getStepIconColor = (step: SimulationStep) => {
    switch (step.type) {
      case 'document':
        return 'text-green-400';
      case 'metric':
        return 'text-blue-400';
      case 'integration':
        return 'text-orange-400';
      case 'condition':
        return 'text-purple-400';
      case 'result':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };
  
  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'failure':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'processing':
        return (
          <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        );
      default:
        return <div className="h-5 w-5 rounded-full border border-gray-600"></div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-white">Simulação de Avaliação</h2>
            <p className="text-sm text-gray-400">
              {flowName} - {institutionName}
            </p>
          </div>
          
          <button 
            className="text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {simulationState === 'initial' && (
            <div className="text-center py-8">
              <div className="h-16 w-16 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 mx-auto mb-4">
                <Play className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Pronto para Simular?</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Esta simulação irá avaliar seu perfil com base nos critérios utilizados por {institutionName} para determinar sua elegibilidade para crédito.
              </p>
              <button
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                onClick={startSimulation}
              >
                Iniciar Simulação
              </button>
            </div>
          )}
          
          {simulationState === 'running' && (
            <div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Progresso</span>
                  <span className="text-sm text-white">{currentStepIndex} de {steps.length} etapas</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${(currentStepIndex / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div 
                    key={step.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      index === currentStepIndex - 1
                        ? 'bg-gray-800/80 border-purple-500/50'
                        : 'bg-gray-800/50 border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-lg bg-gray-700 flex items-center justify-center ${getStepIconColor(step)}`}>
                          {getStepIcon(step)}
                        </div>
                        
                        <div className="ml-3">
                          <h4 className="text-sm font-medium text-white">{step.name}</h4>
                          <p className="text-xs text-gray-400">{step.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        {step.value !== undefined && step.requiredValue !== undefined && (
                          <div className="mr-4 text-right">
                            <p className="text-xs text-gray-400">Valor</p>
                            <p className="text-sm font-medium text-white">{step.value} {step.comparisonOperator} {step.requiredValue}</p>
                          </div>
                        )}
                        
                        {getStepStatusIcon(step.status)}
                      </div>
                    </div>
                    
                    {step.message && (
                      <div className={`mt-3 text-xs p-2 rounded ${
                        step.status === 'failure' 
                          ? 'bg-red-900/20 text-red-400' 
                          : step.status === 'warning'
                            ? 'bg-yellow-900/20 text-yellow-400'
                            : 'bg-green-900/20 text-green-400'
                      }`}>
                        {step.message}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {simulationState === 'complete' && simulationResult && (
            <div>
              <div className="text-center py-6">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  simulationResult.approved 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {simulationResult.approved 
                    ? <CheckCircle className="h-8 w-8" />
                    : <XCircle className="h-8 w-8" />
                  }
                </div>
                
                <h3 className="text-xl font-medium text-white mb-2">
                  {simulationResult.approved 
                    ? 'Avaliação Aprovada!' 
                    : 'Avaliação Não Aprovada'
                  }
                </h3>
                
                <p className="text-gray-400 mb-4 max-w-md mx-auto">
                  {simulationResult.message}
                </p>
                
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800 mb-6">
                  <span className="text-sm text-gray-400 mr-2">Pontuação:</span>
                  <span className={`text-sm font-medium ${
                    simulationResult.score > 70 ? 'text-green-400' : 
                    simulationResult.score > 40 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {simulationResult.score}/{simulationResult.maxScore}
                  </span>
                </div>
              </div>
              
              {simulationResult.approved && simulationResult.potentialOfferDetails && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-white mb-3">Oferta Potencial</h4>
                  <div className="bg-gray-800/50 border border-green-500/30 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Tipo</p>
                        <p className="text-sm font-medium text-white">{simulationResult.potentialOfferDetails.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Valor</p>
                        <p className="text-sm font-medium text-white">{simulationResult.potentialOfferDetails.amount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Taxa de Juros</p>
                        <p className="text-sm font-medium text-white">{simulationResult.potentialOfferDetails.interestRate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Prazo</p>
                        <p className="text-sm font-medium text-white">{simulationResult.potentialOfferDetails.term}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors">
                        Solicitar Esta Oferta
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {!simulationResult.approved && simulationResult.missingRequirements && simulationResult.missingRequirements.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-white mb-3">Requisitos Não Atendidos</h4>
                  <div className="bg-gray-800/50 border border-red-500/30 rounded-lg p-4">
                    <ul className="space-y-2">
                      {simulationResult.missingRequirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <XCircle className="h-4 w-4 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-300">{req.name}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
                      <p className="text-xs text-gray-400">
                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                        Melhore seu perfil adicionando os documentos faltantes ou melhorando suas métricas financeiras.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                <button
                  className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors"
                  onClick={resetSimulation}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reiniciar Simulação
                </button>
                
                <button
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Resultado
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
