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

  useEffect(() => {
    axios
      .get(`http://localhost:8000/stocks/financials/ticker?ticker=${symbol}`)
      .then((res) => {
        const apiData = res.data as Record<string, any>;
        setData({
          companyOverview: apiData["company-overview"],
          balanceSheets: apiData["balance-sheet"],
          cashflow: apiData["cashflow"],
          incomeStatements: apiData["income-statement"],
        });
      })
      .catch(() => setData(null));
  }, [symbol]);
  
  if (data === null) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800 flex items-center justify-center">
      <div className="bg-red-500/20 backdrop-blur-lg rounded-xl p-8 border border-red-400/30 text-center max-w-md mx-auto">
        <p className="text-red-300 text-xl">Failed to load data.</p>
      </div>
    </div>
  );
  if (!data) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-800 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading...</p>
      </div>
    </div>
  );

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
