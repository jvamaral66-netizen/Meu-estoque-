import { iPhone } from './types';

// Format currency to Brazilian Real (R$)
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Format date to local Brazilian standard (DD/MM/YYYY)
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

// Check if a date string falls in the current month and year
export const isCurrentMonth = (dateString: string, referenceDate: Date = new Date()): boolean => {
  if (!dateString) return false;
  const [year, month] = dateString.split('-');
  const currentYear = referenceDate.getFullYear();
  const currentMonth = referenceDate.getMonth() + 1; // getMonth() is 0-indexed
  
  return parseInt(year, 10) === currentYear && parseInt(month, 10) === currentMonth;
};

// Translate YYYY-MM string to Portuguese month name (e.g. "2026-06" to "Junho de 2026")
export const formatMonthYearPT = (yearMonthStr: string): string => {
  if (!yearMonthStr || !yearMonthStr.includes('-')) return yearMonthStr;
  const [year, month] = yearMonthStr.split('-');
  const monthIdx = parseInt(month, 10) - 1;
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  if (monthIdx >= 0 && monthIdx < 12) {
    return `${monthNames[monthIdx]} de ${year}`;
  }
  return yearMonthStr;
};

// List of popular iPhone models to auto-suggest
export const IPHONE_MODELS = [
  'iPhone 11',
  'iPhone 11 Pro',
  'iPhone 11 Pro Max',
  'iPhone 12',
  'iPhone 12 mini',
  'iPhone 12 Pro',
  'iPhone 12 Pro Max',
  'iPhone 13',
  'iPhone 13 mini',
  'iPhone 13 Pro',
  'iPhone 13 Pro Max',
  'iPhone SE (3ª geração)',
  'iPhone 14',
  'iPhone 14 Plus',
  'iPhone 14 Pro',
  'iPhone 14 Pro Max',
  'iPhone 15',
  'iPhone 15 Plus',
  'iPhone 15 Pro',
  'iPhone 15 Pro Max',
  'iPhone 16',
  'iPhone 16 Plus',
  'iPhone 16 Pro',
  'iPhone 16 Pro Max'
];

// List of standard storage options
export const STORAGE_OPTIONS = ['64GB', '128GB', '256GB', '512GB', '1TB'];

// Standard colors list
export const COLOR_OPTIONS = [
  'Preto Espacial (Space Black)',
  'Prateado (Silver)',
  'Dourado (Gold)',
  'Grafite (Graphite)',
  'Azul-Sierra (Sierra Blue)',
  'Roxo Escuro (Deep Purple)',
  'Verde-Alpino (Alpine Green)',
  'Titânio Natural (Natural Titanium)',
  'Titânio Azul (Blue Titanium)',
  'Titânio Branco (White Titanium)',
  'Titânio Preto (Black Titanium)',
  'Preto (Black)',
  'Branco (White)',
  'Azul (Blue)',
  'Verde (Green)',
  'Amarelo (Yellow)',
  'Rosa (Pink)',
  'Vermelho (Product RED)'
];

// List of categories
export const CATEGORY_OPTIONS = [
  'iPhone',
  'Android',
  'Videogame',
  'Notebook',
  'Ferramenta',
  'Outros'
] as const;

// List of Android brands
export const ANDROID_BRANDS = [
  'Samsung',
  'Xiaomi',
  'Motorola',
  'Realme',
  'Poco',
  'Huawei',
  'Outra'
] as const;

// List of Videogame consoles
export const VIDEOGAME_CONSOLES = [
  'PlayStation 4',
  'PlayStation 5',
  'Xbox One',
  'Xbox Series S',
  'Xbox Series X',
  'Nintendo Switch',
  'Outro'
] as const;

// Seed data for initial loading if localstorage is empty
export const SEED_APARELHOS: iPhone[] = [
  {
    id: '1',
    categoria: 'iPhone',
    modelo: 'iPhone 13',
    cor: 'Azul',
    armazenamento: '128GB',
    saudeBateria: 87,
    valorCompra: 2800,
    dataCompra: '2026-06-10',
    status: 'estoque'
  },
  {
    id: '2',
    categoria: 'iPhone',
    modelo: 'iPhone 14 Pro',
    cor: 'Roxo Escuro',
    armazenamento: '256GB',
    saudeBateria: 92,
    valorCompra: 4500,
    dataCompra: '2026-06-12',
    status: 'estoque'
  },
  {
    id: '3',
    categoria: 'iPhone',
    modelo: 'iPhone 12',
    cor: 'Preto',
    armazenamento: '128GB',
    saudeBateria: 83,
    valorCompra: 1900,
    dataCompra: '2026-05-15',
    status: 'vendido',
    valorVenda: 2450,
    dataVenda: '2026-06-05'
  },
  {
    id: '4',
    categoria: 'iPhone',
    modelo: 'iPhone 15 Pro',
    cor: 'Titânio Natural',
    armazenamento: '256GB',
    saudeBateria: 98,
    valorCompra: 5800,
    dataCompra: '2026-06-01',
    status: 'vendido',
    valorVenda: 6700,
    dataVenda: '2026-06-18'
  }
];
