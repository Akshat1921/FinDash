import React from 'react';
import DirectStockAddForm from './DirectStockAddForm';

interface DirectStockAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStockAdded?: () => void;
}

const DirectStockAddModal: React.FC<DirectStockAddModalProps> = ({
  isOpen,
  onClose,
  onStockAdded
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-md mx-4">
        <DirectStockAddForm 
          onClose={onClose}
          onStockAdded={onStockAdded}
        />
      </div>
    </div>
  );
};

export default DirectStockAddModal;
