import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PlusCircle, 
  TrendingDown, 
  Smartphone, 
  History, 
  Sparkles, 
  Trash2, 
  RefreshCw, 
  Info,
  Calendar,
  Layers,
  ShoppingBag,
  ArrowUpRight,
  AlertTriangle,
  X
} from 'lucide-react';

import { iPhone, AppState } from './types';
import { SEED_APARELHOS, isCurrentMonth, formatMonthYearPT } from './utils';
import StatsGrid from './components/StatsGrid';
import IphoneFormModal from './components/IphoneFormModal';
import SellModal from './components/SellModal';
import StockView from './components/StockView';
import SoldView from './components/SoldView';

const STORAGE_KEY = 'controle_iphones_v1';

export default function App() {
  const getCurrentMonthString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const [state, setState] = useState<AppState>({
    capitalInicial: 15000,
    aparelhos: []
  });

  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonthString());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'estoque' | 'vendidos'>('dashboard');
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [sellPreSelectedId, setSellPreSelectedId] = useState<string | undefined>(undefined);
  const [showWelcomeAlert, setShowWelcomeAlert] = useState(false);
  const [deletingPhoneId, setDeletingPhoneId] = useState<string | null>(null);
  const [isConfirmClearAllOpen, setIsConfirmClearAllOpen] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing localStorage', e);
      }
    } else {
      // First time loading: Load seed data so the app has context
      setState({
        capitalInicial: 15000,
        aparelhos: SEED_APARELHOS
      });
      setShowWelcomeAlert(true);
    }
  }, []);

  // Save data to localStorage when state changes
  const saveState = (newState: AppState) => {
    setState(newState);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  // State handlers
  const handleUpdateCapital = (newCapital: number) => {
    const updated = { ...state, capitalInicial: newCapital };
    saveState(updated);
  };

  const handleBuyIphone = (phoneData: Omit<iPhone, 'id' | 'status'>, quantidade: number = 1) => {
    const newPhones: iPhone[] = [];
    for (let i = 0; i < quantidade; i++) {
      newPhones.push({
        ...phoneData,
        id: Math.random().toString(36).substring(2, 9),
        status: 'estoque'
      });
    }
    const updated = {
      ...state,
      aparelhos: [...newPhones, ...state.aparelhos]
    };
    saveState(updated);
  };

  const handleSellIphone = (id: string, valorVenda: number, dataVenda: string) => {
    const updatedAparelhos = state.aparelhos.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: 'vendido' as const,
          valorVenda,
          dataVenda
        };
      }
      return item;
    });
    saveState({
      ...state,
      aparelhos: updatedAparelhos
    });
  };

  const handleUndoSale = (id: string) => {
    const updatedAparelhos = state.aparelhos.map((item) => {
      if (item.id === id) {
        const { valorVenda, dataVenda, ...rest } = item;
        return {
          ...rest,
          status: 'estoque' as const
        };
      }
      return item;
    });
    saveState({
      ...state,
      aparelhos: updatedAparelhos
    });
  };

  const handleDeletePhone = (id: string) => {
    setDeletingPhoneId(id);
  };

  const confirmDeletePhone = () => {
    if (deletingPhoneId) {
      const updated = {
        ...state,
        aparelhos: state.aparelhos.filter(item => item.id !== deletingPhoneId)
      };
      saveState(updated);
      setDeletingPhoneId(null);
    }
  };

  const handleClearAll = () => {
    setIsConfirmClearAllOpen(true);
  };

  const confirmClearAll = () => {
    saveState({
      capitalInicial: 10000,
      aparelhos: []
    });
    setShowWelcomeAlert(false);
    setIsConfirmClearAllOpen(false);
  };

  const handleLoadSamples = () => {
    saveState({
      capitalInicial: 15000,
      aparelhos: SEED_APARELHOS
    });
  };

  // Calculations
  const estoque = state.aparelhos.filter((item) => item.status === 'estoque');
  const vendidos = state.aparelhos.filter((item) => item.status === 'vendido');

  // Sum of purchase price of items currently in stock
  const valorEstoque = estoque.reduce((sum, item) => sum + item.valorCompra, 0);

  // Sum of (sale price - purchase price) for all sold items
  const lucroTotal = vendidos.reduce((sum, item) => sum + ((item.valorVenda || 0) - item.valorCompra), 0);

  // Total purchase amount for ALL items (used for robust balance calc)
  const totalTodasCompras = state.aparelhos.reduce((sum, item) => sum + item.valorCompra, 0);
  // Total sale amount for sold items
  const totalTodasVendas = vendidos.reduce((sum, item) => sum + (item.valorVenda || 0), 0);

  // Saldo disponível = Capital Inicial - Total Compras Realizadas + Total Vendas Realizadas
  const saldoDisponivel = state.capitalInicial - totalTodasCompras + totalTodasVendas;

  // Check if a date string falls in the selected month
  const isInSelectedMonth = (dateString: string) => {
    if (!dateString) return false;
    if (selectedMonth === 'all') return true;
    return dateString.substring(0, 7) === selectedMonth;
  };

  // Get all unique months (YYYY-MM) from purchases and sales, sorted chronologically descending
  const getUniqueMonths = () => {
    const monthsSet = new Set<string>();
    
    // Always include current month
    monthsSet.add(getCurrentMonthString());
    
    state.aparelhos.forEach((item) => {
      if (item.dataCompra) {
        monthsSet.add(item.dataCompra.substring(0, 7));
      }
      if (item.dataVenda) {
        monthsSet.add(item.dataVenda.substring(0, 7));
      }
    });
    
    return Array.from(monthsSet).sort().reverse();
  };

  // Monthly stats based on selectedMonth
  const totalCompradoMes = state.aparelhos.reduce((sum, item) => {
    return isInSelectedMonth(item.dataCompra) ? sum + item.valorCompra : sum;
  }, 0);

  const totalVendidoMes = vendidos.reduce((sum, item) => {
    return item.dataVenda && isInSelectedMonth(item.dataVenda) ? sum + (item.valorVenda || 0) : sum;
  }, 0);

  // Profit filtered by selected month or total
  const lucroTotalSelecionado = vendidos.reduce((sum, item) => {
    if (item.dataVenda && isInSelectedMonth(item.dataVenda)) {
      return sum + ((item.valorVenda || 0) - item.valorCompra);
    }
    return sum;
  }, 0);

  // Trigger quick sell from anywhere
  const handleTriggerQuickSell = (id: string) => {
    setSellPreSelectedId(id);
    setIsSellModalOpen(true);
  };

  const handleOpenGeneralSell = () => {
    setSellPreSelectedId(undefined);
    setIsSellModalOpen(true);
  };

  // Recent activities list for the dashboard
  const getRecentActivities = () => {
    const activities: {
      id: string;
      type: 'compra' | 'venda';
      date: string;
      label: string;
      details: string;
      value: number;
    }[] = [];

    state.aparelhos.forEach((item) => {
      // Add purchase activity
      const buyDetails = [item.armazenamento, item.cor].filter(Boolean).join(' • ') || (item.categoria || 'Outros');
      activities.push({
        id: `buy-${item.id}`,
        type: 'compra',
        date: item.dataCompra,
        label: `Compra de ${item.modelo}`,
        details: buyDetails,
        value: item.valorCompra
      });

      // Add sale activity if sold
      if (item.status === 'vendido' && item.dataVenda) {
        const sellDetailsList = [item.armazenamento].filter(Boolean);
        const profit = (item.valorVenda || 0) - item.valorCompra;
        sellDetailsList.push(`Lucro: +R$ ${profit}`);
        activities.push({
          id: `sell-${item.id}`,
          type: 'venda',
          date: item.dataVenda,
          label: `Venda de ${item.modelo}`,
          details: sellDetailsList.join(' • '),
          value: item.valorVenda || 0
        });
      }
    });

    // Sort by date descending
    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 pb-12 flex flex-col font-sans" id="app-root-container">
      
      {/* Top Banner Header */}
      <header className="bg-[#1e293b] border-b border-slate-700/50 sticky top-0 z-40 shadow-md" id="main-header">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-950/50">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight font-display text-white">Meu Estoque</h1>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs text-slate-400 font-medium">Controle de compra, venda e lucro de iPhones</p>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0" title="Seus dados ficam salvos de forma 100% privada e local no seu próprio navegador!">
                  🔒 Dados 100% Privados
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-700/30" id="navigation-tabs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              id="tab-dashboard"
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('estoque')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'estoque'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              id="tab-estoque"
            >
              Estoque
              {estoque.length > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xxs font-extrabold ${
                  activeTab === 'estoque' 
                    ? 'bg-blue-900 text-blue-200' 
                    : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                }`}>
                  {estoque.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('vendidos')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'vendidos'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
              id="tab-vendidos"
            >
              Vendidos
              {vendidos.length > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xxs font-extrabold ${
                  activeTab === 'vendidos' 
                    ? 'bg-emerald-950 text-emerald-300' 
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {vendidos.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {/* Welcome & Seed Notification */}
        {showWelcomeAlert && (
          <div className="bg-[#1e293b] border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md" id="welcome-notification">
            <div className="flex gap-3">
              <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl shrink-0 border border-blue-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm font-display">🔒 Seus dados são 100% privados e salvos no seu aparelho!</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Este sistema funciona de forma local e independente. Tudo o que você cadastrar fica salvo apenas no seu navegador — outras pessoas que acessarem o link terão o próprio painel delas totalmente separado. Adicionamos alguns registros de exemplo para você ver como funciona; sinta-se à vontade para limpá-los e começar o seu!
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => setShowWelcomeAlert(false)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xxs font-bold transition-all cursor-pointer shadow"
              >
                Manter Exemplos
              </button>
              <button
                onClick={handleClearAll}
                className="px-3 py-1.5 text-rose-400 hover:bg-rose-950/40 rounded-xl text-xxs font-semibold transition-all cursor-pointer border border-rose-500/10"
              >
                Limpar Exemplos
              </button>
            </div>
          </div>
        )}

        {/* Floating Actions on Quick View */}
        <div className="flex items-center justify-between gap-4 bg-[#1e293b] p-4 rounded-2xl border border-slate-700/50 shadow-md">
          <div className="hidden sm:block">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Operações Rápidas</span>
            <span className="text-sm font-medium text-slate-300">Registre novos aparelhos ou conclua negociações</span>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsBuyModalOpen(true)}
              className="flex-1 sm:flex-initial px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-950/40 border border-blue-500/20 transition-all cursor-pointer active:scale-98"
              id="action-btn-comprar"
            >
              <PlusCircle className="w-4 h-4" />
              Comprar
            </button>
            <button
              onClick={handleOpenGeneralSell}
              disabled={estoque.length === 0}
              className="flex-1 sm:flex-initial px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 border border-emerald-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-98 cursor-pointer"
              id="action-btn-vender"
            >
              <ArrowUpRight className="w-4 h-4" />
              Vender
            </button>
          </div>
        </div>

        {/* Tab Switch View Render */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'dashboard' && (
              <div className="space-y-6" id="tab-content-dashboard">
                {/* Filtro por Mês */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1e293b] p-5 rounded-3xl border border-slate-700/50 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white font-display text-sm">Mês de Referência</h3>
                      <p className="text-xs text-slate-400">Filtrando estatísticas de compras, vendas e lucros</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium hidden md:inline">Visualizar:</span>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="bg-slate-900 border border-slate-700/80 text-sm font-bold text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 cursor-pointer shadow-inner hover:bg-slate-900/80 transition-colors"
                    >
                      <option value="all">Todos os meses (Acumulado)</option>
                      {getUniqueMonths().map((m) => (
                        <option key={m} value={m}>
                          {formatMonthYearPT(m)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Financial Overview Cards */}
                <StatsGrid
                  capitalInicial={state.capitalInicial}
                  onUpdateCapital={handleUpdateCapital}
                  saldoDisponivel={saldoDisponivel}
                  valorEstoque={valorEstoque}
                  lucroTotal={lucroTotalSelecionado}
                  totalCompradoMes={totalCompradoMes}
                  totalVendidoMes={totalVendidoMes}
                  selectedMonthName={selectedMonth === 'all' ? 'Todos os meses' : formatMonthYearPT(selectedMonth)}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Activities Panel */}
                  <div className="bg-[#1e293b] rounded-3xl border border-slate-700/50 p-6 shadow-md lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
                      <div>
                        <h3 className="font-bold text-white font-display text-base">Últimas Atividades</h3>
                        <p className="text-xs text-slate-400">Histórico das últimas compras e vendas registradas</p>
                      </div>
                      <History className="w-4 h-4 text-slate-400" />
                    </div>

                    {getRecentActivities().length === 0 ? (
                      <div className="py-10 text-center space-y-2">
                        <p className="text-slate-400 text-sm">Nenhuma atividade registrada.</p>
                        <p className="text-xs text-blue-400 font-medium">Use os botões acima para comprar seu primeiro iPhone!</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-700/30">
                        {getRecentActivities().map((act) => (
                          <div key={act.id} className="py-3 flex items-center justify-between text-sm group">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg shrink-0 ${
                                act.type === 'compra' 
                                  ? 'bg-blue-500/10 text-blue-400' 
                                  : 'bg-emerald-500/10 text-emerald-400'
                              }`}>
                                <Smartphone className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="font-bold text-white block leading-snug">{act.label}</span>
                                <span className="text-xs text-slate-400">{act.details}</span>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <span className={`font-mono font-bold block ${
                                act.type === 'compra' ? 'text-slate-300' : 'text-emerald-400'
                              }`}>
                                {act.type === 'compra' ? '-' : '+'}{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(act.value)}
                              </span>
                              <span className="text-xxs text-slate-500 block">{act.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Settings & Fast Info Bar */}
                  <div className="bg-[#1e293b] rounded-3xl border border-slate-700/50 p-6 shadow-md flex flex-col justify-between space-y-5">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-white font-bold font-display text-base border-b border-slate-700/50 pb-3">
                        <Info className="w-4 h-4 text-blue-400" />
                        <span>Resumo do Negócio</span>
                      </div>
                      
                      <div className="space-y-3 text-xs text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-medium">Total de iPhones Comprados:</span>
                          <span className="font-bold text-white">{state.aparelhos.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-medium">Total em Estoque:</span>
                          <span className="font-bold text-blue-400">{estoque.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-medium">Total de iPhones Vendidos:</span>
                          <span className="font-bold text-emerald-400">{vendidos.length}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-700/30 pt-2 font-medium">
                          <span className="text-slate-400">Média de lucro por aparelho:</span>
                          <span className="font-bold text-white font-mono">
                            {vendidos.length > 0 
                              ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lucroTotal / vendidos.length) 
                              : 'R$ 0,00'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-slate-700/30">
                      {state.aparelhos.length === 0 ? (
                        <button
                          onClick={handleLoadSamples}
                          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 hover:text-blue-400 text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-700/50"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Restaurar Exemplos
                        </button>
                      ) : (
                        <button
                          onClick={handleClearAll}
                          className="w-full py-2.5 bg-slate-800/50 hover:bg-rose-950/30 hover:text-rose-400 text-slate-400 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-700/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Apagar Tudo (Reiniciar)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'estoque' && (
              <StockView
                estoque={estoque}
                onSellClick={handleTriggerQuickSell}
                onOpenBuy={() => setIsBuyModalOpen(true)}
                onDeletePhone={handleDeletePhone}
              />
            )}

            {activeTab === 'vendidos' && (
              <SoldView
                vendidos={vendidos}
                onUndoSale={handleUndoSale}
              />
            )}
          </motion.div>
        </AnimatePresence>

      </main>

      {/* Buy iPhone Modal */}
      <IphoneFormModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        onSave={handleBuyIphone}
      />

      {/* Sell iPhone Modal */}
      <SellModal
        isOpen={isSellModalOpen}
        onClose={() => {
          setIsSellModalOpen(false);
          setSellPreSelectedId(undefined);
        }}
        estoque={estoque}
        preSelectedIphoneId={sellPreSelectedId}
        onSell={handleSellIphone}
      />

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingPhoneId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/70 backdrop-blur-md" id="delete-phone-confirm-modal">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#1e293b] w-full max-w-md rounded-3xl shadow-2xl border border-slate-700/60 overflow-hidden flex flex-col"
            >
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white font-display">Excluir Aparelho?</h3>
                  <p className="text-sm text-slate-300">
                    Tem certeza de que deseja remover permanentemente o{' '}
                    <strong className="text-white">
                      {state.aparelhos.find(p => p.id === deletingPhoneId)?.modelo}
                    </strong>{' '}
                    ({state.aparelhos.find(p => p.id === deletingPhoneId)?.armazenamento} • {state.aparelhos.find(p => p.id === deletingPhoneId)?.cor})? 
                    Esta ação não poderá ser desfeita.
                  </p>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-900/40 border-t border-slate-700/50 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingPhoneId(null)}
                  className="px-4 py-2 border border-slate-700 bg-slate-800 text-slate-300 font-semibold rounded-xl text-sm hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmDeletePhone}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-md border border-rose-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir Permanentemente
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Clear All Confirmation Modal */}
      <AnimatePresence>
        {isConfirmClearAllOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/70 backdrop-blur-md" id="clear-all-confirm-modal">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[#1e293b] w-full max-w-md rounded-3xl shadow-2xl border border-slate-700/60 overflow-hidden flex flex-col"
            >
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white font-display">Apagar Tudo?</h3>
                  <p className="text-sm text-slate-300">
                    <strong className="text-rose-400">ATENÇÃO:</strong> Isso apagará permanentemente todos os aparelhos cadastrados em estoque, vendas finalizadas e redefinirá seu capital inicial. Deseja continuar?
                  </p>
                </div>
              </div>
              <div className="px-6 py-4 bg-slate-900/40 border-t border-slate-700/50 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsConfirmClearAllOpen(false)}
                  className="px-4 py-2 border border-slate-700 bg-slate-800 text-slate-300 font-semibold rounded-xl text-sm hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmClearAll}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer flex items-center gap-1.5 shadow-md border border-rose-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                  Apagar Tudo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
