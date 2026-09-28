import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteProduct } from '../redux/productSlice';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

const DeleteModal = ({ isOpen, onClose, product }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.products);

  if (!isOpen || !product) return null;

  const handleDelete = async () => {
    const result = await dispatch(deleteProduct(product._id));
    if (deleteProduct.fulfilled.match(result)) {
      toast.success(`Deleted '${product.name}' successfully.`);
      onClose();
    } else {
      toast.error('Failed to delete product.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
          <AlertTriangle size={28} />
        </div>

        <h2 className="text-xl font-bold text-white">Delete Product</h2>
        <p className="text-slate-400 text-xs leading-relaxed">
          Are you sure you want to delete <strong className="text-slate-200">{product.name}</strong>? This action cannot be undone.
        </p>

        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-lg shadow-red-600/25 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete Product'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
