
import React, { useState, useMemo } from 'react';
import { Plus, Minus, Search, PackagePlus, ArrowUpDown, Filter, X } from 'lucide-react';
import { Product, Category } from '../types';

interface StockViewProps {
  products: Product[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
}

type SortKey = 'name' | 'category' | 'quantity' | 'status';

const StockView: React.FC<StockViewProps> = ({ products, onUpdateQuantity, onAddProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'name', direction: 'asc' });
  const [mobileFilterStatus, setMobileFilterStatus] = useState<'ALL' | 'CRITICAL' | 'ZERADO'>('ALL');
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: Category.OUTROS,
    quantity: 0,
    lowStockThreshold: 5
  });

  const getStockStatus = (p: Product) => {
    if (p.quantity <= 0) return 'ZERADO';
    if (p.quantity <= p.lowStockThreshold) return 'ATENÇÃO';
    return 'OK';
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'ZERADO': return 'text-red-600 bg-red-100';
      case 'ATENÇÃO': return 'text-astro-orange bg-orange-100';
      default: return 'text-green-700 bg-green-100';
    }
  };

  const sortedAndFilteredProducts = useMemo(() => {
    let result = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Mobile specific status filter
    if (mobileFilterStatus === 'CRITICAL') {
      result = result.filter(p => p.quantity <= p.lowStockThreshold && p.quantity > 0);
    } else if (mobileFilterStatus === 'ZERADO') {
      result = result.filter(p => p.quantity <= 0);
    }

    result.sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof Product];
      let bValue: any = b[sortConfig.key as keyof Product];

      if (sortConfig.key === 'status') {
        aValue = getStockStatus(a);
        bValue = getStockStatus(b);
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [products, searchTerm, sortConfig, mobileFilterStatus]);

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name) return;
    onAddProduct(newProduct);
    setIsAdding(false);
    setNewProduct({ name: '', category: Category.OUTROS, quantity: 0, lowStockThreshold: 5 });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-astro-green">Estoque Global</h2>
          <p className="text-slate-500 text-sm font-medium">Gestão dinâmica e organizada.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-2 bg-astro-green text-white px-5 py-3.5 rounded-2xl shadow-md active:scale-95 transition-all"
        >
          <PackagePlus className="w-5 h-5" />
          <span className="font-bold text-sm">Novo Item</span>
        </button>
      </div>

      {/* Barra de Pesquisa e Filtros Mobile */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Pesquisar no bar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-astro-green/5 focus:border-astro-green transition-all shadow-sm bg-white font-medium text-slate-700"
          />
        </div>

        {/* Filtros Inteligentes Mobile */}
        <div className="flex md:hidden gap-2 overflow-x-auto pb-2 custom-scrollbar">
          <button 
            onClick={() => setMobileFilterStatus('ALL')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all border ${mobileFilterStatus === 'ALL' ? 'bg-astro-green text-white border-astro-green' : 'bg-white text-slate-500 border-slate-200'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setMobileFilterStatus('CRITICAL')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all border ${mobileFilterStatus === 'CRITICAL' ? 'bg-astro-orange text-white border-astro-orange' : 'bg-white text-slate-500 border-slate-200'}`}
          >
            Críticos
          </button>
          <button 
            onClick={() => setMobileFilterStatus('ZERADO')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all border ${mobileFilterStatus === 'ZERADO' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-slate-500 border-slate-200'}`}
          >
            Zerados
          </button>
          <div className="h-8 w-px bg-slate-200 mx-1 shrink-0" />
          <button 
            onClick={() => handleSort('quantity')}
            className="whitespace-nowrap px-4 py-2 bg-white text-slate-500 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1"
          >
            Qtd {sortConfig.key === 'quantity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => handleSort('name')}
            className="whitespace-nowrap px-4 py-2 bg-white text-slate-500 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1"
          >
            Nome {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 hidden md:table-header-group">
              <tr>
                <th 
                  onClick={() => handleSort('name')}
                  className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-astro-green transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Produto <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('status')}
                  className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center cursor-pointer hover:text-astro-green transition-colors"
                >
                  <div className="flex items-center justify-center gap-1">
                    Status <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('quantity')}
                  className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center cursor-pointer hover:text-astro-green transition-colors"
                >
                  <div className="flex items-center justify-center gap-1">
                    Qtd <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ajuste</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedAndFilteredProducts.map((product) => {
                const status = getStockStatus(product);
                return (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors flex flex-col md:table-row relative group">
                    {/* Nome e Categoria */}
                    <td className="p-4 md:py-4 md:px-4">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-astro-green uppercase mb-0.5 tracking-tighter opacity-70">
                          {product.category}
                        </span>
                        <span className="font-black text-slate-800 text-lg md:text-base pr-20 md:pr-0">
                          {product.name}
                        </span>
                        <div className="md:hidden mt-1">
                           <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${getStatusStyles(status)}`}>
                            {status}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status Desktop */}
                    <td className="hidden md:table-cell p-4 text-center">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${getStatusStyles(status)}`}>
                        {status}
                      </span>
                    </td>

                    {/* Quantidade */}
                    <td className="px-4 py-2 md:p-4 text-left md:text-center flex items-center gap-4 md:table-cell">
                      <div className="md:hidden text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estoque:</div>
                      <span className={`text-3xl md:text-xl font-black ${product.quantity === 0 ? 'text-red-500' : 'text-astro-green'}`}>
                        {product.quantity}
                      </span>
                    </td>

                    {/* Ações de Ajuste */}
                    <td className="p-4 md:p-4 border-t md:border-t-0 bg-slate-50/30 md:bg-transparent">
                      <div className="flex justify-end items-center gap-4 md:gap-3">
                        <button
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          disabled={product.quantity <= 0}
                          className="flex-1 md:flex-none h-14 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-white md:bg-slate-100 text-slate-500 border border-slate-200 md:border-0 active:bg-red-500 active:text-white transition-all disabled:opacity-20"
                        >
                          <Minus className="w-6 h-6 md:w-5 md:h-5" />
                        </button>
                        <button
                          onClick={() => onUpdateQuantity(product.id, 1)}
                          className="flex-1 md:flex-none h-14 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-astro-green text-white active:bg-opacity-80 transition-all shadow-sm"
                        >
                          <Plus className="w-6 h-6 md:w-5 md:h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {sortedAndFilteredProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <p className="text-slate-400 font-bold">Nenhum produto encontrado com esses filtros.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-astro-green/40 backdrop-blur-sm flex items-center justify-center p-4 z-[70]">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-bold text-astro-green mb-6">Novo Produto</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Nome do Item</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-astro-green/5 outline-none font-bold"
                  placeholder="Ex: Jack Daniel's"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Categoria</label>
                  <select
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})}
                    className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-astro-green/5 outline-none bg-white font-bold"
                  >
                    {Object.values(Category).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Qtd Inicial</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProduct.quantity}
                    onChange={e => setNewProduct({...newProduct, quantity: parseInt(e.target.value)})}
                    className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-astro-green/5 outline-none font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Limite para Alerta</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newProduct.lowStockThreshold}
                  onChange={e => setNewProduct({...newProduct, lowStockThreshold: parseInt(e.target.value)})}
                  className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-astro-green/5 outline-none font-bold"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="w-full py-4 rounded-2xl border border-slate-200 font-bold text-slate-400 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-astro-green text-white font-black shadow-lg shadow-green-100 active:scale-95 transition-all"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockView;
