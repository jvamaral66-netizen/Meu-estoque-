import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, ArrowUpRight, ShieldAlert, BadgePercent } from 'lucide-react';
import { iPhone } from '../types';
import { formatCurrency, formatDate } from '../utils';

interface SellModalProps {
  isOpen: boolean;
  onClose: () => void;
  estoque: iPhone[];
  preSelectedIphoneId?: string;
  onSell: (iphoneId: string, valorVenda: number, dataVenda: string) => void;
}

export default function SellModal({ isOpen, onClose, estoque, preSelectedIphoneId, onSell }: SellModalProps) {
  const getTodayDateString = () => {
    // Current local time as metadata: 2026-06-27
    return '2026-06-27';
  };

  const [selectedId, setSelectedId] = useState('');
  const [valorVenda, setValorVenda] = useState('');
  const [dataVenda, setDataVenda] = useState(getTodayDateString());
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
      setError('');
    }
  }, [isOpen, preSelectedIphoneId, estoque]);

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

    onSell(selectedId, saleValue, dataVenda);
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
                    onChange={(e) => setValorVenda(e.target.value)}
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
