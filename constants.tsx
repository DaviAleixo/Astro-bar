
import { Category, Shift, User } from './types';

export const INITIAL_PRODUCTS = [
  { id: '1', name: 'Jack Daniel\'s No. 7', category: Category.DESTILADO, quantity: 4, lowStockThreshold: 5 },
  { id: '2', name: 'Absolut Vodka', category: Category.DESTILADO, quantity: 12, lowStockThreshold: 5 },
  { id: '3', name: 'Heineken Long Neck', category: Category.CERVEJA, quantity: 48, lowStockThreshold: 20 },
  { id: '4', name: 'Coca-Cola 350ml', category: Category.REFRIGERANTE, quantity: 0, lowStockThreshold: 10 },
  { id: '5', name: 'Licor 43', category: Category.LICOR, quantity: 2, lowStockThreshold: 3 },
  { id: '6', name: 'Vinho Tinto Malbec', category: Category.VINHO, quantity: 8, lowStockThreshold: 4 },
  { id: '7', name: 'Hortelã Maço', category: Category.INSUMO, quantity: 5, lowStockThreshold: 2 },
];

export const DEFAULT_TASKS = [
  { text: 'Cortar frutas (Limão, Laranja)', shift: Shift.MORNING },
  { text: 'Conferir estoque inicial', shift: Shift.MORNING },
  { text: 'Limpar todos os copos e polir', shift: Shift.MORNING },
  { text: 'Organizar geladeira de serviço', shift: Shift.MORNING },
  { text: 'Repor gelo na estação', shift: Shift.AFTERNOON },
  { text: 'Limpar balcão e bancada', shift: Shift.AFTERNOON },
  { text: 'Preparar xaropes e insumos', shift: Shift.AFTERNOON },
  { text: 'Repor bebidas no final do expediente', shift: Shift.AFTERNOON },
  { text: 'Conferir estoque final', shift: Shift.AFTERNOON },
  { text: 'Lavar coqueteleiras e utensílios', shift: Shift.AFTERNOON },
];

export const USERS: User[] = [
  { id: 'admin', name: 'Administrador Dev', username: 'admin', password: 'admin', shift: Shift.AFTERNOON, isAdmin: true },
  { id: 'u1', name: 'Davi Mendes', username: 'davi', password: '123', shift: Shift.AFTERNOON, isAdmin: false },
  { id: 'u2', name: 'Aline Souza', username: 'aline', password: '123', shift: Shift.AFTERNOON, isAdmin: false },
  { id: 'u3', name: 'João Silva', username: 'joao', password: '123', shift: Shift.MORNING, isAdmin: false },
];
