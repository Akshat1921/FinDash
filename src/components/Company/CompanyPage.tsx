import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CompanyPageNavbar from "../Navbar/CompanyPageNavbar";
import { CompanyOverviewSection } from "./CompanyFinancials/CompanyOverview";
import { BalanceSheet } from "./CompanyFinancials/BalanceSheet";
import { IncomeStatement } from "./CompanyFinancials/IncomeStatement";
import { Cashflow } from "./CompanyFinancials/Cashflow";
import type { ComapanyFinancials } from "../../models/companyOverview/CompanyOverview";

export const CompanyPage: React.FC = () => {
  const { symbol } = useParams();
  const [data, setData] = useState<ComapanyFinancials | null>(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancials = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8081/stocks/get_all_financials/${symbol}`);
        const apiData = res.data as Record<string, any>;
        setData({
          companyOverview: apiData["company-overview"],
          balanceSheets: apiData["balance-sheet"],
          cashflow: apiData["cashflow"],
          incomeStatements: apiData["income-statement"],
        });
      } catch (err) {
        const error = err as any;
        
        if (error.response?.status === 404) {
          try {
            const fallbackRes = await axios.post(`http://localhost:8081/stocks/add_financials/${symbol}`);
            console.log("✅ Fallback API call successful:", fallbackRes.status);
            const apiData = fallbackRes.data as Record<string, any>;
            setData({
              companyOverview: apiData["company-overview"],
              balanceSheets: apiData["balance-sheet"],
              cashflow: apiData["cashflow"],
              incomeStatements: apiData["income-statement"],
            });
          } catch (fallbackErr) {
            setData(null);
          }
        } else {
          setData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFinancials();
  }, [symbol]);

  if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
        <div className="relative mx-auto mb-4 w-16 h-16">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-white absolute top-0 left-0"></div>
        </div>
        <p className="text-white text-lg font-medium">Loading financial data...</p>
        <p className="text-white/70 text-sm mt-2">Please wait while we fetch the information</p>
      </div>
    </div>
  );
}

  if (data === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800 flex items-center justify-center">
        <div className="bg-red-500/20 backdrop-blur-lg rounded-xl p-8 border border-red-400/30 text-center max-w-md mx-auto">
          <div className="text-red-300 text-6xl mb-4">⚠️</div>
          <p className="text-red-300 text-xl font-semibold mb-2">Failed to load data</p>
          <p className="text-red-200/80 text-sm">Unable to fetch financial information for {symbol}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800">
      <CompanyPageNavbar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="pt-24 px-4 max-w-6xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 shadow-2xl">
          {selectedTab === "overview" && <CompanyOverviewSection data={data} />}
          {selectedTab === "balance-sheet" && <BalanceSheet data={data.balanceSheets} />}
          {selectedTab === "income-statement" && <IncomeStatement data={data.incomeStatements} />}
          {selectedTab === "cash-flow" && <Cashflow data={data.cashflow} />}
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
