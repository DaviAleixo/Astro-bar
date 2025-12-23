
import { Product, Task, Log, User } from '../types';

const KEYS = {
  PRODUCTS: 'astrobar_products',
  TASKS: 'astrobar_tasks',
  LOGS: 'astrobar_logs',
  CURRENT_USER: 'astrobar_current_user',
  ALL_USERS: 'astrobar_all_users',
  REMEMBERED_USERNAME: 'astrobar_remembered_username'
};

export const StorageService = {
  getProducts: (): Product[] => {
    const data = localStorage.getItem(KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },
  saveProducts: (products: Product[]) => {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },

  getTasks: (): Task[] => {
    const data = localStorage.getItem(KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  },
  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(KEYS.TASKS, JSON.stringify(tasks));
  },

  getLogs: (): Log[] => {
    const data = localStorage.getItem(KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  },
  saveLog: (log: Log) => {
    const logs = StorageService.getLogs();
    localStorage.setItem(KEYS.LOGS, JSON.stringify([log, ...logs].slice(0, 1000)));
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },
  saveCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  },

  getUsers: (): User[] => {
    const data = localStorage.getItem(KEYS.ALL_USERS);
    return data ? JSON.parse(data) : [];
  },
  saveUsers: (users: User[]) => {
    localStorage.setItem(KEYS.ALL_USERS, JSON.stringify(users));
  },

  getRememberedUsername: (): string => {
    return localStorage.getItem(KEYS.REMEMBERED_USERNAME) || '';
  },
  saveRememberedUsername: (username: string) => {
    localStorage.setItem(KEYS.REMEMBERED_USERNAME, username);
  },
  clearRememberedUsername: () => {
    localStorage.removeItem(KEYS.REMEMBERED_USERNAME);
  }
};
