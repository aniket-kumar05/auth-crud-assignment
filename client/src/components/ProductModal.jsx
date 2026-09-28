import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createProduct, updateProduct, clearProductErrors } from '../redux/productSlice';
import { X, PackagePlus, Edit } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductModal = ({ isOpen, onClose, initialData }) => {
  const dispatch = useDispatch();
  const { loading, error, validationErrors } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'General',
    stock: 10,
    description: '',
  });

  const isEditing = !!initialData?._id;

  useEffect(() => {
    if (isOpen) {
      dispatch(clearProductErrors());
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          price: initialData.price || '',
          category: initialData.category || 'General',
          stock: initialData.stock !== undefined ? initialData.stock : 10,
          description: initialData.description || '',
        });
      } else {
        setFormData({
          name: '',
          price: '',
          category: 'General',
          stock: 10,
          description: '',
        });
      }
    }
  }, [isOpen, initialData, dispatch]);

  if (!isOpen) return null;

  const getFieldError = (fieldName) => {
    if (!validationErrors || !Array.isArray(validationErrors)) return null;
    const err = validationErrors.find(
      (e) => e.path === fieldName || e.param === fieldName || e.field === fieldName
    );
    return err ? err.msg || err.message : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    if (isEditing) {
      const result = await dispatch(
        updateProduct({ id: initialData._id, productData: payload })
      );
      if (updateProduct.fulfilled.match(result)) {
        toast.success('Product updated successfully!');
        onClose();
      } else if (updateProduct.rejected.match(result)) {
        toast.error(result.payload?.message || 'Failed to update product.');
      }
    } else {
      const result = await dispatch(createProduct(payload));
      if (createProduct.fulfilled.match(result)) {
        toast.success('Product created successfully!');
        onClose();
      } else if (createProduct.rejected.match(result)) {
        toast.error(result.payload?.message || 'Failed to create product.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            {isEditing ? <Edit size={20} /> : <PackagePlus size={20} />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-slate-400 text-xs">
              {isEditing
                ? 'Update product attributes in the store'
                : 'Fill in details to list a new product'}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="prod-name" className="text-xs font-semibold text-slate-300">
              Product Name *
            </label>
            <input
              type="text"
              id="prod-name"
              placeholder="e.g. Wireless Noise Canceling Headphones"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            {getFieldError('name') && (
              <p className="text-red-400 text-xs mt-0.5">{getFieldError('name')}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="prod-price" className="text-xs font-semibold text-slate-300">
                Price ($) *
              </label>
              <input
                type="number"
                id="prod-price"
                step="0.01"
                min="0"
                placeholder="99.99"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
              {getFieldError('price') && (
                <p className="text-red-400 text-xs mt-0.5">{getFieldError('price')}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="prod-stock" className="text-xs font-semibold text-slate-300">
                Stock Quantity
              </label>
              <input
                type="number"
                id="prod-stock"
                min="0"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
              {getFieldError('stock') && (
                <p className="text-red-400 text-xs mt-0.5">{getFieldError('stock')}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="prod-category" className="text-xs font-semibold text-slate-300">
              Category
            </label>
            <input
              type="text"
              id="prod-category"
              placeholder="e.g. Electronics, Footwear, Books"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
            {getFieldError('category') && (
              <p className="text-red-400 text-xs mt-0.5">{getFieldError('category')}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="prod-description" className="text-xs font-semibold text-slate-300">
              Description
            </label>
            <textarea
              id="prod-description"
              rows={3}
              placeholder="Brief description of product features..."
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            {getFieldError('description') && (
              <p className="text-red-400 text-xs mt-0.5">{getFieldError('description')}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition cursor-pointer disabled:opacity-50"
            >
              {loading
                ? 'Saving...'
                : isEditing
                ? 'Update Product'
                : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
