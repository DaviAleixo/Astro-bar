
export enum Shift {
  MORNING = 'Manhã',
  AFTERNOON = 'Tarde',
  // Fix: Added NIGHT shift to the enum as it is referenced in ProfileView.tsx and supported in LogsView.tsx
  NIGHT = 'Noite'
}

export enum Category {
  DESTILADO = 'Destilado',
  LICOR = 'Licor',
  CERVEJA = 'Cerveja',
  VINHO = 'Vinho',
  REFRIGERANTE = 'Refrigerante',
  INSUMO = 'Insumo',
  OUTROS = 'Outros'
}

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
  shift: Shift;
  isAdmin?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  lowStockThreshold: number;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  shift: Shift;
  createdAt: string;
}

export interface Log {
  id: string;
  userId: string;
  userName: string;
  userShift: Shift;
  action: string;
  timestamp: string;
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};
