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
  
  // Campos específicos novos
  marca?: string; // Para Android (Samsung, Xiaomi, etc.) ou Notebook
  observacoes?: string; // Campo opcional de observações para todos
}

// Alias para compatibilidade reversa com os componentes que importam iPhone
export type iPhone = Produto;

export interface AppState {
  capitalInicial: number;
  aparelhos: Produto[];
}

