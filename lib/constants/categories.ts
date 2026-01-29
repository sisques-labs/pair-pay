// Categorías predefinidas para gastos en PairPay MVP

export const EXPENSE_CATEGORIES = [
  {
    id: 'food',
    name: 'Comida y Restaurantes',
    emoji: '🍔',
    color: '#FF6B6B',
  },
  {
    id: 'home',
    name: 'Casa y Hogar',
    emoji: '🏠',
    color: '#4ECDC4',
  },
  {
    id: 'transport',
    name: 'Transporte',
    emoji: '🚗',
    color: '#45B7D1',
  },
  {
    id: 'entertainment',
    name: 'Ocio y Entretenimiento',
    emoji: '🎉',
    color: '#FFA07A',
  },
  {
    id: 'utilities',
    name: 'Servicios',
    emoji: '💡',
    color: '#98D8C8',
  },
  {
    id: 'shopping',
    name: 'Compras',
    emoji: '🛒',
    color: '#F7DC6F',
  },
  {
    id: 'health',
    name: 'Salud',
    emoji: '🏥',
    color: '#BB8FCE',
  },
  {
    id: 'other',
    name: 'Otros',
    emoji: '📱',
    color: '#95A5A6',
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
