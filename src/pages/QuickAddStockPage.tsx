import React from 'react';
import { DefaultNavbar } from '../components/Navbar/DefaultNavbar';
import DirectStockAddForm from '../components/Company/DirectStockAddForm';
import { useNavigate } from 'react-router-dom';

const QuickAddStockPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStockAdded = () => {
    // Navigate to portfolio page after successful addition
    setTimeout(() => {
      navigate('/portfolio');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800">
      <DefaultNavbar />
      
      <div className="max-w-lg mx-auto pt-20 px-4">
        <div className="mb-8 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h1 className="text-3xl font-bold text-white mb-4">
              Quick Add Stock
            </h1>
            <p className="text-white/70">
              Add a stock directly to your portfolio without browsing
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-2xl">
          <DirectStockAddForm 
            onStockAdded={handleStockAdded}
          />
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/stocks')}
            className="text-white hover:text-white/80 font-medium bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg border border-white/20 backdrop-blur-sm transition duration-200"
          >
            ← Browse stocks instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickAddStockPage;
