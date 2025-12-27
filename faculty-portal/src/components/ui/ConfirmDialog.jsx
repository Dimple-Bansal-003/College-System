import React from 'react';

function ConfirmDialog({ onConfirm, onCancel }) {
  return (
    <div className="flex gap-2">
      <button onClick={onConfirm} className="text-red-600 text-sm font-medium hover:text-red-800">Confirm?</button>
      <button onClick={onCancel} className="text-gray-500 text-sm hover:text-gray-700">Cancel</button>
    </div>
  );
}

export default ConfirmDialog;