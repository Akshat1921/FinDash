import React, { useState } from 'react';
import axios from 'axios';
import { usePortfolio } from '../../context/PortfolioContext';

interface StockSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: {symbol: string, name: string} | null;
}

interface ApiResponse {
  success: boolean;
  error?: string;
  message?: string;
}

const StockSelectionModal: React.FC<StockSelectionModalProps> = ({
  isOpen,
  onClose,
  stock
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [purchaseDate, setPurchaseDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { addStock, isStockSelected, getSelectedStock, removeStock } = usePortfolio();

  // IMPORTANT: Always call all hooks before any early returns
  const selectedStock = getSelectedStock(stock?.symbol || '');
  const isSelected = isStockSelected(stock?.symbol || '');

  React.useEffect(() => {
    if (isSelected && selectedStock) {
      setQuantity(selectedStock.quantity);
      setPurchaseDate(selectedStock.purchaseDate);
    }
    // Clear error when modal opens
    setError('');
  }, [isSelected, selectedStock, isOpen]);

  // NOW we can do early returns after all hooks are called
  if (!isOpen || !stock) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Add to local cart (portfolio context)
      const stockData = {
        stockSymbol: stock.symbol,
        companyName: stock.name,
        quantity,
        purchaseDate
      };

      addStock(stockData);
      
      // Make API call to pre-fetch financial data for the stock (background)
      try {
        await axios.get(`http://localhost:8081/stocks/get_all_financials/${stock.symbol}`);
        console.log(`✅ Financial data fetched for ${stock.symbol}`);
      } catch (apiError: any) {
        // If GET fails, try POST fallback
        if (apiError.response?.status === 404) {
          try {
            await axios.post(`http://localhost:8081/stocks/add_financials/${stock.symbol}`);
            console.log(`✅ Financial data added for ${stock.symbol} via fallback`);
          } catch (fallbackError) {
            console.log(`⚠️ Failed to fetch financial data for ${stock.symbol}`);
          }
        } else {
          console.log(`⚠️ Failed to fetch financial data for ${stock.symbol}`);
        }
      }
      
      setSuccess(true);
      
      // Show success message briefly before closing
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (error: any) {
      console.error('Error adding stock to cart:', error);
      setError(error.message || 'Failed to add stock to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    removeStock(stock.symbol);
    onClose();
  };

  // Early return AFTER all hooks have been called
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">
            {success ? '✅ Added to Cart!' : (isSelected ? 'Update Stock' : 'Add to Cart')}
          </h3>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Stock Added to Cart!</h4>
            <p className="text-white/70">
              {stock.symbol} has been added to your cart. Continue shopping or view your cart.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h4 className="font-medium text-white">{stock.symbol}</h4>
              <p className="text-sm text-white/70">{stock.name}</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-white mb-2">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-white/20 rounded-lg 
                       bg-white/10 backdrop-blur-sm text-white 
                       focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40
                       transition duration-200"
              required
            />
          </div>

          <div>
            <label htmlFor="purchaseDate" className="block text-sm font-medium text-white mb-2">
              Purchase Date
            </label>
            <input
              type="date"
              id="purchaseDate"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-white/20 rounded-lg 
                       bg-white/10 backdrop-blur-sm text-white 
                       focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40
                       transition duration-200"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            {isSelected && (
              <button
                type="button"
                onClick={handleRemove}
                className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg 
                         border border-red-500/30 backdrop-blur-sm transition duration-200 font-medium"
              >
                Remove from Portfolio
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 disabled:bg-white/5 
                       text-blue-300 disabled:text-white/50 rounded-lg border border-blue-500/30 backdrop-blur-sm transition duration-200 font-medium 
                       disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300 mr-2"></div>
                  {isSelected ? 'Updating...' : 'Adding...'}
                </div>
              ) : (
                isSelected ? 'Update Stock' : 'Add to Portfolio'
              )}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm
                       text-white rounded-lg border border-white/20 transition duration-200 font-medium"
            >
              Cancel
            </button>
          </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockSelectionModal;
