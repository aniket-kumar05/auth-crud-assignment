import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMe } from './redux/authSlice';
import { fetchProducts, setSearchQuery } from './redux/productSlice';
import { ToastContainer } from 'react-toastify';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import AuthModal from './components/AuthModal';
import ProductModal from './components/ProductModal';
import DeleteModal from './components/DeleteModal';

import { Search, Plus, PackageX, Loader2 } from 'lucide-react';

function App() {
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { products, loading, searchQuery } = useSelector((state) => state.products);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
    if (localStorage.getItem('accessToken')) {
      dispatch(fetchMe());
    }
  }, [dispatch]);

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsProductOpen(true);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleOpenAddProduct = () => {
    setSelectedProduct(null);
    setIsProductOpen(true);
  };

  const filteredProducts = products.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(query) ||
      p.category?.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />

      <Hero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Search & Action Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search products by name or category..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition placeholder:text-slate-500"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            />
          </div>

          {isAuthenticated && (
            <button
              onClick={handleOpenAddProduct}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition cursor-pointer"
            >
              <Plus size={18} /> Add Product
            </button>
          )}
        </div>

        {/* Product Catalog Grid */}
        {loading && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
            <Loader2 className="animate-spin text-indigo-500" size={36} />
            <p className="text-sm font-medium">Loading products catalog...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isAuthenticated={isAuthenticated}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-500">
              <PackageX size={32} />
            </div>
            <h3 className="text-lg font-bold text-white">No Products Found</h3>
            <p className="text-slate-400 text-sm max-w-sm">
              {searchQuery
                ? `No products match "${searchQuery}"`
                : 'Be the first to list a product in the catalog!'}
            </p>
          </div>
        )}
      </main>

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <ProductModal
        isOpen={isProductOpen}
        onClose={() => {
          setIsProductOpen(false);
          setSelectedProduct(null);
        }}
        initialData={selectedProduct}
      />

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />

      {/* React-Toastify Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;
