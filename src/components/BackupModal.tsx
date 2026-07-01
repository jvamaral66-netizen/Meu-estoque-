import React, { useState, useRef } from 'react';
import { X, Download, Upload, Copy, Check, ShieldAlert, FileJson, FileText, RefreshCw, Database } from 'lucide-react';
import { AppState } from '../types';
import { formatCurrency, getTodayDateString } from '../utils';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: AppState;
  onRestore: (restoredState: AppState) => void;
}

export default function BackupModal({ isOpen, onClose, currentState, onRestore }: BackupModalProps) {
  const [copied, setCopied] = useState(false);
  const [inputText, setInputText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Convert current state to stringified JSON for export
  const getBackupDataString = () => {
    return JSON.stringify(currentState, null, 2);
  };

  // 1. Export as file
  const handleExportFile = () => {
    try {
      const dataStr = getBackupDataString();
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `backup_estoque_${getTodayDateString()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setSuccessMessage('Arquivo de backup exportado com sucesso!');
      setErrorMessage('');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setErrorMessage('Erro ao exportar arquivo de backup.');
      setSuccessMessage('');
    }
  };

  // 2. Export as clipboard text (highly reliable for webviews/APKs)
  const handleCopyCode = () => {
    try {
      const dataStr = JSON.stringify(currentState);
      // Base64 encode to make it compact and secure for copy/paste
      const base64Code = btoa(unescape(encodeURIComponent(dataStr)));
      
      navigator.clipboard.writeText(base64Code);
      setCopied(true);
      setSuccessMessage('Código de backup copiado para a área de transferência!');
      setErrorMessage('');
      setTimeout(() => {
        setCopied(false);
        setSuccessMessage('');
      }, 4000);
    } catch (err) {
      // Fallback to raw JSON if base64 fails
      try {
        navigator.clipboard.writeText(JSON.stringify(currentState));
        setCopied(true);
        setSuccessMessage('Código JSON de backup copiado!');
        setErrorMessage('');
        setTimeout(() => {
          setCopied(false);
          setSuccessMessage('');
        }, 4000);
      } catch (e) {
        setErrorMessage('Não foi possível copiar automaticamente. Use a exportação por arquivo.');
      }
    }
  };

  // Helper to validate restored JSON structure
  const validateAndParseState = (jsonText: string): AppState | null => {
    try {
      const parsed = JSON.parse(jsonText);
      
      // Basic validation checks
      if (typeof parsed !== 'object' || parsed === null) {
        throw new Error('Formato inválido. Precisa ser um objeto.');
      }
      
      if (!('capitalInicial' in parsed) || typeof parsed.capitalInicial !== 'number') {
        throw new Error('Campo "capitalInicial" é obrigatório e precisa ser um número.');
      }
      
      if (!('aparelhos' in parsed) || !Array.isArray(parsed.aparelhos)) {
        throw new Error('Campo "aparelhos" é obrigatório e precisa ser uma lista.');
      }
      
      return parsed as AppState;
    } catch (err: any) {
      setErrorMessage(`Erro na validação do backup: ${err.message || 'Dados corrompidos ou inválidos.'}`);
      return null;
    }
  };

  // 3. Process backup restoration
  const handleRestore = (jsonText: string) => {
    let cleanText = jsonText.trim();
    
    // Check if it's base64 encoded and decode if so
    if (!cleanText.startsWith('{')) {
      try {
        cleanText = decodeURIComponent(escape(atob(cleanText)));
      } catch (e) {
        // Not base64, continue to parse as raw text
      }
    }

    const validatedState = validateAndParseState(cleanText);
    if (validatedState) {
      onRestore(validatedState);
      setSuccessMessage('🎉 Backup restaurado com sucesso! Seus dados foram carregados.');
      setErrorMessage('');
      setInputText('');
      setSelectedFile(null);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 2000);
    }
  };

  // File drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        setSelectedFile(file);
        readFileContent(file);
      } else {
        setErrorMessage('Por favor, selecione apenas arquivos de backup .json');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      readFileContent(file);
    }
  };

  const readFileContent = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(text);
    };
    reader.onerror = () => {
      setErrorMessage('Erro ao ler o arquivo selecionado.');
    };
    reader.readAsText(file);
  };

  const handleTriggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in" id="backup-modal">
      <div className="bg-[#1e293b] border border-slate-700/70 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center border border-purple-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">Backup e Restauração</h2>
              <p className="text-xxs text-slate-400">Proteja seus dados contra perdas ou ao atualizar o APK</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-900/60 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700/40 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[80vh]">
          
          {/* APK Reinstall Alert */}
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-rose-300 text-xs font-display uppercase tracking-wider">Atenção usuários de APK / Android</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ao <strong>desinstalar o aplicativo antigo</strong> para instalar uma nova versão (atualização), o Android <strong>apaga definitivamente</strong> toda a memória local do app.
              </p>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                Para não perder suas vendas, produtos cadastrados e saldo de caixa, siga estes passos simples:
              </p>
              <ol className="list-decimal list-inside text-xs text-slate-400 space-y-1 pl-1 mt-1 font-medium">
                <li>Clique em <strong className="text-purple-300">Copiar Código de Backup</strong> ou <strong className="text-purple-300">Exportar Arquivo</strong> antes de atualizar.</li>
                <li>Guarde o arquivo ou cole o código no seu WhatsApp ou Bloco de Notas.</li>
                <li>Instale a nova versão do aplicativo.</li>
                <li>Abra este painel na nova versão, cole o código ou envie o arquivo e clique em <strong className="text-purple-300">Restaurar</strong>!</li>
              </ol>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. EXPORT SECTION */}
            <div className="bg-slate-900/40 rounded-2xl border border-slate-700/30 p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-display">Passo 1: Fazer Cópia de Segurança</span>
                <h3 className="text-sm font-bold text-white">Salvar meus dados atuais</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Crie uma cópia dos seus dados de caixa, estoque de aparelhos e despesas registradas agora mesmo.
                </p>
                
                <div className="p-3 bg-[#1e293b]/60 rounded-xl border border-slate-700/40 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-medium">Conteúdo do backup atual:</span>
                  <div className="flex justify-between text-xxs font-mono text-slate-300">
                    <span>Aparelhos no total:</span>
                    <span className="font-bold text-blue-400">{currentState.aparelhos.length}</span>
                  </div>
                  <div className="flex justify-between text-xxs font-mono text-slate-300">
                    <span>Despesas registradas:</span>
                    <span className="font-bold text-rose-400">{(currentState.despesas ?? []).length}</span>
                  </div>
                  <div className="flex justify-between text-xxs font-mono text-slate-300 border-t border-slate-700/30 pt-1 mt-1">
                    <span>Saldo total do Caixa:</span>
                    <span className="font-bold text-emerald-400">
                      {formatCurrency(
                        (currentState.capitalInicial) + 
                        currentState.aparelhos.filter(p => p.status === 'vendido').reduce((s, p) => s + ((p.valorVenda || 0) - p.valorCompra), 0) - 
                        (currentState.despesas ?? []).reduce((s, d) => s + d.valor, 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-purple-950/20 active:scale-[0.98]"
                >
                  {copied ? <Check className="w-4 h-4 text-white shrink-0" /> : <Copy className="w-4 h-4 shrink-0" />}
                  {copied ? 'Código Copiado!' : 'Copiar Código de Backup'}
                </button>
                
                <button
                  type="button"
                  onClick={handleExportFile}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  Salvar Arquivo de Backup (.json)
                </button>
              </div>
            </div>

            {/* 2. IMPORT SECTION */}
            <div className="bg-slate-900/40 rounded-2xl border border-slate-700/30 p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-display">Passo 2: Restaurar Meus Dados</span>
                <h3 className="text-sm font-bold text-white">Carregar backup existente</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Insira o arquivo ou código de backup que você salvou anteriormente para restaurar todas as suas informações.
                </p>

                {/* File Upload Drag and Drop Target */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={handleTriggerFileSelect}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                    dragActive
                      ? 'border-purple-500 bg-purple-500/10 text-purple-300'
                      : selectedFile
                      ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400'
                      : 'border-slate-750 hover:border-slate-600 hover:bg-slate-800/40 text-slate-400'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <>
                      <FileJson className="w-6 h-6 text-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-bold truncate max-w-full block text-slate-200">
                        {selectedFile.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {(selectedFile.size / 1024).toFixed(1)} KB • Pronto para restaurar
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-slate-500" />
                      <span className="text-[11px] font-bold text-slate-300 block">
                        Solte o arquivo .json aqui ou clique para selecionar
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Suporta apenas arquivos de backup salvos por este aplicativo
                      </span>
                    </>
                  )}
                </div>

                {/* Textarea Paste Target */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Ou cole o Código de Backup de texto:</label>
                  <textarea
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      if (selectedFile) setSelectedFile(null); // Clear selected file visual if they type
                    }}
                    placeholder="Cole aqui aquele código longo de backup..."
                    className="w-full h-16 bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono text-[10px] text-purple-300 focus:border-purple-500 focus:outline-none resize-none placeholder:text-slate-600"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleRestore(inputText)}
                disabled={!inputText.trim()}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-950/20 active:scale-[0.98]"
              >
                <RefreshCw className="w-4 h-4 shrink-0" />
                Restaurar Dados Agora
              </button>
            </div>

          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 font-medium flex items-center gap-2 animate-shake">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-semibold flex items-center gap-2 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-ping"></span>
              {successMessage}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-900/40 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-500">
          <span>Seus backups são criptografados localmente e nunca são enviados para a internet.</span>
          <span className="font-bold text-slate-400">Controle de Caixa Privado</span>
        </div>

      </div>
    </div>
  );
}
