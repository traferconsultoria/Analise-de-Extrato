
import React, { useState, useMemo, useCallback } from 'react';
import { AppState, BankStatementData, Transaction } from './types';
import { extractTextFromPDF, extractTextFromExcel } from './services/fileService';
import { parseStatementText } from './services/geminiService';
import Header from './components/Header';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [data, setData] = useState<BankStatementData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setState(AppState.LOADING);
    setError(null);

    try {
      let text = "";
      if (file.type === "application/pdf") {
        text = await extractTextFromPDF(file);
      } else if (
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      ) {
        text = await extractTextFromExcel(file);
      } else {
        throw new Error("Formato de arquivo não suportado. Use PDF ou Excel.");
      }

      if (!text.trim()) {
        throw new Error("O arquivo parece estar vazio ou não pôde ser lido.");
      }

      const parsedData = await parseStatementText(text);
      setData(parsedData);
      setState(AppState.LOADED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro ao processar o arquivo.");
      setState(AppState.ERROR);
    }
  };

  const filteredTransactions = useMemo(() => {
    if (!data) return [];
    if (!searchTerm.trim()) return data.transactions;

    const term = searchTerm.toLowerCase();
    return data.transactions.filter(t => 
      t.description.toLowerCase().includes(term)
    );
  }, [data, searchTerm]);

  const stats = useMemo(() => {
    const total = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);
    const count = filteredTransactions.length;
    return { total, count };
  }, [filteredTransactions]);

  const handleExportPDF = useCallback(() => {
    if (!data || filteredTransactions.length === 0) return;

    // @ts-ignore
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`Relatório de Extrato: ${data.bankName || 'Banco'}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Filtro de busca: ${searchTerm || 'Nenhum'}`, 14, 30);
    doc.text(`Total de itens: ${stats.count}`, 14, 38);
    doc.text(`Valor Total: R$ ${stats.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, 46);

    const tableData = filteredTransactions.map(t => [
      t.date,
      t.description,
      t.type === 'CREDIT' ? 'Crédito' : 'Débito',
      `R$ ${t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ]);

    // @ts-ignore
    doc.autoTable({
      startY: 55,
      head: [['Data', 'Descrição', 'Tipo', 'Valor']],
      body: tableData,
    });

    doc.save(`relatorio_extrato_${new Date().getTime()}.pdf`);
  }, [data, filteredTransactions, searchTerm, stats]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {state === AppState.IDLE && (
          <div className="max-w-xl mx-auto mt-20 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4">Analisar Extrato</h2>
              <p className="text-gray-500 mb-8">Faça o upload do seu PDF ou Excel para identificar transferências automaticamente usando IA.</p>
              
              <label className="block w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-200">
                Selecionar Arquivo
                <input type="file" className="hidden" accept=".pdf,.xls,.xlsx" onChange={handleFileUpload} />
              </label>
              
              <div className="mt-4 text-xs text-gray-400 flex items-center justify-center gap-4">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                  PDF
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" /></svg>
                  XLS / XLSX
                </span>
              </div>
            </div>
          </div>
        )}

        {state === AppState.LOADING && (
          <div className="flex flex-col items-center justify-center mt-32 space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            <p className="text-lg font-medium text-gray-600">A Inteligência Artificial está analisando seu extrato...</p>
            <p className="text-sm text-gray-400">Isso pode levar alguns segundos dependendo do tamanho do arquivo.</p>
          </div>
        )}

        {state === AppState.ERROR && (
          <div className="max-w-xl mx-auto mt-20">
            <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-bold">Erro ao processar</h3>
              <p className="text-center mt-2">{error}</p>
              <button 
                onClick={() => setState(AppState.IDLE)}
                className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {state === AppState.LOADED && data && (
          <Dashboard 
            data={data}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredTransactions={filteredTransactions}
            stats={stats}
            onExport={handleExportPDF}
            onReset={() => {
              setData(null);
              setState(AppState.IDLE);
              setSearchTerm('');
            }}
          />
        )}
      </main>

      <footer className="py-6 text-center text-gray-400 text-sm border-t border-gray-100 bg-white">
        © {new Date().getFullYear()} Bank Analyzer AI. Segurança e inteligência financeira.
      </footer>
    </div>
  );
};

export default App;
