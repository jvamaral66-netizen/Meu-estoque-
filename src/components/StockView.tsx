import React, { useState } from 'react';
import { Search, SlidersHorizontal, Battery, Calendar, ShieldAlert, ArrowUpRight, DollarSign, Tag, Info, Filter, Smartphone, Laptop, Cpu, Hammer, FileText, Building2 } from 'lucide-react';
import { iPhone } from '../types';
import { formatCurrency, formatDate } from '../utils';

interface StockViewProps {
  estoque: iPhone[];
  onSellClick: (id: string) => void;
  onOpenBuy: () => void;
  onDeletePhone: (id: string) => void;
}

export default function StockView({ estoque, onSellClick, onOpenBuy, onDeletePhone }: StockViewProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'price-asc' | 'price-desc' | 'battery'>('recent');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = estoque.filter((item) => {
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
    if (sortBy === 'recent') {
      return new Date(b.dataCompra).getTime() - new Date(a.dataCompra).getTime();
    }
    if (sortBy === 'price-asc') {
      return a.valorCompra - b.valorCompra;
    }
    if (sortBy === 'price-desc') {
      return b.valorCompra - a.valorCompra;
    }
    if (sortBy === 'battery') {
      const batA = a.saudeBateria ?? 0;
      const batB = b.saudeBateria ?? 0;
      return batB - batA;
    }
    return 0;
  });

  const getBatteryColor = (health: number) => {
    if (health >= 90) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (health >= 80) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  const getCategoryBadge = (cat?: string) => {
    const finalCat = cat || 'iPhone';
    switch (finalCat) {
      case 'iPhone':
        return <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1"><Smartphone className="w-3 h-3" /> iPhone</span>;
      case 'Android':
        return <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1"><Smartphone className="w-3 h-3" /> Android</span>;
      case 'Videogame':
        return <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1"><Cpu className="w-3 h-3" /> Videogame</span>;
      case 'Notebook':
        return <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center gap-1"><Laptop className="w-3 h-3" /> Notebook</span>;
      case 'Ferramenta':
        return <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1"><Hammer className="w-3 h-3" /> Ferramenta</span>;
      default:
        return <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 flex items-center gap-1"><Tag className="w-3 h-3" /> Outros</span>;
    }
  };

  return (
    <div className="space-y-6" id="stock-view-section">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-display">Produtos em Estoque ({estoque.length})</h2>
          <p className="text-sm text-slate-400">Seus itens disponíveis e prontos para serem vendidos</p>
        </div>
        
        {estoque.length > 0 && (
          <button
            onClick={onOpenBuy}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-md flex items-center gap-2"
            id="stock-view-btn-buy"
          >
            + Comprar
          </button>
        )}
      </div>

      {estoque.length === 0 ? (
        <div className="bg-[#1e293b] rounded-3xl p-12 text-center border border-slate-700/50 shadow-md max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-slate-900 text-blue-400 rounded-full flex items-center justify-center mx-auto border border-slate-750">
            <Tag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-white text-lg font-display">Estoque Vazio</h3>
            <p className="text-sm text-slate-400">Você não possui nenhum item cadastrado em estoque para venda no momento.</p>
          </div>
          <button
            onClick={onOpenBuy}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer shadow"
            id="empty-stock-btn-buy"
          >
            Adicionar Primeiro Item
          </button>
        </div>
      ) : (
        <>
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-3 bg-[#1e293b] p-3 rounded-2xl border border-slate-700/50 shadow-md">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por modelo, cor, marca ou observações..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white text-sm focus:outline-none transition-colors"
                id="stock-search-input"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white text-sm font-medium focus:outline-none transition-colors cursor-pointer"
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
              <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white text-sm font-medium focus:outline-none transition-colors cursor-pointer"
                id="stock-sort-select"
              >
                <option value="recent">Mais recentes comprados</option>
                <option value="price-desc">Maior valor pago</option>
                <option value="price-asc">Menor valor pago</option>
                <option value="battery">Melhor saúde de bateria</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {sorted.length === 0 ? (
            <div className="text-center py-12 bg-[#1e293b] rounded-2xl border border-slate-700/50">
              <p className="text-slate-400 text-sm">Nenhum produto em estoque corresponde aos filtros.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" id="stock-grid">
              {sorted.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#1e293b] rounded-3xl border border-slate-700/50 shadow-md overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:border-slate-600/50"
                  id={`stock-card-${item.id}`}
                >
                  {/* Top Details */}
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          {getCategoryBadge(item.categoria)}
                        </div>
                        <h4 className="font-bold text-white font-display text-base tracking-tight leading-snug truncate" title={item.modelo}>
                          {item.modelo}
                        </h4>
                        
                        {item.armazenamento && (
                          <span className="inline-block text-xs font-semibold text-slate-300 bg-slate-800 border border-slate-700/50 px-2.5 py-1 rounded-full">
                            {item.armazenamento}
                          </span>
                        )}
                      </div>

                      {item.saudeBateria !== undefined && (
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg border shrink-0 ${getBatteryColor(item.saudeBateria)}`}>
                          {item.saudeBateria}% Bat
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 pt-2 text-xs text-slate-300 border-t border-slate-700/30">
                      {item.cor && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Cor</span>
                          <span className="font-medium text-slate-200">{item.cor}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-slate-400">Data de Compra</span>
                        <span className="font-medium text-slate-200">{formatDate(item.dataCompra)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Origem da Compra</span>
                        <span className="font-semibold text-xs flex items-center gap-1">
                          {item.meioPagamento === 'dinheiro' ? (
                            <span className="text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/10 text-[10px]">
                              <DollarSign className="w-3 h-3" /> Dinheiro
                            </span>
                          ) : item.meioPagamento === 'sem_impacto' ? (
                            <span className="text-rose-400 flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/10 text-[10px]">
                              <ShieldAlert className="w-3 h-3" /> Sem usar Caixa
                            </span>
                          ) : (
                            <span className="text-blue-400 flex items-center gap-1 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/10 text-[10px]">
                              <Building2 className="w-3 h-3" /> Banco
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between items-baseline pt-1">
                        <span className="text-slate-400">Valor Pago</span>
                        <span className="text-base font-extrabold text-white font-mono">{formatCurrency(item.valorCompra)}</span>
                      </div>

                      {/* Optional Observações text field rendering */}
                      {item.observacoes && (
                        <div className="mt-2.5 p-2.5 bg-slate-900/50 border border-slate-850 rounded-xl flex items-start gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                          <p className="text-xxs text-slate-400 italic leading-relaxed break-words line-clamp-2" title={item.observacoes}>
                            "{item.observacoes}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="px-5 py-3 bg-slate-900/40 border-t border-slate-700/50 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onDeletePhone(item.id)}
                      className="text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Excluir do Estoque"
                    >
                      Excluir
                    </button>
                    <button
                      onClick={() => onSellClick(item.id)}
                      className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer border border-emerald-500/20"
                      id={`btn-vender-card-${item.id}`}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      Vender
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
