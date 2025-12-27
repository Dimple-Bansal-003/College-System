import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

function Toast({ message, type = 'success', onClose }) {
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={`fixed bottom-5 right-5 ${bgColor} text-white px-6 py-4 rounded-lg shadow-xl animate-slide-in flex items-center gap-3 z-50`}>
      <Icon size={20} />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70"><X size={18} /></button>
    </div>
  );
}

export default Toast;