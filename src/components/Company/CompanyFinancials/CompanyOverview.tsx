import React from "react";
import {
  companyInfoFields,
  quoteInfoFields,
  valuationMetricsFields,
  dividendInfoFields,
  marketStatsFields,
  governanceFields,
  financialsFields,
  analystRatingsFields,
  metaFields
} from "../../../models/companyOverview/companyOverviewConstants"

interface CompanyOverviewProps {
  data: Record<string, any>;
}

export const CompanyOverviewSection: React.FC<CompanyOverviewProps> = ({ data }) => {
    const companyInfo = data.companyOverview || {};
    const quoteInfo = data.companyOverview || {};
    const valuationMetrics = data.companyOverview || {};
    const dividendInfo = data.companyOverview || {};
    const marketStats = data.companyOverview || {};
    const governance = data.companyOverview || {};
    const financials = data.companyOverview || {};
    const analystRatings = data.companyOverview || {};
    const meta = data.companyOverview || {};

    const address = [companyInfo.address1, companyInfo.city, companyInfo.state, companyInfo.zip, companyInfo.country]
        .filter(Boolean)
        .join(", ");
    const companyInfoDisplay = { ...companyInfo, address };

    const renderTable = (title: string, fields: string[], sectionData: Record<string, any>) => (
        <div className="mb-8 p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg">
        <h3 className="text-xl font-semibold mt-2 mb-2 text-white">{title}</h3>
        <table className="min-w-full border border-white/20 rounded-lg">
            <tbody>
            {fields
                .filter((key) => sectionData[key] !== undefined)
                .map((key) => (
                <tr key={key}>
                    <td className="px-4 py-2 border-b border-white/20 font-semibold capitalize text-white/90">
                    {key.replace(/([A-Z])/g, " $1")}
                    </td>
                    <td className="px-4 py-2 border-b border-white/20 text-white/80">
                    {String(sectionData[key])}
                    </td>
                </tr>
                ))}
            </tbody>
        </table>
        </div>
    );

    return (
        <>
        {renderTable("Company Info", companyInfoFields, companyInfoDisplay)}
        {renderTable("Quote Info", quoteInfoFields, quoteInfo)}
        {renderTable("Valuation Metrics", valuationMetricsFields, valuationMetrics)}
        {renderTable("Dividend Info", dividendInfoFields, dividendInfo)}
        {renderTable("Market Stats", marketStatsFields, marketStats)}
        {renderTable("Governance Info", governanceFields, governance)}
        {renderTable("Financial Info", financialsFields, financials)}
        {renderTable("Analyst Ratings", analystRatingsFields, analystRatings)}
        {renderTable("Meta Info", metaFields, meta)}
        </>
    );
};