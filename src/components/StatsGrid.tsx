import React, { useState } from 'react';
import { Wallet, Coins, Package, TrendingUp, ShoppingBag, ArrowUpRight, Edit2, Check } from 'lucide-react';
import { formatCurrency } from '../utils';

interface StatsGridProps {
  capitalInicial: number;
  onUpdateCapital: (newCapital: number) => void;
  saldoDisponivel: number;
  valorEstoque: number;
  lucroTotal: number;
  totalCompradoMes: number;
  totalVendidoMes: number;
  selectedMonthName?: string;
}

export default function StatsGrid({
  capitalInicial,
  onUpdateCapital,
  saldoDisponivel,
  valorEstoque,
  lucroTotal,
  totalCompradoMes,
  totalVendidoMes,
  selectedMonthName = 'Mês Atual',
}: StatsGridProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempCapital, setTempCapital] = useState(capitalInicial.toString());

  const handleSave = () => {
    const val = parseFloat(tempCapital);
    if (!isNaN(val) && val >= 0) {
      onUpdateCapital(val);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setTempCapital(capitalInicial.toString());
      setIsEditing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="stats-grid-container">
      {/* Capital Inicial (Editable) */}
      <div 
        className="bg-[#1e293b] rounded-3xl p-6 border border-slate-700/50 shadow-md transition-all duration-200 hover:shadow-lg hover:border-slate-600/50"
        id="card-capital-inicial"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-400 font-display">Capital Inicial</span>
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <Coins className="w-5 h-5" />
          </div>
        </div>
        
        {isEditing ? (
          <div className="flex items-center gap-2 mt-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">R$</span>
              <input
                type="number"
                value={tempCapital}
                onChange={(e) => setTempCapital(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border-2 border-slate-700 focus:border-blue-500 rounded-xl font-semibold text-lg text-white focus:outline-none focus:ring-0"
                autoFocus
                placeholder="0.00"
                step="any"
              />
            </div>
            <button
              onClick={handleSave}
              className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors cursor-pointer shadow"
              title="Salvar"
              id="btn-save-capital"
            >
              <Check className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-baseline justify-between mt-1 group">
            <h3 className="text-2xl font-bold text-white tracking-tight font-display font-mono">
              {formatCurrency(capitalInicial)}
            </h3>
            <button
              onClick={() => {
                setTempCapital(capitalInicial.toString());
                setIsEditing(true);
              }}
              className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer opacity-80 group-hover:opacity-100 border border-transparent hover:border-blue-500/20"
              title="Editar Capital Inicial"
              id="btn-edit-capital"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        )}
        <p className="text-xs text-slate-400 mt-2">Capital de investimento inicial</p>
      </div>

      {/* Saldo Disponível */}
      <div 
        className="bg-[#1e293b] rounded-3xl p-6 border border-slate-700/50 shadow-md transition-all duration-200 hover:shadow-lg hover:border-slate-600/50"
        id="card-saldo-disponivel"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-400 font-display">Saldo Disponível</span>
          <div className={`p-2 rounded-xl border ${
            saldoDisponivel >= 0 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <h3 className={`text-2xl font-bold tracking-tight font-display font-mono ${saldoDisponivel >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {formatCurrency(saldoDisponivel)}
        </h3>
        <p className="text-xs text-slate-400 mt-2">Dinheiro em caixa para novas compras</p>
      </div>

      {/* Valor Investido em Estoque */}
      <div 
        className="bg-[#1e293b] rounded-3xl p-6 border border-slate-700/50 shadow-md transition-all duration-200 hover:shadow-lg hover:border-slate-600/50"
        id="card-valor-estoque"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-400 font-display">Investido em Estoque</span>
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Package className="w-5 h-5" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white tracking-tight font-display font-mono">
          {formatCurrency(valorEstoque)}
        </h3>
        <p className="text-xs text-slate-400 mt-2">Capital retido em aparelhos ativos</p>
      </div>

      {/* Lucro Total */}
      <div 
        className="bg-[#1e293b] rounded-3xl p-6 border border-slate-700/50 shadow-md transition-all duration-200 hover:shadow-lg hover:border-slate-600/50"
        id="card-lucro-total"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-400 font-display">
            {selectedMonthName === 'Todos os meses' ? 'Lucro Líquido Acumulado' : `Lucro em ${selectedMonthName}`}
          </span>
          <div className={`p-2 rounded-xl border ${
            lucroTotal >= 0 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <h3 className={`text-2xl font-bold tracking-tight font-display font-mono ${lucroTotal >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {formatCurrency(lucroTotal)}
        </h3>
        <p className="text-xs text-slate-400 mt-2">
          {selectedMonthName === 'Todos os meses' ? 'Soma do lucro de todas as vendas' : `Lucro líquido obtido em ${selectedMonthName}`}
        </p>
      </div>

      {/* Total Comprado no Mês */}
      <div 
        className="bg-[#1e293b] rounded-3xl p-6 border border-slate-700/50 shadow-md transition-all duration-200 hover:shadow-lg hover:border-slate-600/50"
        id="card-compras-mes"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-400 font-display">
            {selectedMonthName === 'Todos os meses' ? 'Total Comprado' : `Compras em ${selectedMonthName}`}
          </span>
          <div className="p-2 bg-slate-500/10 text-slate-300 rounded-xl border border-slate-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white tracking-tight font-display font-mono">
          {formatCurrency(totalCompradoMes)}
        </h3>
        <p className="text-xs text-slate-400 mt-2">
          {selectedMonthName === 'Todos os meses' ? 'Valor total de compras realizadas' : `Valor total investido em compras em ${selectedMonthName}`}
        </p>
      </div>

      {/* Total Vendido no Mês */}
      <div 
        className="bg-[#1e293b] rounded-3xl p-6 border border-slate-700/50 shadow-md transition-all duration-200 hover:shadow-lg hover:border-slate-600/50"
        id="card-vendas-mes"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-400 font-display">
            {selectedMonthName === 'Todos os meses' ? 'Total Vendido' : `Vendas em ${selectedMonthName}`}
          </span>
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-emerald-400 tracking-tight font-display font-mono">
          {formatCurrency(totalVendidoMes)}
        </h3>
        <p className="text-xs text-slate-400 mt-2">
          {selectedMonthName === 'Todos os meses' ? 'Valor faturado em todas as vendas' : `Valor total faturado em ${selectedMonthName}`}
        </p>
      </div>
    </div>
  );
}
