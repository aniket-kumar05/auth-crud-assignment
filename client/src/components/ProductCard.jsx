import React from 'react';
import { Edit2, Trash2, Tag, Box, User } from 'lucide-react';

const ProductCard = ({ product, isAuthenticated, onEdit, onDelete }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 shadow-lg hover:shadow-indigo-500/5 group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Tag size={12} />
            {product.category || 'General'}
          </span>
          {product.user?.name && (
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <User size={12} />
              {product.user.name}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1.5">
          {product.name}
        </h3>

        <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 mb-4">
          {product.description || 'No description provided for this product.'}
        </p>
      </div>

      <div>
        <div className="flex items-baseline justify-between pt-3 border-t border-slate-800/80 mb-3">
          <span className="text-xl font-black text-emerald-400">
            ${Number(product.price).toFixed(2)}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Box size={14} className="text-slate-500" />
            {product.stock} in stock
          </span>
        </div>

        {isAuthenticated && (
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => onEdit(product)}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <Edit2 size={13} /> Edit
            </button>
            <button
              onClick={() => onDelete(product)}
              className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition cursor-pointer"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
