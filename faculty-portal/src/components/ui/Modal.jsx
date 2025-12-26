import React, { useEffect } from "react";
import { X } from "lucide-react";
function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      {" "}
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slide-in">
        {" "}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          {" "}
          <h3 className="text-xl font-semibold">{title}</h3>{" "}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {" "}
            <X size={20} />{" "}
          </button>{" "}
        </div>{" "}
        <div className="p-6">{children}</div>{" "}
      </div>{" "}
    </div>
  );
}
export default Modal;
