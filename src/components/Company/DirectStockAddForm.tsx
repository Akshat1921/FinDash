import React, { useState } from 'react';
import axios from 'axios';

interface DirectStockAddProps {
  onStockAdded?: () => void;
  onClose?: () => void;
}

interface ApiResponse {
  success: boolean;
  error?: string;
  message?: string;
}

interface StockFormData {
  ticker: string;
  companyName: string;
  quantity: number;
  purchaseDate: string;
}

const DirectStockAddForm: React.FC<DirectStockAddProps> = ({
  onStockAdded,
  onClose
}) => {
  const [formData, setFormData] = useState<StockFormData>({
    ticker: '',
    companyName: '',
    quantity: 1,
    purchaseDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      // Prepare stock data for backend (UserStockDto format)
      const stockDto = {
        ticker: formData.ticker.toUpperCase(),
        companyName: formData.companyName,
        quantity: formData.quantity.toString(),
        purchaseDate: formData.purchaseDate
      };

      // Add stock directly to portfolio
      const response = await axios.post<ApiResponse>(
        'http://localhost:8090/main/add-stock',
        stockDto,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess(`Stock ${formData.ticker} added successfully!`);
        
        // Reset form
        setFormData({
          ticker: '',
          companyName: '',
          quantity: 1,
          purchaseDate: new Date().toISOString().split('T')[0]
        });

        // Notify parent component
        if (onStockAdded) {
          onStockAdded();
        }

        // Auto-close after success (optional)
        setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, 2000);
      } else {
        setError(response.data.error || 'Failed to add stock');
      }
    } catch (error: any) {
      console.error('Error adding stock:', error);
      
      if (error.response?.data) {
        const errorData = error.response.data as ApiResponse;
        setError(errorData.error || 'Failed to add stock');
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Failed to add stock. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">
          Add Stock to Portfolio
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-lg">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-lg">
          <p className="text-sm text-green-300">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ticker" className="block text-sm font-medium text-white mb-2">
            Stock Ticker Symbol *
          </label>
          <input
            type="text"
            id="ticker"
            name="ticker"
            value={formData.ticker}
            onChange={handleInputChange}
            placeholder="e.g., AAPL, GOOGL, MSFT"
            className="w-full px-3 py-2 border border-white/20 rounded-lg 
                     bg-white/10 backdrop-blur-sm text-white 
                     focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40
                     placeholder-white/50 transition duration-200"
            required
          />
        </div>

        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-white mb-2">
            Company Name *
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            placeholder="e.g., Apple Inc., Google, Microsoft"
            className="w-full px-3 py-2 border border-white/20 rounded-lg 
                     bg-white/10 backdrop-blur-sm text-white 
                     focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40
                     placeholder-white/50 transition duration-200"
            required
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-white mb-2">
            Quantity *
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-white/20 rounded-lg 
                     bg-white/10 backdrop-blur-sm text-white 
                     focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40
                     transition duration-200"
            required
          />
        </div>

        <div>
          <label htmlFor="purchaseDate" className="block text-sm font-medium text-white mb-2">
            Purchase Date *
          </label>
          <input
            type="date"
            id="purchaseDate"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleInputChange}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-white/20 rounded-lg 
                     bg-white/10 backdrop-blur-sm text-white 
                     focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40
                     transition duration-200"
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm
                       text-white rounded-lg border border-white/20 transition duration-200 font-medium"
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 backdrop-blur-sm
                     text-white rounded-lg border border-white/20 transition duration-200 font-medium 
                     disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Adding Stock...
              </div>
            ) : (
              'Add to Portfolio'
            )}
          </button>
        </div>
      </form>

      <div className="mt-4 p-3 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg">
        <p className="text-xs text-blue-300">
          <strong>Note:</strong> Stock prices will be automatically fetched based on the ticker symbol and purchase date. 
          Make sure the ticker symbol is correct.
        </p>
      </div>
    </div>
  );
};

export default DirectStockAddForm;
