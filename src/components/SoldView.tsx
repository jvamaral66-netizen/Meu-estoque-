import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowDownLeft, ArrowUpRight, TrendingUp, CheckCircle, Smartphone, Tag, Laptop, Cpu, Hammer, FileText, Filter } from 'lucide-react';
import { iPhone } from '../types';
import { formatCurrency, formatDate } from '../utils';

interface SoldViewProps {
  vendidos: iPhone[];
  onUndoSale: (id: string) => void;
}

export default function SoldView({ vendidos, onUndoSale }: SoldViewProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'profit-desc' | 'profit-asc' | 'model'>('date-desc');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = vendidos.filter((item) => {
    // Filter by Category
    const itemCat = item.categoria || 'iPhone';
    if (categoryFilter !== 'all' && itemCat !== categoryFilter) {
      return false;
    }

    const term = search.toLowerCase();
    return (
      item.modelo.toLowerCase().includes(term) ||
      (item.cor && item.cor.toLowerCase().includes(term)) ||
      (item.armazenamento && item.armazenamento.toLowerCase().includes(term)) ||
      (item.observacoes && item.observacoes.toLowerCase().includes(term))
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const profitA = (a.valorVenda || 0) - a.valorCompra;
    const profitB = (b.valorVenda || 0) - b.valorCompra;

    if (sortBy === 'date-desc') {
      return new Date(b.dataVenda || '').getTime() - new Date(a.dataVenda || '').getTime();
    }
    if (sortBy === 'profit-desc') {
      return profitB - profitA;
    }
    if (sortBy === 'profit-asc') {
      return profitA - profitB;
    }
    if (sortBy === 'model') {
      return a.modelo.localeCompare(b.modelo);
    }
    return 0;
  });

  // Calculate sold statistics
  const totalVendidos = vendidos.length;
  const totalLucro = vendidos.reduce((sum, item) => sum + ((item.valorVenda || 0) - item.valorCompra), 0);
  const ticketMedioVenda = totalVendidos > 0 ? (vendidos.reduce((sum, item) => sum + (item.valorVenda || 0), 0) / totalVendidos) : 0;
  const lucroMedio = totalVendidos > 0 ? (totalLucro / totalVendidos) : 0;

  const getCategoryIcon = (cat?: string) => {
    const finalCat = cat || 'iPhone';
    switch (finalCat) {
      case 'iPhone':
        return <Smartphone className="w-3.5 h-3.5 text-blue-400 inline mr-1" />;
      case 'Android':
        return <Smartphone className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />;
      case 'Videogame':
        return <Cpu className="w-3.5 h-3.5 text-indigo-400 inline mr-1" />;
      case 'Notebook':
        return <Laptop className="w-3.5 h-3.5 text-violet-400 inline mr-1" />;
      case 'Ferramenta':
        return <Hammer className="w-3.5 h-3.5 text-amber-400 inline mr-1" />;
      default:
        return <Tag className="w-3.5 h-3.5 text-slate-400 inline mr-1" />;
    }
  };

  return (
    <div className="space-y-6" id="sold-view-section">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight font-display">Produtos Vendidos ({vendidos.length})</h2>
        <p className="text-sm text-slate-400">Histórico completo de negociações finalizadas</p>
      </div>

      {totalVendidos === 0 ? (
        <div className="bg-[#1e293b] rounded-3xl p-12 text-center border border-slate-700/50 shadow-md max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-slate-900 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-slate-750">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-white text-lg font-display">Nenhuma Venda Ainda</h3>
            <p className="text-sm text-slate-400">O seu histórico de vendas aparecerá aqui conforme você registrar a venda dos itens do estoque.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Mini Stats Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#1e293b] p-5 rounded-3xl border border-slate-700/50 shadow-md">
            <div className="text-center sm:text-left sm:pl-4 py-2 space-y-1 border-b sm:border-b-0 sm:border-r border-slate-700/40">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Total de Vendas</span>
              <span className="text-2xl font-extrabold text-white font-display">{totalVendidos} {totalVendidos === 1 ? 'item' : 'itens'}</span>
            </div>
            <div className="text-center sm:text-left sm:pl-4 py-2 space-y-1 border-b sm:border-b-0 sm:border-r border-slate-700/40">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Preço Médio de Venda</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-display font-mono">{formatCurrency(ticketMedioVenda)}</span>
            </div>
            <div className="text-center sm:text-left sm:pl-4 py-2 space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Margem de Lucro Média</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-display font-mono">{formatCurrency(lucroMedio)}</span>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-3 bg-[#1e293b] p-3 rounded-2xl border border-slate-700/50 shadow-md">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por modelo, cor, observações..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-750 focus:border-emerald-500 rounded-xl text-white text-sm focus:outline-none transition-colors"
                id="sold-search-input"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-750 focus:border-emerald-500 rounded-xl text-white text-sm font-medium focus:outline-none transition-colors cursor-pointer"
              >
                <option value="all">Todas as Categorias</option>
                <option value="iPhone">iPhone</option>
                <option value="Android">Android</option>
                <option value="Videogame">Videogame</option>
                <option value="Notebook">Notebook</option>
                <option value="Ferramenta">Ferramenta</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-750 focus:border-emerald-500 rounded-xl text-white text-sm font-medium focus:outline-none transition-colors cursor-pointer"
                id="sold-sort-select"
              >
                <option value="date-desc">Vendas mais recentes</option>
                <option value="profit-desc">Maior lucro</option>
                <option value="profit-asc">Menor lucro</option>
                <option value="model">Ordem alfabética (Modelo)</option>
              </select>
            </div>
          </div>

          {/* Desktop Table and Mobile Cards */}
          {sorted.length === 0 ? (
            <div className="text-center py-10 bg-[#1e293b] rounded-2xl border border-slate-700/50">
              <p className="text-slate-400 text-sm">Nenhum produto corresponde à busca.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Desktop Table View */}
              <div className="hidden lg:block bg-[#1e293b] rounded-3xl border border-slate-700/50 shadow-md overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/60 text-slate-300 font-semibold text-xs uppercase tracking-wider border-b border-slate-700/50">
                      <th className="px-6 py-4 font-display">Produto</th>
                      <th className="px-6 py-4 font-display">Valor Compra</th>
                      <th className="px-6 py-4 font-display">Valor Venda</th>
                      <th className="px-6 py-4 font-display text-right">Lucro</th>
                      <th className="px-6 py-4 font-display text-right">Data Venda</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30 text-sm text-slate-300">
                    {sorted.map((item) => {
                      const profit = (item.valorVenda || 0) - item.valorCompra;
                      const hasDetails = item.armazenamento || item.cor || item.saudeBateria !== undefined;
                      return (
                        <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-white flex items-center gap-1">
                              {getCategoryIcon(item.categoria)}
                              {item.modelo}
                            </div>
                            
                            {hasDetails && (
                              <div className="text-xs text-slate-400 mt-0.5">
                                {[
                                  item.armazenamento,
                                  item.cor,
                                  item.saudeBateria !== undefined ? `${item.saudeBateria}% bateria` : null
                                ].filter(Boolean).join(' • ')}
                              </div>
                            )}

                            {item.observacoes && (
                              <div className="text-xxs text-slate-500 italic mt-1 flex items-center gap-1.5 max-w-sm">
                                <FileText className="w-3 h-3 text-slate-500" />
                                <span className="truncate" title={item.observacoes}>"{item.observacoes}"</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-300 font-mono">
                            {formatCurrency(item.valorCompra)}
                            <div className="text-xxs text-slate-500 mt-0.5">Comprou: {formatDate(item.dataCompra)}</div>
                          </td>
                          <td className="px-6 py-4 font-bold text-white font-mono">
                            {formatCurrency(item.valorVenda || 0)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className={`font-extrabold font-mono ${profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {formatCurrency(profit)}
                            </div>
                            <div className="text-xxs text-emerald-400 font-semibold">
                              +{(((item.valorVenda || 0) - item.valorCompra) / item.valorCompra * 100).toFixed(1)}%
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-slate-400 font-mono">
                            {formatDate(item.dataVenda || '')}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button
                              onClick={() => onUndoSale(item.id)}
                              className="text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                              title="Retornar item para o estoque"
                            >
                              Estornar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4" id="sold-mobile-grid">
                {sorted.map((item) => {
                  const profit = (item.valorVenda || 0) - item.valorCompra;
                  return (
                    <div
                      key={item.id}
                      className="bg-[#1e293b] rounded-3xl border border-slate-700/50 p-5 shadow-md space-y-4 flex flex-col justify-between"
                      id={`sold-mobile-card-${item.id}`}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1 text-slate-400 text-xs font-bold mb-1">
                              {getCategoryIcon(item.categoria)}
                              <span className="capitalize">{item.categoria || 'iPhone'}</span>
                            </div>
                            <h4 className="font-bold text-white font-display text-base tracking-tight leading-snug truncate" title={item.modelo}>
                              {item.modelo}
                            </h4>
                            {item.armazenamento && (
                              <span className="inline-block mt-1.5 text-xs font-semibold text-slate-300 bg-slate-800 border border-slate-700/50 px-2.5 py-1 rounded-full">
                                {item.armazenamento}
                              </span>
                            )}
                          </div>
                          <span className="text-xxs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full shrink-0">
                            {formatDate(item.dataVenda || '')}
                          </span>
                        </div>

                        <div className="space-y-1.5 pt-2 text-xs text-slate-300 border-t border-slate-700/30">
                          {item.cor && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">Cor</span>
                              <span className="font-medium text-slate-200">{item.cor}</span>
                            </div>
                          )}
                          
                          {item.saudeBateria !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-slate-400">Saúde Bateria</span>
                              <span className="font-medium text-slate-200">{item.saudeBateria}%</span>
                            </div>
                          )}

                          <div className="flex justify-between">
                            <span className="text-slate-400">Pago na compra</span>
                            <span className="font-semibold text-slate-300 font-mono">{formatCurrency(item.valorCompra)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Recebido na venda</span>
                            <span className="font-bold text-white font-mono">{formatCurrency(item.valorVenda || 0)}</span>
                          </div>

                          {item.observacoes && (
                            <div className="mt-2 p-2 bg-slate-900/50 rounded-xl border border-slate-850 flex items-start gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                              <p className="text-xxs text-slate-400 italic break-words leading-normal">
                                "{item.observacoes}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between">
                        <button
                          onClick={() => onUndoSale(item.id)}
                          className="text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Estornar
                        </button>
                        <div className="text-right">
                          <span className="text-xxs text-slate-400 uppercase tracking-wider block">Lucro Líquido</span>
                          <span className={`text-base font-extrabold font-mono ${profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {formatCurrency(profit)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
