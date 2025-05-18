'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pinataSDKService } from '@/lib/ipfs/pinataSDKService';
import { useState } from 'react';

export default function PinataTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ipfsHash, setIpfsHash] = useState<string>('');
  const [retrievedData, setRetrievedData] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  // Testar autenticação
  const testAuthentication = async () => {
    setIsLoading(true);
    try {
      const result = await pinataSDKService.testAuthentication();
      setTestResult(result ? 'Autenticação bem-sucedida!' : 'Falha na autenticação.');
    } catch (error) {
      console.error('Erro ao testar autenticação:', error);
      setTestResult(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fazer upload de JSON
  const uploadJSON = async () => {
    setIsLoading(true);
    try {
      const testData = {
        message: 'Teste de upload para o IPFS via Pinata',
        timestamp: new Date().toISOString(),
        random: Math.random()
      };
      
      const hash = await pinataSDKService.pinJSON(testData, 'test-json');
      setIpfsHash(hash);
      setTestResult(`Upload bem-sucedido! Hash IPFS: ${hash}`);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setTestResult(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fazer upload de arquivo
  const uploadFile = async () => {
    if (!file) {
      setTestResult('Selecione um arquivo primeiro.');
      return;
    }

    setIsLoading(true);
    try {
      const hash = await pinataSDKService.pinFile(file, file.name);
      setIpfsHash(hash);
      setTestResult(`Upload bem-sucedido! Hash IPFS: ${hash}`);
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      setTestResult(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Recuperar dados
  const retrieveData = async () => {
    if (!ipfsHash) {
      setTestResult('Informe um hash IPFS primeiro.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await pinataSDKService.getJSON(ipfsHash);
      setRetrievedData(JSON.stringify(data, null, 2));
      setTestResult('Dados recuperados com sucesso!');
    } catch (error) {
      console.error('Erro ao recuperar dados:', error);
      setTestResult(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      setRetrievedData('');
    } finally {
      setIsLoading(false);
    }
  };

  // Manipular seleção de arquivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Teste de Integração com Pinata</CardTitle>
        <CardDescription>
          Teste as funcionalidades de upload e recuperação de dados do IPFS via Pinata
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Button onClick={testAuthentication} disabled={isLoading}>
            {isLoading ? 'Testando...' : 'Testar Autenticação'}
          </Button>
        </div>

        <div className="space-y-2">
          <Button onClick={uploadJSON} disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar JSON de Teste'}
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Selecione um arquivo</Label>
          <Input id="file" type="file" onChange={handleFileChange} />
          <Button onClick={uploadFile} disabled={isLoading || !file} className="mt-2">
            {isLoading ? 'Enviando...' : 'Enviar Arquivo'}
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ipfsHash">Hash IPFS</Label>
          <Input
            id="ipfsHash"
            value={ipfsHash}
            onChange={(e) => setIpfsHash(e.target.value)}
            placeholder="Digite o hash IPFS"
          />
          <Button onClick={retrieveData} disabled={isLoading || !ipfsHash} className="mt-2">
            {isLoading ? 'Recuperando...' : 'Recuperar Dados'}
          </Button>
        </div>

        {testResult && (
          <div className="p-4 bg-gray-100 rounded-md">
            <p className="font-medium">Resultado:</p>
            <p>{testResult}</p>
          </div>
        )}

        {retrievedData && (
          <div className="p-4 bg-gray-100 rounded-md">
            <p className="font-medium">Dados Recuperados:</p>
            <pre className="whitespace-pre-wrap overflow-auto max-h-60">{retrievedData}</pre>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-gray-500">
          Certifique-se de que as variáveis de ambiente estão configuradas corretamente.
        </p>
      </CardFooter>
    </Card>
  );
}
