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
  
  if (data === null) return <p className="text-red-500 text-center mt-20">Failed to load data.</p>;
  if (!data) return <p className="text-center mt-20">Loading...</p>;

  return (
    <>
      <CompanyPageNavbar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <div className="pt-24 px-4 max-w-6xl mx-auto">
        {selectedTab === "overview" && <CompanyOverviewSection data={data} />}
        {selectedTab === "balance-sheet" && <BalanceSheet data={data.balanceSheets} />}
        {selectedTab === "income-statement" && <IncomeStatement data={data.incomeStatements} />}
        {selectedTab === "cash-flow" && <Cashflow data={data.cashflow} />}
      </div>
    </>
  );
};

export default CompanyPage;
