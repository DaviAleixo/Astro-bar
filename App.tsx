
import React, { useState, useEffect, useCallback } from 'react';
import { Shift, User, Product, Task, Log, Category } from './types';
import { StorageService } from './services/storage';
import { INITIAL_PRODUCTS, DEFAULT_TASKS, USERS } from './constants';
import Layout from './components/Layout';
import LoginView from './views/LoginView';
import StockView from './views/StockView';
import ChecklistView from './views/ChecklistView';
import LogsView from './views/LogsView';
import ProfileView from './views/ProfileView';
import UsersView from './views/UsersView';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(StorageService.getCurrentUser());
  const [activeTab, setActiveTab] = useState('stock');
  const [products, setProducts] = useState<Product[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Initialization
  useEffect(() => {
    // Load initial data if storage is empty
    const storedProducts = StorageService.getProducts();
    if (storedProducts.length === 0) {
      StorageService.saveProducts(INITIAL_PRODUCTS);
      setProducts(INITIAL_PRODUCTS);
    } else {
      setProducts(storedProducts);
    }

    const storedTasks = StorageService.getTasks();
    if (storedTasks.length === 0) {
      const initialTasks: Task[] = DEFAULT_TASKS.map((t, i) => ({
        id: `t${i}`,
        text: t.text,
        completed: false,
        shift: t.shift,
        createdAt: new Date().toISOString()
      }));
      StorageService.saveTasks(initialTasks);
      setTasks(initialTasks);
    } else {
      setTasks(storedTasks);
    }

    const storedUsers = StorageService.getUsers();
    if (storedUsers.length === 0) {
      StorageService.saveUsers(USERS);
      setAllUsers(USERS);
    } else {
      setAllUsers(storedUsers);
    }

    setLogs(StorageService.getLogs());
  }, []);

  const createLog = useCallback((action: string) => {
    if (!currentUser) return;
    const newLog: Log = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      userShift: currentUser.shift,
      action,
      timestamp: new Date().toISOString()
    };
    StorageService.saveLog(newLog);
    setLogs(prev => [newLog, ...prev]);
  }, [currentUser]);

  const handleLogin = (username: string, pass: string): boolean => {
    // Use the latest list from state for authentication
    const user = allUsers.find(u => u.username === username && u.password === pass);
    if (user) {
      setCurrentUser(user);
      StorageService.saveCurrentUser(user);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    StorageService.saveCurrentUser(null);
    setActiveTab('stock');
  };

  const handleUpdateStock = (productId: string, delta: number) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        const newQty = Math.max(0, p.quantity + delta);
        createLog(`${delta > 0 ? 'Adicionou' : 'Removeu'} ${Math.abs(delta)} unidade(s) de "${p.name}"`);
        return { ...p, quantity: newQty };
      }
      return p;
    });
    setProducts(updated);
    StorageService.saveProducts(updated);
  };

  const handleAddProduct = (newP: Omit<Product, 'id'>) => {
    const p: Product = { ...newP, id: Math.random().toString(36).substr(2, 9) };
    const updated = [...products, p];
    setProducts(updated);
    StorageService.saveProducts(updated);
    createLog(`Cadastrou novo produto: "${p.name}"`);
  };

  const handleAddTask = (text: string) => {
    if (!currentUser) return;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      completed: false,
      shift: currentUser.shift,
      createdAt: new Date().toISOString()
    };
    const updated = [...tasks, newTask];
    setTasks(updated);
    StorageService.saveTasks(updated);
    createLog(`Criou nova tarefa: "${text}"`);
  };

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map(t => {
      if (t.id === taskId) {
        const newState = !t.completed;
        createLog(`${newState ? 'Concluiu' : 'Desmarcou'} a tarefa: "${t.text}"`);
        return { ...t, completed: newState };
      }
      return t;
    });
    setTasks(updated);
    StorageService.saveTasks(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (taskToDelete) {
      const updated = tasks.filter(t => t.id !== taskId);
      setTasks(updated);
      StorageService.saveTasks(updated);
      createLog(`Removeu a tarefa: "${taskToDelete.text}"`);
    }
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    
    // Update current user
    setCurrentUser(updatedUser);
    StorageService.saveCurrentUser(updatedUser);

    // Update in all users list
    const updatedAllUsers = allUsers.map(u => u.id === currentUser.id ? updatedUser : u);
    setAllUsers(updatedAllUsers);
    StorageService.saveUsers(updatedAllUsers);
    
    createLog(`Atualizou informações de perfil`);
  };

  const handleAdminUpdateUser = (userId: string, updates: Partial<User>) => {
    const userToUpdate = allUsers.find(u => u.id === userId);
    if (!userToUpdate) return;

    const updatedUser = { ...userToUpdate, ...updates };
    const updatedAllUsers = allUsers.map(u => u.id === userId ? updatedUser : u);
    
    setAllUsers(updatedAllUsers);
    StorageService.saveUsers(updatedAllUsers);

    // If updating the current user, refresh it
    if (currentUser && userId === currentUser.id) {
      setCurrentUser(updatedUser);
      StorageService.saveCurrentUser(updatedUser);
    }

    createLog(`Administrador atualizou o perfil de: "${updatedUser.name}"`);
  };

  const handleAddUser = (newU: Omit<User, 'id'>) => {
    const u: User = { ...newU, id: Math.random().toString(36).substr(2, 9) };
    const updated = [...allUsers, u];
    setAllUsers(updated);
    StorageService.saveUsers(updated);
    createLog(`Cadastrou novo funcionário: "${u.name}" (@${u.username})`);
  };

  const handleDeleteUser = (userId: string) => {
    const userToDelete = allUsers.find(u => u.id === userId);
    if (userToDelete) {
      const updated = allUsers.filter(u => u.id !== userId);
      setAllUsers(updated);
      StorageService.saveUsers(updated);
      createLog(`Excluiu perfil do funcionário: "${userToDelete.name}"`);
    }
  };

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'stock':
        return <StockView products={products} onUpdateQuantity={handleUpdateStock} onAddProduct={handleAddProduct} />;
      case 'checklist':
        return (
          <ChecklistView 
            tasks={tasks} 
            userShift={currentUser.shift} 
            onAddTask={handleAddTask} 
            onToggleTask={handleToggleTask} 
            onDeleteTask={handleDeleteTask}
          />
        );
      case 'logs':
        return <LogsView logs={logs} />;
      case 'profile':
        return (
          <ProfileView 
            user={currentUser} 
            personalLogs={logs.filter(l => l.userId === currentUser.id)} 
            onUpdateUser={handleUpdateUser}
          />
        );
      case 'users':
        if (!currentUser.isAdmin) return null;
        return (
          <UsersView 
            users={allUsers} 
            onAddUser={handleAddUser} 
            onUpdateUser={handleAdminUpdateUser}
            onDeleteUser={handleDeleteUser} 
            currentUserId={currentUser.id} 
          />
        );
      default:
        return <StockView products={products} onUpdateQuantity={handleUpdateStock} onAddProduct={handleAddProduct} />;
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
      userName={currentUser.name}
      userShift={currentUser.shift}
      isAdmin={currentUser.isAdmin}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
