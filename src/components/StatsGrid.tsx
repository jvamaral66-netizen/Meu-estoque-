import React, { useState, useEffect } from 'react';
import { 
  Wallet, 
  Coins, 
  Package, 
  TrendingUp, 
  ShoppingBag, 
  ArrowUpRight, 
  Edit2, 
  Check, 
  TrendingDown, 
  Building2, 
  DollarSign 
} from 'lucide-react';
import { formatCurrency } from '../utils';

interface StatsGridProps {
  capitalInicial: number;
  capitalBancoInicial: number;
  capitalDinheiroInicial: number;
  onUpdateCapitalSplit: (banco: number, dinheiro: number) => void;
  saldoDisponivel: number;
  saldoBanco: number;
  saldoDinheiro: number;
  valorEstoque: number;
  lucroTotal: number;
  totalCompradoMes: number;
  totalVendidoMes: number;
  totalDespesasMes: number;
  selectedMonthName?: string;
  onOpenDespesasTab?: () => void;
}

export default function StatsGrid({
  capitalInicial,
  capitalBancoInicial,
  capitalDinheiroInicial,
  onUpdateCapitalSplit,
  saldoDisponivel,
  saldoBanco,
  saldoDinheiro,
  valorEstoque,
  lucroTotal,
  totalCompradoMes,
  totalVendidoMes,
  totalDespesasMes,
  selectedMonthName = 'Mês Atual',
  onOpenDespesasTab,
}: StatsGridProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempBanco, setTempBanco] = useState(capitalBancoInicial.toString());
  const [tempDinheiro, setTempDinheiro] = useState(capitalDinheiroInicial.toString());

  // Keep state sync in case props change externally
  useEffect(() => {
    setTempBanco(capitalBancoInicial.toString());
    setTempDinheiro(capitalDinheiroInicial.toString());
  }, [capitalBancoInicial, capitalDinheiroInicial]);

  const handleSave = () => {
    const bVal = parseFloat(tempBanco);
    const dVal = parseFloat(tempDinheiro);
    if (!isNaN(bVal) && bVal >= 0 && !isNaN(dVal) && dVal >= 0) {
      onUpdateCapitalSplit(bVal, dVal);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setTempBanco(capitalBancoInicial.toString());
      setTempDinheiro(capitalDinheiroInicial.toString());
      setIsEditing(false);
    }
  };

  const totalCapitalCalculado = (parseFloat(tempBanco) || 0) + (parseFloat(tempDinheiro) || 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="stats-grid-container">
      
      {/* Capital Inicial (Editable with split) */}
      <div 
        className="bg-[#1e293b] rounded-3xl p-5 border border-slate-700/50 shadow-md transition-all duration-200 hover:shadow-lg hover:border-slate-600/50"
        id="card-capital-inicial"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-400 font-display">Capital de Investimento</span>
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        
        {isEditing ? (
          <div className="space-y-3 mt-1">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">No Banco</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">R$</span>
                  <input
                    type="number"
                    value={tempBanco}
                    onChange={(e) => setTempBanco(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-7 pr-1.5 py-1.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-lg font-semibold text-xs text-white focus:outline-none focus:ring-0"
                    placeholder="0.00"
                    step="any"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Em Dinheiro</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">R$</span>
                  <input
                    type="number"
                    value={tempDinheiro}
                    onChange={(e) => setTempDinheiro(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-7 pr-1.5 py-1.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-lg font-semibold text-xs text-white focus:outline-none focus:ring-0"
                    placeholder="0.00"
                    step="any"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-750/50">
              <span className="text-[10px] text-slate-400">Total: <strong>{formatCurrency(totalCapitalCalculado)}</strong></span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setTempBanco(capitalBancoInicial.toString());
                    setTempDinheiro(capitalDinheiroInicial.toString());
                    setIsEditing(false);
                  }}
                  className="px-2 py-1 text-[10px] bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-md transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-2 py-1 text-[10px] bg-blue-600 hover:bg-blue-500 text-white rounded-md flex items-center gap-1 transition-colors cursor-pointer font-semibold shadow"
                >
                  <Check className="w-3 h-3" /> Salvar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline justify-between mt-1 group">
              <h3 className="text-2xl font-bold text-white tracking-tight font-display font-mono">
                {formatCurrency(capitalInicial)}
              </h3>
              <button
                onClick={() => {
                  setTempBanco(capitalBancoInicial.toString());
                  setTempDinheiro(capitalDinheiroInicial.toString());
                  setIsEditing(true);
                }}
                className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer opacity-85 border border-transparent hover:border-blue-500/20"
                title="Configurar divisão do Capital Inicial"
                id="btn-edit-capital"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {/* Visual indicator of division */}
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-750/40 pt-2.5">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <div className="text-[11px] text-slate-400 truncate">
                  Banco: <span className="font-mono text-slate-200 font-semibold">{formatCurrency(capitalBancoInicial)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <div className="text-[11px] text-slate-400 truncate">
                  Espécie: <span className="font-mono text-slate-200 font-semibold">{formatCurrency(capitalDinheiroInicial)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Saldo Disponível (Banco + Dinheiro) */}
      <div 
        className="bg-[#1e293b] rounded-3xl p-5 border border-slate-700/50 shadow-md transition-all duration-200 hover:shadow-lg hover:border-slate-600/50"
        id="card-saldo-disponivel"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-400 font-display">Saldo em Caixa (Disponível)</span>
          <div className={`p-2 rounded-xl border ${
            saldoDisponivel >= 0 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <h3 className={`text-2xl font-bold tracking-tight font-display font-mono ${saldoDisponivel >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {formatCurrency(saldoDisponivel)}
        </h3>

        {/* Real-time cash vs bank splits */}
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-750/40 pt-2.5">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <div className="text-[11px] text-slate-400 truncate">
              Banco: <span className="font-mono text-slate-100 font-bold">{formatCurrency(saldoBanco)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <div className="text-[11px] text-slate-400 truncate">
              Dinheiro: <span className="font-mono text-slate-100 font-bold">{formatCurrency(saldoDinheiro)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Despesas Card */}
      <div 
        className="bg-[#1e293b] rounded-3xl p-5 border border-slate-700/50 shadow-md transition-all duration-200 hover:shadow-lg hover:border-slate-600/50 cursor-pointer"
        onClick={onOpenDespesasTab}
        title="Clique para gerenciar despesas"
        id="card-despesas"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-400 font-display">Despesas no Mês</span>
          <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-rose-400 tracking-tight font-display font-mono">
          {formatCurrency(totalDespesasMes)}
        </h3>
        
        <div className="mt-3 flex items-center justify-between border-t border-slate-750/40 pt-2.5">
          <span className="text-[11px] text-slate-400">Total de gastos extras de {selectedMonthName}</span>
          <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded hover:bg-rose-500/20 transition-all">
            Ver detalhes →
          </span>
        </div>
      </div>

      {/* Valor Investido em Estoque */}
      <div 
        className="bg-[#1e293b] rounded-3xl p-5 border border-slate-700/50 shadow-md transition-all duration-200 hover:shadow-lg hover:border-slate-600/50"
        id="card-valor-estoque"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-400 font-display">Investido em Estoque</span>
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white tracking-tight font-display font-mono">
          {formatCurrency(valorEstoque)}
        </h3>
        <p className="text-xs text-slate-400 mt-2">Capital retido em aparelhos ativos</p>
      </div>

      {/* Lucro Total */}
      <div 
        className="bg-[#1e293b] rounded-3xl p-5 border border-slate-700/50 shadow-md transition-all duration-200 hover:shadow-lg hover:border-slate-600/50"
        id="card-lucro-total"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-400 font-display">
            {selectedMonthName === 'Todos os meses' ? 'Lucro Líquido Acumulado' : `Lucro em ${selectedMonthName}`}
          </span>
          <div className={`p-2 rounded-xl border ${
            lucroTotal >= 0 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <h3 className={`text-2xl font-bold tracking-tight font-display font-mono ${lucroTotal >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {formatCurrency(lucroTotal)}
        </h3>
        <p className="text-xs text-slate-400 mt-2">
          {selectedMonthName === 'Todos os meses' ? 'Lucro de vendas' : `Lucro líquido obtido em ${selectedMonthName}`}
        </p>
      </div>

      {/* Total Comprado no Mês */}
      <div 
        className="bg-[#1e293b] rounded-3xl p-5 border border-slate-700/50 shadow-md transition-all duration-200 hover:shadow-lg hover:border-slate-600/50"
        id="card-compras-mes"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-400 font-display">
            {selectedMonthName === 'Todos os meses' ? 'Total Comprado' : `Compras em ${selectedMonthName}`}
          </span>
          <div className="p-2 bg-slate-500/10 text-slate-300 rounded-xl border border-slate-500/20">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white tracking-tight font-display font-mono">
          {formatCurrency(totalCompradoMes)}
        </h3>
        <p className="text-xs text-slate-400 mt-2">
          {selectedMonthName === 'Todos os meses' ? 'Valor total de compras' : `Valor total investido em compras em ${selectedMonthName}`}
        </p>
      </div>

      {/* Total Vendido no Mês */}
      <div 
        className="bg-[#1e293b] rounded-3xl p-5 border border-slate-700/50 shadow-md transition-all duration-200 hover:shadow-lg hover:border-slate-600/50"
        id="card-vendas-mes"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-400 font-display">
            {selectedMonthName === 'Todos os meses' ? 'Total Vendido' : `Vendas em ${selectedMonthName}`}
          </span>
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-emerald-400 tracking-tight font-display font-mono">
          {formatCurrency(totalVendidoMes)}
        </h3>
        <p className="text-xs text-slate-400 mt-2">
          {selectedMonthName === 'Todos os meses' ? 'Valor faturado em vendas' : `Faturamento total em ${selectedMonthName}`}
        </p>
      </div>

    </div>
  );
}
