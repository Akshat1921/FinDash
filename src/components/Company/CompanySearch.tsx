import React, { useEffect, useState } from "react";
import axios from "axios";
import type { StockInfo, StocksResponse } from "../../models/companyOverview/Ticker";
import { useNavigate, Link } from "react-router-dom";
import { SearchBar } from "../SearchBar/SearchBar";
import { DefaultNavbar } from "../Navbar/DefaultNavbar";


const Stocks: React.FC = () => {
  const [stocks, setStocks] = useState<[string, StockInfo][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <DefaultNavbar/>
      <div className="max-w-6xl mx-auto mt-10 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="flex items-center relative">
        <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 flex-grow text-center pb-4">
          Stock List
        </h2>
        <div className="absolute right-0">
          <SearchBar onSearchChange={setSearchQuery} />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded-lg">
          <thead className="bg-blue-100 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">Symbol</th>
              <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">Name</th>
              <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">Sector</th>
              <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">Industry</th>
              <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">Country</th>
              <th className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">Value (in Billions)</th>
            </tr>
          </thead>
          <tbody>
            {currentStocks.map(([symbol, info]) => (
              <tr
                key={symbol}
                className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                onClick={() => handleTickerClick(symbol)}
              >
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 font-semibold">
                  <Link
                    to={`/stocks/${symbol}`}
                    className="text-blue-700 dark:text-blue-300 underline hover:text-blue-900 dark:hover:text-blue-500 cursor-pointer"
                  >
                    {symbol}
                  </Link>
                </td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">{info[0]}</td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">{info[1]}</td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">{info[2]}</td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">{info[3]}</td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-right">
                  {typeof info[4] === "number" ? info[4].toFixed(2) : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {Array.from({ length: Math.ceil(totalCompanies / postsPerPage) }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`px-3 py-1 rounded ${
              num === currentPage ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-700"
            } hover:bg-blue-400 hover:text-white transition-colors`}
            onClick={() => setCurrentPage(num)}
            disabled={num === currentPage}
          >
            {num}
          </button>
        ))}

        <button
          className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300"
          onClick={() => setCurrentPage((p) => Math.min(Math.ceil(totalCompanies / postsPerPage), p + 1))}
          disabled={currentPage === Math.ceil(totalCompanies / postsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
    </>
    
  );
};

export default Stocks;
