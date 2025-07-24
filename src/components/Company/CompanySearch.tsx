import React, { useEffect, useState } from "react";
import axios from "axios";
import type { StockInfo, StocksResponse } from "../../models/companyOverview/Ticker";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { SearchBar } from "../SearchBar/SearchBar";
import { DefaultNavbar } from "../Navbar/DefaultNavbar";
import StockSelectionModal from "./StockSelectionModal";
import { usePortfolio } from "../../context/PortfolioContext";


const Stocks: React.FC = () => {
  const [stocks, setStocks] = useState<[string, StockInfo][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();
  const [selectedStock, setSelectedStock] = useState<{symbol: string, name: string} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const { selectedStocks } = usePortfolio();
  const isPortfolioMode = searchParams.get('portfolio') === 'true';

  useEffect(() => {
    setLoading(true);
    setError("");
    axios
      .get<StocksResponse>("http://localhost:8000/stocks")
      .then((response) => {
        // Convert object to array for easier pagination
        const stockEntries = Object.entries(response.data.items);
        setStocks(stockEntries);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to fetch stocks.");
        setLoading(false);
      });
  }, []);

  const filteredStocks = stocks.filter(([symbol, info]) =>
    [symbol, ...info].some((field) =>
      field
        .toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
  );

  const totalCompanies = stocks.length;
  const lastIndex = currentPage * postsPerPage;
  const firstIndex = lastIndex - postsPerPage;
  const currentStocks = filteredStocks.slice(firstIndex, lastIndex);

  const handleTickerClick = (ticker: string) => {
    navigate(`/stocks/${ticker}`);
  };

  const handleAddStock = (symbol: string, name: string) => {
    setSelectedStock({ symbol, name });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStock(null);
  };

  if (loading) return (
    <>
      <DefaultNavbar/>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl p-8">
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    </>
  );
  
  if (error) return (
    <>
      <DefaultNavbar/>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl p-8">
          <p className="text-red-200 text-xl">{error}</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <DefaultNavbar/>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800">
        <div className="max-w-6xl mx-auto pt-10 p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl p-6">
            <div className="flex items-center relative">
              <h2 className="text-2xl font-bold text-white flex-grow text-center pb-4">
                {isPortfolioMode ? "Add Stocks to Portfolio" : "Stock List"}
              </h2>
              <div className="absolute right-0">
                <SearchBar onSearchChange={setSearchQuery} />
              </div>
            </div>

            {/* Portfolio Mode Banner */}
            {isPortfolioMode && (
              <div className="mb-6 p-4 bg-white/20 backdrop-blur-lg rounded-xl border border-white/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                    <span className="text-white font-semibold">Portfolio Mode Active</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-white/80">
                      Selected: {selectedStocks.length} stocks
                    </span>
                    <button 
                      onClick={() => navigate('/portfolio')}
                      className="px-4 py-2 bg-white/40 hover:bg-white/50 text-white rounded-lg transition-colors backdrop-blur-sm border border-white/30"
                    >
                      View Cart ({selectedStocks.length})
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <table className="min-w-full border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm">
                <thead className="bg-white/20 backdrop-blur-sm">
                  <tr>
                    <th className="px-4 py-2 border-b border-white/20 text-white font-semibold">Symbol</th>
                    <th className="px-4 py-2 border-b border-white/20 text-white font-semibold">Name</th>
                    <th className="px-4 py-2 border-b border-white/20 text-white font-semibold">Sector</th>
                    <th className="px-4 py-2 border-b border-white/20 text-white font-semibold">Industry</th>
                    <th className="px-4 py-2 border-b border-white/20 text-white font-semibold">Country</th>
                    <th className="px-4 py-2 border-b border-white/20 text-white font-semibold">Value (in Billions)</th>
                    {isPortfolioMode && (
                      <th className="px-4 py-2 border-b border-white/20 text-white font-semibold">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentStocks.map(([symbol, info]) => (
                    <tr
                      key={symbol}
                      className="hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={(e) => {
                        // Only navigate if not clicking on button
                        if (!(e.target as HTMLElement).closest('button')) {
                          handleTickerClick(symbol);
                        }
                      }}
                    >
                      <td className="px-4 py-2 border-b border-white/10 font-semibold">
                        <Link
                          to={`/stocks/${symbol}`}
                          className="text-white underline hover:text-white/80 cursor-pointer"
                        >
                          {symbol}
                        </Link>
                      </td>
                      <td className="px-4 py-2 border-b border-white/10 text-white/90">{info[0]}</td>
                      <td className="px-4 py-2 border-b border-white/10 text-white/90">{info[1]}</td>
                      <td className="px-4 py-2 border-b border-white/10 text-white/90">{info[2]}</td>
                      <td className="px-4 py-2 border-b border-white/10 text-white/90">{info[3]}</td>
                      <td className="px-4 py-2 border-b border-white/10 text-right text-white/90">
                        {typeof info[4] === "number" ? info[4].toFixed(2) : "N/A"}
                      </td>
                      {isPortfolioMode && (
                        <td className="px-4 py-2 border-b border-white/10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddStock(symbol, info[0]);
                            }}
                            className="px-3 py-1 bg-white/40 hover:bg-white/50 text-white rounded-lg transition-colors backdrop-blur-sm border border-white/30 text-sm font-medium"
                          >
                            Add Stock
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6 space-x-2">
              <button
                className="px-3 py-1 rounded bg-white/40 text-white disabled:bg-white/10 disabled:text-white/50 hover:bg-white/50 transition-colors backdrop-blur-sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              {Array.from({ length: Math.ceil(totalCompanies / postsPerPage) }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  className={`px-3 py-1 rounded backdrop-blur-sm transition-colors ${
                    num === currentPage 
                      ? "bg-white/50 text-white font-semibold" 
                      : "bg-white/20 text-white/80 hover:bg-white/30 hover:text-white"
                  }`}
                  onClick={() => setCurrentPage(num)}
                  disabled={num === currentPage}
                >
                  {num}
                </button>
              ))}

              <button
                className="px-3 py-1 rounded bg-white/40 text-white disabled:bg-white/10 disabled:text-white/50 hover:bg-white/50 transition-colors backdrop-blur-sm"
                onClick={() => setCurrentPage((p) => Math.min(Math.ceil(totalCompanies / postsPerPage), p + 1))}
                disabled={currentPage === Math.ceil(totalCompanies / postsPerPage)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Selection Modal */}
      <StockSelectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        stock={selectedStock}
      />
    </>
  );
};

export default Stocks;
