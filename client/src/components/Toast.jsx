import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const Toast = ({ toasts }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${
            toast.type === 'success' ? 'toast-success' : 'toast-error'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toast;
