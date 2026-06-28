import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Building2, 
  DollarSign, 
  Calendar, 
  TrendingDown, 
  Tag, 
  FileText, 
  Info,
  ChevronDown
} from 'lucide-react';
import { Despesa } from '../types';
import { formatCurrency, formatDate } from '../utils';

interface ExpensesViewProps {
  despesas: Despesa[];
  selectedMonth: string;
  onAddDespesa: (despesaData: Omit<Despesa, 'id'>) => void;
  onDeleteDespesa: (id: string) => void;
}

export default function ExpensesView({
  despesas,
  selectedMonth,
  onAddDespesa,
  onDeleteDespesa
}: ExpensesViewProps) {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('2026-06-27');
  const [meioPagamento, setMeioPagamento] = useState<'banco' | 'dinheiro'>('banco');
  const [categoria, setCategoria] = useState<'marketing' | 'logistica' | 'embalagem' | 'taxas' | 'outros'>('outros');
  const [observacoes, setObservacoes] = useState('');
  const [error, setError] = useState('');

  const isInSelectedMonth = (dateString: string) => {
    if (!dateString) return false;
    if (selectedMonth === 'all') return true;
    return dateString.substring(0, 7) === selectedMonth;
  };

  const despesasFiltradas = despesas.filter(d => isInSelectedMonth(d.data));
  const totalDespesasFiltradas = despesasFiltradas.reduce((sum, d) => sum + d.valor, 0);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'marketing': return 'Marketing/Anúncios';
      case 'logistica': return 'Entrega/Frete';
      case 'embalagem': return 'Embalagens/Brindes';
      case 'taxas': return 'Taxas/Comissões';
      default: return 'Outros Gastos';
    }
  };

  const getCategoryStyle = (cat: string) => {
    switch (cat) {
      case 'marketing': return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
      case 'logistica': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'embalagem': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'taxas': return 'bg-pink-500/10 text-pink-400 border border-pink-500/20';
      default: return 'bg-slate-500/10 text-slate-300 border border-slate-700';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedValor = parseFloat(valor);
    if (!descricao.trim()) {
      setError('Por favor, informe a descrição do gasto.');
      return;
    }
    if (isNaN(parsedValor) || parsedValor <= 0) {
      setError('O valor deve ser maior que zero.');
      return;
    }
    if (!data) {
      setError('Por favor, informe a data da despesa.');
      return;
    }

    onAddDespesa({
      descricao: descricao.trim(),
      valor: parsedValor,
      data,
      meioPagamento,
      categoria,
      observacoes: observacoes.trim() || undefined
    });

    // Reset fields
    setDescricao('');
    setValor('');
    setObservacoes('');
    setIsAddFormOpen(false);
  };

  return (
    <div className="space-y-6" id="expenses-view-root">
      
      {/* Overview and Fast Trigger */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1e293b] p-5 rounded-3xl border border-slate-700/50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center border border-rose-500/20">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white font-display text-sm">Controle de Despesas</h3>
            <p className="text-xs text-slate-400">
              {selectedMonth === 'all' 
                ? `Total acumulado de despesas extras: `
                : `Total de despesas em seu mês de referência: `
              }
              <strong className="text-rose-400 font-mono">{formatCurrency(totalDespesasFiltradas)}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddFormOpen(!isAddFormOpen)}
          className="w-full sm:w-auto px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {isAddFormOpen ? 'Fechar Formulário' : 'Nova Despesa'}
        </button>
      </div>

      {/* Add Gasto Form */}
      {isAddFormOpen && (
        <form onSubmit={handleSubmit} className="bg-[#1e293b] border border-slate-700/50 p-5 rounded-3xl space-y-4 shadow-md">
          <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-rose-400" />
            Cadastrar Novo Gasto Operacional
          </h4>

          {error && (
            <div className="bg-rose-950/30 border border-rose-900/50 text-rose-400 p-3 rounded-xl text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Descricao */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Descrição do Gasto</label>
              <input
                type="text"
                required
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Embalagem p/ Correios, Anúncio Instagram..."
                className="w-full px-4.5 py-2.5 bg-slate-900 border border-slate-750 focus:border-rose-500 rounded-xl text-white font-medium text-xs focus:outline-none transition-all"
              />
            </div>

            {/* Valor */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Valor Gasto</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">R$</span>
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="0,00"
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-rose-500 rounded-xl text-white font-semibold font-mono text-xs focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Categoria */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Categoria</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-rose-500 rounded-xl text-white font-medium text-xs focus:outline-none transition-all cursor-pointer"
              >
                <option value="marketing">Marketing & Tráfego Pago</option>
                <option value="logistica">Logística, Frete & Combustível</option>
                <option value="embalagem">Embalagens & Brindes</option>
                <option value="taxas">Taxas Administrativas / Bancárias</option>
                <option value="outros">Outros Negócios</option>
              </select>
            </div>

            {/* Data */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Data do Pagamento</label>
              <input
                type="date"
                required
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-rose-500 rounded-xl text-white font-medium text-xs focus:outline-none transition-all cursor-pointer"
              />
            </div>

            {/* Meio de pagamento */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Forma de Pagamento (De onde saiu o saldo?)</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMeioPagamento('banco')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                    meioPagamento === 'banco'
                      ? 'bg-blue-600/10 text-blue-400 border-blue-500/30'
                      : 'bg-slate-900 text-slate-400 border-slate-750 hover:text-slate-300'
                  }`}
                >
                  <Building2 className="w-4 h-4 shrink-0" />
                  Saldo do Banco
                </button>
                <button
                  type="button"
                  onClick={() => setMeioPagamento('dinheiro')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 border ${
                    meioPagamento === 'dinheiro'
                      ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-900 text-slate-400 border-slate-750 hover:text-slate-300'
                  }`}
                >
                  <DollarSign className="w-4 h-4 shrink-0" />
                  Dinheiro Físico
                </button>
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Observações adicionais (Opcional)</label>
              <textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Insira detalhes adicionais sobre o fornecedor, motivo do gasto, etc."
                rows={2}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-rose-500 rounded-xl text-white font-medium text-xs focus:outline-none transition-all resize-none"
              />
            </div>

          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-750/40">
            <button
              type="button"
              onClick={() => setIsAddFormOpen(false)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors shadow cursor-pointer"
            >
              Confirmar Gasto
            </button>
          </div>
        </form>
      )}

      {/* Expenses List */}
      <div className="bg-[#1e293b] rounded-3xl border border-slate-700/50 p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-750 pb-3">
          <div>
            <h4 className="font-bold text-white font-display text-base">Relação de Despesas</h4>
            <p className="text-xs text-slate-400">Listando despesas registradas no filtro selecionado</p>
          </div>
          <span className="text-xs font-bold bg-slate-900 px-3 py-1 rounded-full border border-slate-750 text-slate-300">
            {despesasFiltradas.length} {despesasFiltradas.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>

        {despesasFiltradas.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mx-auto border border-slate-750">
              <Info className="w-6 h-6" />
            </div>
            <p className="text-sm text-slate-400">Nenhum gasto ou despesa extra cadastrada para este mês.</p>
            {!isAddFormOpen && (
              <button
                onClick={() => setIsAddFormOpen(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-rose-400 hover:text-rose-300 font-bold text-xxs rounded-lg transition-all cursor-pointer border border-slate-700"
              >
                Cadastrar Primeiro Gasto
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-500 font-bold border-b border-slate-750 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-2">Data</th>
                  <th className="py-3 px-2">Descrição</th>
                  <th className="py-3 px-2">Categoria</th>
                  <th className="py-3 px-2">Saindo de</th>
                  <th className="py-3 px-2 text-right">Valor</th>
                  <th className="py-3 px-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-750/50">
                {despesasFiltradas.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/10 transition-colors group">
                    <td className="py-3.5 px-2 font-mono text-slate-400 shrink-0">
                      {formatDate(item.data)}
                    </td>
                    <td className="py-3.5 px-2">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white block">{item.descricao}</span>
                        {item.observacoes && (
                          <span className="text-[10px] text-slate-400 block">{item.observacoes}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] inline-block ${getCategoryStyle(item.categoria)}`}>
                        {getCategoryLabel(item.categoria)}
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      <div className="flex items-center gap-1.5">
                        {item.meioPagamento === 'banco' ? (
                          <>
                            <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span className="text-slate-300 font-medium">Banco</span>
                          </>
                        ) : (
                          <>
                            <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="text-slate-300 font-medium">Espécie</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-2 text-right font-bold text-rose-400 font-mono text-sm">
                      {formatCurrency(item.valor)}
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <button
                        onClick={() => onDeleteDespesa(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer opacity-70 group-hover:opacity-100 border border-transparent hover:border-rose-500/20"
                        title="Remover Gasto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
