import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Smartphone, ShieldAlert, Palette, HardDrive, BatteryCharging, Tag, Laptop, Cpu, Hammer, FileText } from 'lucide-react';
import { iPhone } from '../types';
import { 
  IPHONE_MODELS, 
  STORAGE_OPTIONS, 
  COLOR_OPTIONS, 
  CATEGORY_OPTIONS, 
  ANDROID_BRANDS, 
  VIDEOGAME_CONSOLES 
} from '../utils';

interface IphoneFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (phoneData: Omit<iPhone, 'id' | 'status'>) => void;
}

export default function IphoneFormModal({ isOpen, onClose, onSave }: IphoneFormModalProps) {
  const getTodayDateString = () => {
    return '2026-06-27';
  };

  const [categoria, setCategoria] = useState<'iPhone' | 'Android' | 'Videogame' | 'Notebook' | 'Ferramenta' | 'Outros'>('iPhone');

  // Fields
  const [modelo, setModelo] = useState('');
  const [customModelo, setCustomModelo] = useState('');
  const [showCustomModelo, setShowCustomModelo] = useState(false);

  const [marca, setMarca] = useState('');
  const [customMarca, setCustomMarca] = useState('');
  const [showCustomMarca, setShowCustomMarca] = useState(false);

  const [incluirBateriaAndroid, setIncluirBateriaAndroid] = useState(false);

  const [cor, setCor] = useState('');
  const [customCor, setCustomCor] = useState('');
  const [showCustomCor, setShowCustomCor] = useState(false);

  const [armazenamento, setArmazenamento] = useState('128GB');
  const [customArmazenamento, setCustomArmazenamento] = useState('');
  const [showCustomArmazenamento, setShowCustomArmazenamento] = useState(false);

  const [saudeBateria, setSaudeBateria] = useState<number>(100);
  const [valorCompra, setValorCompra] = useState<string>('');
  const [dataCompra, setDataCompra] = useState<string>(getTodayDateString());
  const [observacoes, setObservacoes] = useState('');

  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCategoria('iPhone');
      setModelo(IPHONE_MODELS[IPHONE_MODELS.length - 4] || 'iPhone 15');
      setShowCustomModelo(false);
      setCustomModelo('');
      
      setMarca('Samsung');
      setCustomMarca('');
      setShowCustomMarca(false);
      setIncluirBateriaAndroid(false);
      
      setCor(COLOR_OPTIONS[0]);
      setShowCustomCor(false);
      setCustomCor('');
      
      setArmazenamento('128GB');
      setShowCustomArmazenamento(false);
      setCustomArmazenamento('');
      
      setSaudeBateria(100);
      setValorCompra('');
      setDataCompra(getTodayDateString());
      setObservacoes('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const purchaseValue = parseFloat(valorCompra);

    if (isNaN(purchaseValue) || purchaseValue <= 0) {
      setError('O valor da compra deve ser maior que zero.');
      return;
    }
    if (!dataCompra) {
      setError('Por favor, informe a data da compra.');
      return;
    }

    let selectedModelo = '';
    let selectedMarca = '';
    let selectedCor = '';
    let selectedArmazenamento = '';
    let selectedSaudeBateria: number | undefined = undefined;

    // Build data based on category
    if (categoria === 'iPhone') {
      selectedModelo = showCustomModelo ? customModelo.trim() : modelo;
      selectedCor = showCustomCor ? customCor.trim() : cor;
      selectedArmazenamento = showCustomArmazenamento ? customArmazenamento.trim() : armazenamento;
      selectedSaudeBateria = saudeBateria;

      if (!selectedModelo) {
        setError('Por favor, informe ou selecione o modelo do iPhone.');
        return;
      }
      if (!selectedCor) {
        setError('Por favor, informe ou selecione a cor.');
        return;
      }
      if (!selectedArmazenamento) {
        setError('Por favor, informe ou selecione o armazenamento.');
        return;
      }
      if (isNaN(saudeBateria) || saudeBateria < 50 || saudeBateria > 100) {
        setError('A saúde da bateria deve ser um valor entre 50% e 100%.');
        return;
      }
    } else if (categoria === 'Android') {
      const finalBrand = showCustomMarca ? customMarca.trim() : marca;
      const finalModelName = customModelo.trim();
      
      if (!finalBrand) {
        setError('Por favor, informe a marca do aparelho Android.');
        return;
      }
      if (!finalModelName) {
        setError('Por favor, digite o modelo do aparelho Android.');
        return;
      }

      selectedModelo = `${finalBrand} ${finalModelName}`;
      selectedMarca = finalBrand;
      selectedCor = showCustomCor ? customCor.trim() : cor;
      selectedArmazenamento = showCustomArmazenamento ? customArmazenamento.trim() : armazenamento;
      
      if (incluirBateriaAndroid) {
        selectedSaudeBateria = saudeBateria;
        if (isNaN(saudeBateria) || saudeBateria < 50 || saudeBateria > 100) {
          setError('A saúde da bateria deve ser um valor entre 50% e 100%.');
          return;
        }
      }
    } else if (categoria === 'Videogame') {
      selectedModelo = showCustomModelo ? customModelo.trim() : modelo;
      if (!selectedModelo) {
        setError('Por favor, selecione ou informe o videogame.');
        return;
      }
      selectedArmazenamento = showCustomArmazenamento ? customArmazenamento.trim() : armazenamento;
      selectedCor = showCustomCor ? customCor.trim() : cor;
    } else if (categoria === 'Notebook') {
      const notebookBrand = customMarca.trim();
      const notebookModel = customModelo.trim();
      if (!notebookBrand) {
        setError('Por favor, informe a marca do notebook (ex: Apple, Dell, Asus).');
        return;
      }
      if (!notebookModel) {
        setError('Por favor, informe o modelo do notebook (ex: MacBook Pro, Inspiron 15).');
        return;
      }
      selectedModelo = `${notebookBrand} ${notebookModel}`;
      selectedMarca = notebookBrand;
      selectedArmazenamento = showCustomArmazenamento ? customArmazenamento.trim() : armazenamento;
      selectedCor = showCustomCor ? customCor.trim() : cor;
    } else if (categoria === 'Ferramenta') {
      selectedModelo = customModelo.trim();
      if (!selectedModelo) {
        setError('Por favor, informe o nome e marca da ferramenta (ex: Furadeira Bosch).');
        return;
      }
    } else if (categoria === 'Outros') {
      selectedModelo = customModelo.trim();
      if (!selectedModelo) {
        setError('Por favor, informe o nome/descrição do produto.');
        return;
      }
      selectedCor = showCustomCor ? customCor.trim() : cor;
      selectedArmazenamento = showCustomArmazenamento ? customArmazenamento.trim() : armazenamento;
    }

    onSave({
      categoria,
      modelo: selectedModelo,
      marca: selectedMarca || undefined,
      cor: selectedCor || undefined,
      armazenamento: selectedArmazenamento || undefined,
      saudeBateria: selectedSaudeBateria,
      valorCompra: purchaseValue,
      dataCompra,
      observacoes: observacoes.trim() || undefined,
    });
    
    onClose();
  };

  const getCategoryIcon = () => {
    switch (categoria) {
      case 'iPhone': return <Smartphone className="w-5 h-5 text-blue-400" />;
      case 'Android': return <Smartphone className="w-5 h-5 text-emerald-400" />;
      case 'Videogame': return <Cpu className="w-5 h-5 text-indigo-400" />;
      case 'Notebook': return <Laptop className="w-5 h-5 text-violet-400" />;
      case 'Ferramenta': return <Hammer className="w-5 h-5 text-amber-400" />;
      default: return <Tag className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/70 backdrop-blur-md" id="iphone-buy-modal">
      <div className="relative bg-[#1e293b] w-full max-w-lg rounded-3xl shadow-2xl border border-slate-700/60 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-700/60">
              {getCategoryIcon()}
            </div>
            <h2 className="text-lg font-bold text-white font-display">Registrar Entrada de Produto</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            id="btn-close-buy-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-rose-950/30 border border-rose-900/50 text-rose-400 px-4 py-3 rounded-xl text-sm" id="buy-error-msg">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Category Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Categoria do Produto</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategoria(cat);
                    setError('');
                    // Set defaults based on category
                    if (cat === 'iPhone') {
                      setModelo(IPHONE_MODELS[0]);
                      setShowCustomModelo(false);
                      setCor(COLOR_OPTIONS[0]);
                      setShowCustomCor(false);
                      setArmazenamento('128GB');
                      setShowCustomArmazenamento(false);
                    } else if (cat === 'Android') {
                      setMarca('Samsung');
                      setShowCustomMarca(false);
                      setCustomModelo('');
                      setCor(COLOR_OPTIONS[0]);
                      setShowCustomCor(false);
                      setArmazenamento('128GB');
                      setShowCustomArmazenamento(false);
                    } else if (cat === 'Videogame') {
                      setModelo(VIDEOGAME_CONSOLES[0]);
                      setShowCustomModelo(false);
                      setArmazenamento('1TB');
                      setShowCustomArmazenamento(false);
                    } else if (cat === 'Notebook') {
                      setCustomMarca('');
                      setCustomModelo('');
                      setArmazenamento('256GB');
                      setShowCustomArmazenamento(false);
                    } else {
                      setCustomModelo('');
                    }
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    categoria === cat
                      ? 'bg-blue-600 border-blue-500 text-white shadow'
                      : 'bg-slate-900 border-slate-750 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* --- iPhone Category Fields --- */}
          {categoria === 'iPhone' && (
            <>
              {/* Model Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Modelo do iPhone</label>
                {!showCustomModelo ? (
                  <select
                    value={modelo}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setShowCustomModelo(true);
                        setCustomModelo('');
                      } else {
                        setModelo(e.target.value);
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white font-medium focus:outline-none transition-colors text-sm cursor-pointer"
                    id="select-modelo"
                  >
                    {IPHONE_MODELS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                    <option value="__custom__">✍️ Outro modelo (Digitar)...</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customModelo}
                      onChange={(e) => setCustomModelo(e.target.value)}
                      placeholder="Ex: iPhone 16 Pro Max"
                      className="flex-1 px-4 py-2 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white focus:outline-none transition-colors text-sm"
                      autoFocus
                      id="input-custom-modelo"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCustomModelo(false)}
                      className="px-3 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                    >
                      Lista
                    </button>
                  </div>
                )}
              </div>

              {/* Color Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Cor</label>
                {!showCustomCor ? (
                  <select
                    value={cor}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setShowCustomCor(true);
                        setCustomCor('');
                      } else {
                        setCor(e.target.value);
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white font-medium focus:outline-none transition-colors text-sm cursor-pointer"
                    id="select-cor"
                  >
                    {COLOR_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="__custom__">✍️ Outra cor (Digitar)...</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customCor}
                      onChange={(e) => setCustomCor(e.target.value)}
                      placeholder="Ex: Verde Titânio"
                      className="flex-1 px-4 py-2 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white focus:outline-none transition-colors text-sm"
                      autoFocus
                      id="input-custom-cor"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCustomCor(false)}
                      className="px-3 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                    >
                      Lista
                    </button>
                  </div>
                )}
              </div>

              {/* Storage capacity */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Armazenamento</label>
                {!showCustomArmazenamento ? (
                  <div className="grid grid-cols-5 gap-1.5">
                    {STORAGE_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setArmazenamento(opt)}
                        className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                          armazenamento === opt && !showCustomArmazenamento
                            ? 'bg-blue-600 border-blue-500 text-white shadow'
                            : 'bg-slate-900 border-slate-750 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowCustomArmazenamento(true)}
                      className="py-2 text-xs font-medium rounded-xl border bg-slate-900 border-slate-750 text-slate-400 hover:bg-slate-800 cursor-pointer"
                    >
                      Outro...
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customArmazenamento}
                      onChange={(e) => setCustomArmazenamento(e.target.value)}
                      placeholder="Ex: 2TB"
                      className="flex-1 px-4 py-2 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white focus:outline-none transition-colors text-sm"
                      autoFocus
                      id="input-custom-armazenamento"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCustomArmazenamento(false)}
                      className="px-3 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                    >
                      Opções
                    </button>
                  </div>
                )}
              </div>

              {/* Battery Health Slider */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">
                  Saúde da Bateria: <span className="font-bold text-blue-450">{saudeBateria}%</span>
                </label>
                <div className="flex items-center gap-3 bg-slate-900 border border-slate-750 rounded-xl px-3 py-2">
                  <BatteryCharging className="w-5 h-5 text-blue-400 shrink-0" />
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={saudeBateria}
                    onChange={(e) => setSaudeBateria(parseInt(e.target.value, 10))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    id="input-range-bateria"
                  />
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={saudeBateria}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) setSaudeBateria(Math.min(100, Math.max(50, val)));
                    }}
                    className="w-12 text-center text-xs font-bold text-white bg-slate-800 border border-slate-700 rounded-lg py-1 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* --- Android Category Fields --- */}
          {categoria === 'Android' && (
            <>
              {/* Brand Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Marca do Android</label>
                {!showCustomMarca ? (
                  <select
                    value={marca}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setShowCustomMarca(true);
                        setCustomMarca('');
                      } else {
                        setMarca(e.target.value);
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white font-medium focus:outline-none transition-colors text-sm cursor-pointer"
                  >
                    {ANDROID_BRANDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                    <option value="__custom__">✍️ Outra marca (Digitar)...</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customMarca}
                      onChange={(e) => setCustomMarca(e.target.value)}
                      placeholder="Ex: Asus, OnePlus, Google"
                      className="flex-1 px-4 py-2 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white focus:outline-none transition-colors text-sm"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowCustomMarca(false)}
                      className="px-3 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                    >
                      Lista
                    </button>
                  </div>
                )}
              </div>

              {/* Model Text Input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Modelo do Android</label>
                <input
                  type="text"
                  value={customModelo}
                  onChange={(e) => setCustomModelo(e.target.value)}
                  placeholder="Ex: S24 Ultra, Redmi Note 13 Pro"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white focus:outline-none transition-colors text-sm"
                />
              </div>

              {/* Color text field (or select) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Cor</label>
                <input
                  type="text"
                  value={customCor}
                  onChange={(e) => setCustomCor(e.target.value)}
                  placeholder="Ex: Preto Cósmico, Prata"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white focus:outline-none transition-colors text-sm"
                />
              </div>

              {/* Storage */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Armazenamento</label>
                <input
                  type="text"
                  value={customArmazenamento}
                  onChange={(e) => setCustomArmazenamento(e.target.value)}
                  placeholder="Ex: 256GB, 512GB, 1TB"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white focus:outline-none transition-colors text-sm"
                />
              </div>

              {/* Battery Health Toggle and Slider */}
              <div className="space-y-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={incluirBateriaAndroid}
                    onChange={(e) => setIncluirBateriaAndroid(e.target.checked)}
                    className="w-4.5 h-4.5 bg-slate-800 border-slate-700 rounded text-blue-500 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-300">Informar saúde da bateria (Opcional)</span>
                </label>

                {incluirBateriaAndroid && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                      <span>Saúde da Bateria</span>
                      <span className="text-blue-400 font-bold">{saudeBateria}%</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-900 rounded-xl px-3 py-2">
                      <BatteryCharging className="w-5 h-5 text-blue-400 shrink-0" />
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={saudeBateria}
                        onChange={(e) => setSaudeBateria(parseInt(e.target.value, 10))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* --- Videogame Category Fields --- */}
          {categoria === 'Videogame' && (
            <>
              {/* Console selection dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Console / Aparelho</label>
                {!showCustomModelo ? (
                  <select
                    value={modelo}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setShowCustomModelo(true);
                        setCustomModelo('');
                      } else {
                        setModelo(e.target.value);
                      }
                    }}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white font-medium focus:outline-none transition-colors text-sm cursor-pointer"
                  >
                    {VIDEOGAME_CONSOLES.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                    <option value="__custom__">✍️ Outro console (Digitar)...</option>
                  </select>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customModelo}
                      onChange={(e) => setCustomModelo(e.target.value)}
                      placeholder="Ex: PlayStation 5 Pro, Steam Deck"
                      className="flex-1 px-4 py-2 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white focus:outline-none transition-colors text-sm"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowCustomModelo(false)}
                      className="px-3 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                    >
                      Lista
                    </button>
                  </div>
                )}
              </div>

              {/* Storage / Capacity */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Armazenamento / Modelo SSD</label>
                <input
                  type="text"
                  value={customArmazenamento}
                  onChange={(e) => setCustomArmazenamento(e.target.value)}
                  placeholder="Ex: 500GB, 1TB, 2TB"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white focus:outline-none transition-colors text-sm"
                />
              </div>

              {/* Color */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Cor / Edição (Opcional)</label>
                <input
                  type="text"
                  value={customCor}
                  onChange={(e) => setCustomCor(e.target.value)}
                  placeholder="Ex: Branco, Preto, Edição Especial"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white focus:outline-none transition-colors text-sm"
                />
              </div>
            </>
          )}

          {/* --- Notebook Category Fields --- */}
          {categoria === 'Notebook' && (
            <>
              {/* Brand */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Marca do Notebook</label>
                <input
                  type="text"
                  value={customMarca}
                  onChange={(e) => setCustomMarca(e.target.value)}
                  placeholder="Ex: Apple, Dell, Lenovo, HP, Acer"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white focus:outline-none transition-colors text-sm"
                />
              </div>

              {/* Model */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Modelo / Especificação</label>
                <input
                  type="text"
                  value={customModelo}
                  onChange={(e) => setCustomModelo(e.target.value)}
                  placeholder="Ex: MacBook Air M1, Inspiron 15 3000"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white focus:outline-none transition-colors text-sm"
                />
              </div>

              {/* Storage */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Especificação de Armazenamento / RAM</label>
                <input
                  type="text"
                  value={customArmazenamento}
                  onChange={(e) => setCustomArmazenamento(e.target.value)}
                  placeholder="Ex: 512GB SSD / 16GB RAM"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white focus:outline-none transition-colors text-sm"
                />
              </div>

              {/* Color */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Cor (Opcional)</label>
                <input
                  type="text"
                  value={customCor}
                  onChange={(e) => setCustomCor(e.target.value)}
                  placeholder="Ex: Cinza Espacial, Prateado"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white focus:outline-none transition-colors text-sm"
                />
              </div>
            </>
          )}

          {/* --- Ferramenta Category Fields --- */}
          {categoria === 'Ferramenta' && (
            <>
              {/* Tool Name and Brand */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Nome / Marca da Ferramenta</label>
                <input
                  type="text"
                  value={customModelo}
                  onChange={(e) => setCustomModelo(e.target.value)}
                  placeholder="Ex: Furadeira de Impacto Bosch, Parafusadeira Makita"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white focus:outline-none transition-colors text-sm"
                />
              </div>
            </>
          )}

          {/* --- Outros Category Fields --- */}
          {categoria === 'Outros' && (
            <>
              {/* Product Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Nome do Produto</label>
                <input
                  type="text"
                  value={customModelo}
                  onChange={(e) => setCustomModelo(e.target.value)}
                  placeholder="Ex: Caixa de Som JBL, Smartwatch Amazfit"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white focus:outline-none transition-colors text-sm"
                />
              </div>

              {/* Color */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Cor / Modelo (Opcional)</label>
                <input
                  type="text"
                  value={customCor}
                  onChange={(e) => setCustomCor(e.target.value)}
                  placeholder="Ex: Preto, Azul"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white focus:outline-none transition-colors text-sm"
                />
              </div>

              {/* Storage or Capacity */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Tamanho / Capacidade (Opcional)</label>
                <input
                  type="text"
                  value={customArmazenamento}
                  onChange={(e) => setCustomArmazenamento(e.target.value)}
                  placeholder="Ex: G, GG, 40mm, 64GB"
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white focus:outline-none transition-colors text-sm"
                />
              </div>
            </>
          )}

          {/* --- General Fields (Always Visible) --- */}
          
          {/* Observações Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Observações (Opcional)
            </label>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Ex: Troca de tela, acompanha caixa, sem carregador, pequenos riscos..."
              rows={2}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white text-sm focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Purchase Value */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Valor da Compra</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="text-slate-400 text-sm font-semibold">R$</span>
                </div>
                <input
                  type="number"
                  step="any"
                  min="0"
                  required
                  value={valorCompra}
                  onChange={(e) => setValorCompra(e.target.value)}
                  placeholder="0,00"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white font-semibold font-mono text-sm focus:outline-none transition-colors"
                  id="input-valor-compra"
                />
              </div>
            </div>

            {/* Purchase Date */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-display">Data da Compra</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="date"
                  required
                  value={dataCompra}
                  onChange={(e) => setDataCompra(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-750 focus:border-blue-500 rounded-xl text-white font-medium text-sm focus:outline-none transition-colors"
                  id="input-data-compra"
                />
              </div>
            </div>
          </div>

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
            className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-500 border border-blue-500/20 shadow-md transition-colors cursor-pointer flex items-center gap-1"
            id="btn-confirm-compra"
          >
            Confirmar Entrada
          </button>
        </div>

      </div>
    </div>
  );
}
