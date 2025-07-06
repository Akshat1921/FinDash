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
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
        <h3 className="text-xl font-semibold mt-2 mb-2 text-blue-700 dark:text-blue-300">{title}</h3>
        <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded-lg">
            <tbody>
            {fields
                .filter((key) => sectionData[key] !== undefined)
                .map((key) => (
                <tr key={key}>
                    <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 font-semibold capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
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