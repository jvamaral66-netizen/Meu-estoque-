import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, Building2, DollarSign, Check, AlertTriangle, RefreshCw, HelpCircle } from 'lucide-react';
import { formatCurrency } from '../utils';

interface BalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  saldoBanco: number;
  saldoDinheiro: number;
  onAdjustBalances: (newBanco: number, newDinheiro: number) => void;
  onTransfer: (from: 'banco' | 'dinheiro', to: 'banco' | 'dinheiro', amount: number) => void;
}

export default function BalanceModal({
  isOpen,
  onClose,
  saldoBanco,
  saldoDinheiro,
  onAdjustBalances,
  onTransfer
}: BalanceModalProps) {
  const [activeTab, setActiveTab] = useState<'transfer' | 'adjust'>('transfer');
  
  // Transfer form state
  const [origem, setOrigem] = useState<'banco' | 'dinheiro'>('banco');
  const [destino, setDestino] = useState<'banco' | 'dinheiro'>('dinheiro');
  const [valorTransferencia, setValorTransferencia] = useState('');
  
  // Adjust form state
  const [novoBanco, setNovoBanco] = useState(saldoBanco.toString());
  const [novoDinheiro, setNovoDinheiro] = useState(saldoDinheiro.toString());
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Keep local adjust inputs updated if external state changes
  useEffect(() => {
    if (isOpen) {
      setNovoBanco(saldoBanco.toFixed(2));
      setNovoDinheiro(saldoDinheiro.toFixed(2));
      setValorTransferencia('');
      setSuccessMessage('');
      setErrorMessage('');
    }
  }, [isOpen, saldoBanco, saldoDinheiro]);

  // Adjust target when source changes to prevent transferring to the same account
  const handleOrigemChange = (val: 'banco' | 'dinheiro') => {
    setOrigem(val);
    setDestino(val === 'banco' ? 'dinheiro' : 'banco');
  };

  const handleDestinoChange = (val: 'banco' | 'dinheiro') => {
    setDestino(val);
    setOrigem(val === 'banco' ? 'dinheiro' : 'banco');
  };

  if (!isOpen) return null;

  // Real-time transfer preview calculations
  const transferAmount = parseFloat(valorTransferencia) || 0;
  const isTransferValid = transferAmount > 0 && (origem === 'banco' ? saldoBanco : saldoDinheiro) >= transferAmount;

  const previewOrigemSaldo = origem === 'banco' ? saldoBanco - transferAmount : saldoDinheiro - transferAmount;
  const previewDestinoSaldo = destino === 'banco' ? saldoBanco + transferAmount : saldoDinheiro + transferAmount;

  // Real-time adjust difference calculations
  const parsedNovoBanco = parseFloat(novoBanco) || 0;
  const parsedNovoDinheiro = parseFloat(novoDinheiro) || 0;
  const difBanco = parsedNovoBanco - saldoBanco;
  const difDinheiro = parsedNovoDinheiro - saldoDinheiro;
  const totalDiferenca = difBanco + difDinheiro;

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTransferValid) {
      if (transferAmount <= 0) {
        setErrorMessage('Insira um valor maior que zero para transferir.');
      } else {
        setErrorMessage('Saldo insuficiente na conta de origem para realizar esta transferência.');
      }
      return;
    }

    onTransfer(origem, destino, transferAmount);
    setSuccessMessage(`R$ ${transferAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} transferido com sucesso!`);
    setErrorMessage('');
    setValorTransferencia('');
    
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 2000);
  };

  const handleExecuteAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(parsedNovoBanco) || parsedNovoBanco < 0 || isNaN(parsedNovoDinheiro) || parsedNovoDinheiro < 0) {
      setErrorMessage('Por favor, insira valores válidos e maiores ou iguais a zero.');
      return;
    }

    onAdjustBalances(parsedNovoBanco, parsedNovoDinheiro);
    setSuccessMessage('Saldos ajustados com sucesso!');
    setErrorMessage('');
    
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in" id="balance-actions-modal">
      <div className="bg-[#1e293b] border border-slate-700/70 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">Ações de Saldo</h2>
              <p className="text-xxs text-slate-400">Transfira fundos ou ajuste saldos diretamente</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-900/60 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700/40 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-4">
          <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-700/30">
            <button
              onClick={() => {
                setActiveTab('transfer');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'transfer'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Transferir entre Contas
            </button>
            <button
              onClick={() => {
                setActiveTab('adjust');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'adjust'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ajustar Saldo Direto
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5 flex-1">
          
          {/* TAB 1: TRANSFER */}
          {activeTab === 'transfer' && (
            <form onSubmit={handleExecuteTransfer} className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                {/* Source */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Origem (Sairá de)</label>
                  <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleOrigemChange('banco')}
                      className={`flex-1 py-1.5 rounded-lg text-xxs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        origem === 'banco'
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Building2 className="w-3 h-3" />
                      Banco
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOrigemChange('dinheiro')}
                      className={`flex-1 py-1.5 rounded-lg text-xxs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        origem === 'dinheiro'
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <DollarSign className="w-3 h-3" />
                      Dinheiro
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium text-center">
                    Saldo disponível: <span className="font-mono text-slate-300">{formatCurrency(origem === 'banco' ? saldoBanco : saldoDinheiro)}</span>
                  </div>
                </div>

                {/* Destination */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Destino (Entrará em)</label>
                  <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleDestinoChange('banco')}
                      className={`flex-1 py-1.5 rounded-lg text-xxs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        destino === 'banco'
                          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Building2 className="w-3 h-3" />
                      Banco
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDestinoChange('dinheiro')}
                      className={`flex-1 py-1.5 rounded-lg text-xxs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        destino === 'dinheiro'
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/20'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <DollarSign className="w-3 h-3" />
                      Dinheiro
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium text-center">
                    Saldo atual: <span className="font-mono text-slate-300">{formatCurrency(destino === 'banco' ? saldoBanco : saldoDinheiro)}</span>
                  </div>
                </div>
              </div>

              {/* Amount input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Valor a Transferir</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-extrabold text-sm">R$</span>
                  <input
                    type="number"
                    value={valorTransferencia}
                    onChange={(e) => setValorTransferencia(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-slate-900 border border-slate-750 focus:border-emerald-500 rounded-xl font-bold text-base text-white focus:outline-none focus:ring-0 placeholder:text-slate-600"
                    placeholder="0,00"
                    step="any"
                    required
                    min="0.01"
                  />
                </div>
              </div>

              {/* Real-time Preview Cards */}
              {transferAmount > 0 && (
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4.5 space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Prévia dos Saldos Após Transferência:</span>
                  
                  <div className="grid grid-cols-2 gap-3 divide-x divide-slate-800">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-medium capitalize block">{origem} (Origem)</span>
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 line-through font-mono">{formatCurrency(origem === 'banco' ? saldoBanco : saldoDinheiro)}</span>
                        <span className="text-sm font-bold text-rose-400 font-mono">{formatCurrency(previewOrigemSaldo)}</span>
                      </div>
                    </div>

                    <div className="pl-3 space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-medium capitalize block">{destino} (Destino)</span>
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 line-through font-mono">{formatCurrency(destino === 'banco' ? saldoBanco : saldoDinheiro)}</span>
                        <span className="text-sm font-bold text-emerald-400 font-mono">{formatCurrency(previewDestinoSaldo)}</span>
                      </div>
                    </div>
                  </div>

                  {!isTransferValid && (
                    <div className="flex items-center gap-1.5 text-rose-400 text-xxs font-semibold bg-rose-500/5 p-2 rounded-lg border border-rose-500/10 mt-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Saldo insuficiente na conta de origem!</span>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={!isTransferValid}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
              >
                <RefreshCw className="w-4 h-4 shrink-0 animate-spin-slow" />
                Confirmar Transferência
              </button>

            </form>
          )}

          {/* TAB 2: ADJUST */}
          {activeTab === 'adjust' && (
            <form onSubmit={handleExecuteAdjust} className="space-y-4">
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex gap-3">
                <HelpCircle className="w-4.5 h-4.5 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-blue-300 text-xxs font-display uppercase tracking-wider">Ajuste Manual de Caixa</h4>
                  <p className="text-xxs text-slate-400 leading-relaxed">
                    Use esta aba para alterar o saldo atual das suas contas para bater exatamente com a realidade (extrato ou carteira física). O aplicativo recalculará o investimento inicial de forma compatível.
                  </p>
                </div>
              </div>

              <div className="space-y-3.5">
                {/* Bank adjust */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saldo Atual no Banco</label>
                    <span className="text-xxs text-slate-500">Atual: {formatCurrency(saldoBanco)}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-extrabold text-sm">R$</span>
                    <input
                      type="number"
                      value={novoBanco}
                      onChange={(e) => setNovoBanco(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-emerald-500 rounded-xl font-bold text-sm text-white focus:outline-none focus:ring-0 placeholder:text-slate-600"
                      placeholder="0,00"
                      step="any"
                      required
                    />
                  </div>
                </div>

                {/* Cash adjust */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saldo Atual em Dinheiro (Espécie)</label>
                    <span className="text-xxs text-slate-500">Atual: {formatCurrency(saldoDinheiro)}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-extrabold text-sm">R$</span>
                    <input
                      type="number"
                      value={novoDinheiro}
                      onChange={(e) => setNovoDinheiro(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-emerald-500 rounded-xl font-bold text-sm text-white focus:outline-none focus:ring-0 placeholder:text-slate-600"
                      placeholder="0,00"
                      step="any"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Adjust Preview */}
              {(difBanco !== 0 || difDinheiro !== 0) && (
                <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Diferenças no Caixa:</span>
                  <div className="space-y-1 font-mono text-xxs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mudança no Banco:</span>
                      <span className={difBanco >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                        {difBanco >= 0 ? '+' : ''}{formatCurrency(difBanco)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mudança em Dinheiro:</span>
                      <span className={difDinheiro >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                        {difDinheiro >= 0 ? '+' : ''}{formatCurrency(difDinheiro)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-1.5 mt-1 font-bold">
                      <span className="text-slate-300">Ajuste Líquido Total:</span>
                      <span className={totalDiferenca >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {totalDiferenca >= 0 ? '+' : ''}{formatCurrency(totalDiferenca)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
              >
                <Check className="w-4 h-4 shrink-0" />
                Salvar Saldos Ajustados
              </button>

            </form>
          )}

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xxs text-rose-400 font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xxs text-emerald-400 font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-ping"></span>
              {successMessage}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900/40 border-t border-slate-700/50 text-[10px] text-slate-500 leading-snug">
          💡 Transferências mudam a composição do seu saldo entre Banco e Espécie sem alterar o lucro acumulado das vendas.
        </div>

      </div>
    </div>
  );
}
