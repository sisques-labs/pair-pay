// Categorías predefinidas para gastos en PairPay MVP

export const EXPENSE_CATEGORIES = [
  {
    id: 'food',
    name: 'Comida y Restaurantes',
    emoji: '🍔',
    color: '#93C5FD',
  },
  {
    id: 'home',
    name: 'Casa y Hogar',
    emoji: '🏠',
    color: '#9CA3AF',
  },
  {
    id: 'transport',
    name: 'Transporte',
    emoji: '🚗',
    color: '#60A5FA',
  },
  {
    id: 'entertainment',
    name: 'Ocio y Entretenimiento',
    emoji: '🎉',
    color: '#D1D5DB',
  },
  {
    id: 'utilities',
    name: 'Servicios',
    emoji: '💡',
    color: '#3B82F6',
  },
  {
    id: 'shopping',
    name: 'Compras',
    emoji: '🛒',
    color: '#9CA3AF',
  },
  {
    id: 'health',
    name: 'Salud',
    emoji: '🏥',
    color: '#6B7280',
  },
  {
    id: 'other',
    name: 'Otros',
    emoji: '📱',
    color: '#9CA3AF',
  },
] as const;

export type ExpenseCategoryId = typeof EXPENSE_CATEGORIES[number]['id'];

export const getCategoryById = (id: string) => {
  return EXPENSE_CATEGORIES.find(cat => cat.id === id);
};

export const getCategoryColor = (id: string): string => {
  return getCategoryById(id)?.color ?? '#95A5A6';
};

export const getCategoryEmoji = (id: string): string => {
  return getCategoryById(id)?.emoji ?? '📱';
};

export const getCategoryName = (id: string): string => {
  return getCategoryById(id)?.name ?? 'Otros';
};
