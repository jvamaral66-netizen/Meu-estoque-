import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, ArrowUpRight, ShieldAlert, BadgePercent, Building2 } from 'lucide-react';
import { iPhone } from '../types';
import { formatCurrency, formatDate, getTodayDateString } from '../utils';

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  estoque: iPhone[];
  preSelectedIphoneId?: string;
  onSell: (
    iphoneId: string,
    valorVenda: number,
    dataVenda: string,
    meioRecebimento: 'banco' | 'dinheiro' | 'misto',
    valorBanco?: number,
    valorDinheiro?: number
  ) => void;
}

export default function SellModal({ isOpen, onClose, estoque, preSelectedIphoneId, onSell }: SellModalProps) {
  const [selectedId, setSelectedId] = useState('');
  const [valorVenda, setValorVenda] = useState('');
  const [dataVenda, setDataVenda] = useState(getTodayDateString());
  const [meioRecebimento, setMeioRecebimento] = useState<'banco' | 'dinheiro' | 'misto'>('banco');
  const [valorBanco, setValorBanco] = useState('');
  const [valorDinheiro, setValorDinheiro] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (preSelectedIphoneId && estoque.some(item => item.id === preSelectedIphoneId)) {
        setSelectedId(preSelectedIphoneId);
      } else if (estoque.length > 0) {
        setSelectedId(estoque[0].id);
      } else {
        setSelectedId('');
      }
      setValorVenda('');
      setDataVenda(getTodayDateString());
      setMeioRecebimento('banco');
      setValorBanco('');
      setValorDinheiro('');
      setError('');
    }
  }, [isOpen, preSelectedIphoneId, estoque]);

  // When switching to misto, prefill defaults
  useEffect(() => {
    if (meioRecebimento === 'misto') {
      const total = parseFloat(valorVenda) || 0;
      setValorBanco((total / 2).toString());
      setValorDinheiro((total / 2).toString());
    } else {
      setValorBanco('');
      setValorDinheiro('');
    }
  }, [meioRecebimento]);

  const handleValorVendaChange = (val: string) => {
    setValorVenda(val);
    if (meioRecebimento === 'misto') {
      const total = parseFloat(val) || 0;
      setValorBanco((total / 2).toString());
      setValorDinheiro((total / 2).toString());
    }
  };

  const handleDinheiroChange = (val: string) => {
    setValorDinheiro(val);
    const numDinheiro = parseFloat(val) || 0;
    const total = parseFloat(valorVenda) || 0;
    const remaining = Math.max(0, total - numDinheiro);
    setValorBanco(remaining ? Number(remaining.toFixed(2)).toString() : '0');
  };

  const handleBancoChange = (val: string) => {
    setValorBanco(val);
    const numBanco = parseFloat(val) || 0;
    const total = parseFloat(valorVenda) || 0;
    const remaining = Math.max(0, total - numBanco);
    setValorDinheiro(remaining ? Number(remaining.toFixed(2)).toString() : '0');
  };

  if (!isOpen) return null;

  const selectedIphone = estoque.find((item) => item.id === selectedId);
  const purchasePrice = selectedIphone ? selectedIphone.valorCompra : 0;
  const parsedSalePrice = parseFloat(valorVenda) || 0;
  const estimatedProfit = parsedSalePrice - purchasePrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedId) {
      setError('Por favor, selecione um aparelho em estoque.');
      return;
    }

    const saleValue = parseFloat(valorVenda);
    if (isNaN(saleValue) || saleValue <= 0) {
      setError('O valor da venda deve ser maior que zero.');
      return;
    }

    if (!dataVenda) {
      setError('Por favor, selecione a data da venda.');
      return;
    }

    if (meioRecebimento === 'misto') {
      const vBanco = parseFloat(valorBanco) || 0;
      const vDinheiro = parseFloat(valorDinheiro) || 0;
      if (vBanco < 0 || vDinheiro < 0) {
        setError('Os valores parciais não podem ser negativos.');
        return;
      }
      const sum = Number((vBanco + vDinheiro).toFixed(2));
      const totalFixed = Number(saleValue.toFixed(2));
      if (Math.abs(sum - totalFixed) > 0.02) {
        setError(`A soma dos valores parciais (${formatCurrency(sum)}) deve ser igual ao valor total da venda (${formatCurrency(saleValue)}).`);
        return;
      }
      onSell(selectedId, saleValue, dataVenda, 'misto', vBanco, vDinheiro);
    } else {
      onSell(selectedId, saleValue, dataVenda, meioRecebimento);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/70 backdrop-blur-md" id="iphone-sell-modal">
      <div className="relative bg-[#1e293b] w-full max-w-md rounded-3xl shadow-2xl border border-slate-700/60 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white font-display">Registrar Venda</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            id="btn-close-sell-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-rose-950/30 border border-rose-900/50 text-rose-400 px-4 py-3 rounded-xl text-sm" id="sell-error-msg">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {estoque.length === 0 ? (
            <div className="text-center py-6 space-y-2">
              <p className="text-slate-400 text-sm">Não há aparelhos no estoque para realizar uma venda.</p>
              <p className="text-xs text-emerald-400 font-semibold">Compre um aparelho primeiro!</p>
            </div>
          ) : (
            <>
              {/* Select iPhone in stock */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Selecionar Produto</label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-emerald-500 rounded-xl text-white font-medium focus:outline-none transition-colors text-sm cursor-pointer"
                  id="select-iphone-para-venda"
                >
                  {estoque.map((item) => {
                    const extraInfo = [
                      item.armazenamento,
                      item.cor ? `(${item.cor})` : null
                    ].filter(Boolean).join(' ');
                    const categoryLabel = item.categoria && item.categoria !== 'iPhone' ? `[${item.categoria}] ` : '';
                    return (
                      <option key={item.id} value={item.id}>
                        {categoryLabel}{item.modelo}{extraInfo ? ` ${extraInfo}` : ''} - Pago: {formatCurrency(item.valorCompra)}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Display Chosen iPhone Stats */}
              {selectedIphone && (
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/40 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Categoria</span>
                    <span className="font-semibold text-slate-300 capitalize">{selectedIphone.categoria || 'iPhone'}</span>
                  </div>
                  {selectedIphone.saudeBateria !== undefined ? (
                    <div>
                      <span className="text-slate-500 block">Bateria</span>
                      <span className="font-semibold text-slate-300">{selectedIphone.saudeBateria}% de saúde</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-slate-500 block">Data de Compra</span>
                      <span className="font-semibold text-slate-300">{formatDate(selectedIphone.dataCompra)}</span>
                    </div>
                  )}
                  {selectedIphone.saudeBateria !== undefined && (
                    <div className="col-span-2">
                      <span className="text-slate-500 block">Data de Compra</span>
                      <span className="font-semibold text-slate-300">{formatDate(selectedIphone.dataCompra)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Sale Value */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Valor da Venda</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <span className="text-slate-400 text-sm font-semibold">R$</span>
                  </div>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    required
                    value={valorVenda}
                    onChange={(e) => handleValorVendaChange(e.target.value)}
                    placeholder="0,00"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-emerald-500 rounded-xl text-white font-semibold font-mono text-sm focus:outline-none transition-colors"
                    id="input-valor-venda"
                  />
                </div>
              </div>

              {/* Dynamic Profit Estimator */}
              {selectedIphone && valorVenda && (
                <div className={`p-4 rounded-xl border flex justify-between items-center ${
                  estimatedProfit >= 0 
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400' 
                    : 'bg-rose-950/30 border-rose-900/50 text-rose-400'
                }`}>
                  <div className="space-y-0.5">
                    <span className="text-xs uppercase tracking-wider font-semibold opacity-75">Lucro Estimado</span>
                    <h4 className="text-lg font-bold font-display font-mono">{formatCurrency(estimatedProfit)}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xs block opacity-75">Retorno</span>
                    <span className="font-bold">
                      {(((parsedSalePrice - purchasePrice) / purchasePrice) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Sale Date */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Data da Venda</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    required
                    value={dataVenda}
                    onChange={(e) => setDataVenda(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-emerald-500 rounded-xl text-white font-medium text-sm focus:outline-none transition-colors"
                    id="input-data-venda"
                  />
                </div>
              </div>

              {/* Destination/Receipt Method */}
              <div className="space-y-2 pt-2 border-t border-slate-750/30">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Como Recebeu o Valor? (Destino)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMeioRecebimento('banco')}
                    className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                      meioRecebimento === 'banco'
                        ? 'bg-blue-600/10 text-blue-400 border-blue-500/30 font-extrabold shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-750 hover:text-slate-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4 shrink-0" />
                    Banco / Pix / Cartão
                  </button>
                  <button
                    type="button"
                    onClick={() => setMeioRecebimento('dinheiro')}
                    className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                      meioRecebimento === 'dinheiro'
                        ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/30 font-extrabold shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-750 hover:text-slate-300'
                    }`}
                  >
                    <DollarSign className="w-4 h-4 shrink-0" />
                    Dinheiro Físico
                  </button>
                  <button
                    type="button"
                    onClick={() => setMeioRecebimento('misto')}
                    className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                      meioRecebimento === 'misto'
                        ? 'bg-purple-600/10 text-purple-400 border-purple-500/30 font-extrabold shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-750 hover:text-slate-300'
                    }`}
                  >
                    <BadgePercent className="w-4 h-4 shrink-0" />
                    Dividido (Misto)
                  </button>
                </div>
              </div>

              {/* Sub-inputs for Split Payment */}
              {meioRecebimento === 'misto' && (
                <div className="p-4 bg-slate-900/45 rounded-2xl border border-slate-750/50 space-y-3" id="split-payment-inputs">
                  <span className="text-[11px] font-bold text-purple-400 block uppercase tracking-wider font-display">Ajustar Divisão do Recebimento</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Em Dinheiro (R$)</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold font-mono">R$</span>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={valorDinheiro}
                          onChange={(e) => handleDinheiroChange(e.target.value)}
                          className="w-full pl-7 pr-2 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-semibold font-mono text-xs focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">No Banco/Pix/Cartão (R$)</label>
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold font-mono">R$</span>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={valorBanco}
                          onChange={(e) => handleBancoChange(e.target.value)}
                          className="w-full pl-7 pr-2 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-semibold font-mono text-xs focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-tight">
                    * Ao alterar um valor, o outro se ajusta automaticamente para somar o total de <span className="font-bold text-slate-200">{formatCurrency(parsedSalePrice)}</span>.
                  </p>
                </div>
              )}
            </>
          )}
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-900/40 rounded-b-3xl flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-700 bg-slate-800 text-slate-300 font-semibold rounded-xl text-sm hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={estoque.length === 0}
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-sm hover:bg-emerald-50 border border-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-colors cursor-pointer flex items-center gap-1"
            id="btn-confirm-venda"
          >
            Confirmar Venda
          </button>
        </div>

      </div>
    </div>
  );
}
