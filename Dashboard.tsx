
import React from 'react';
import { BankStatementData, Transaction } from '../types';

interface DashboardProps {
  data: BankStatementData;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filteredTransactions: Transaction[];
  stats: { total: number; count: number };
  onExport: () => void;
  onReset: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  data,
  searchTerm,
  setSearchTerm,
  filteredTransactions,
  stats,
  onExport,
  onReset
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button 
            onClick={onReset}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 mb-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Carregar outro arquivo
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {data.bankName || 'Análise de Extrato'}
          </h2>
          <p className="text-gray-500">{data.period || 'Período identificado pelo sistema'}</p>
        </div>

        <button 
          onClick={onExport}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          Gerar Relatório PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Pesquisado</span>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-blue-600">
              R$ {stats.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Qtde. Transferências</span>
          <div className="mt-2">
            <span className="text-3xl font-extrabold text-gray-900">{stats.count}</span>
            <span className="ml-2 text-gray-400">itens</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="relative">
            <input 
              type="text"
              placeholder="Pesquisar por nome ou descrição..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Data</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Descrição / Favorecido</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Tipo</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 text-sm text-gray-600">{t.date}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{t.description}</td>
                    <td className="px-6 py-4 text-sm text-center">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                        t.type === 'CREDIT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {t.type === 'CREDIT' ? 'Crédito' : 'Débito'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-bold text-right ${
                      t.type === 'CREDIT' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {t.type === 'DEBIT' ? '-' : '+'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                    Nenhuma transação encontrada com os critérios de busca.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
