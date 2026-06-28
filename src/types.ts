export interface Produto {
  id: string;
  categoria?: 'iPhone' | 'Android' | 'Videogame' | 'Notebook' | 'Ferramenta' | 'Outros';
  modelo: string; // Nome do modelo, videogame, notebook, ferramenta ou outro
  cor?: string; // Opcional (iPhone/Android)
  armazenamento?: string; // Opcional (iPhone/Android/Videogame)
  saudeBateria?: number; // Opcional (iPhone, opcional em Android)
  valorCompra: number;
  dataCompra: string; // YYYY-MM-DD
  status: 'estoque' | 'vendido';
  valorVenda?: number;
  dataVenda?: string; // YYYY-MM-DD
  meioPagamento?: 'banco' | 'dinheiro'; // Meio de pagamento da compra (padrão: 'banco')
  meioRecebimento?: 'banco' | 'dinheiro'; // Meio de recebimento da venda (padrão: 'banco')
  
  // Campos específicos novos
  marca?: string; // Para Android (Samsung, Xiaomi, etc.) ou Notebook
  observacoes?: string; // Campo opcional de observações para todos
}

// Alias para compatibilidade reversa com os componentes que importam iPhone
export type iPhone = Produto;

export interface Despesa {
  id: string;
  descricao: string;
  valor: number;
  data: string; // YYYY-MM-DD
  meioPagamento: 'banco' | 'dinheiro';
  categoria: 'marketing' | 'logistica' | 'embalagem' | 'taxas' | 'outros';
  observacoes?: string;
}

export interface AppState {
  capitalInicial: number;
  capitalBancoInicial?: number; // Parte do capital inicial no banco
  capitalDinheiroInicial?: number; // Parte do capital inicial em dinheiro físico
  aparelhos: Produto[];
  despesas?: Despesa[]; // Histórico de despesas
}

