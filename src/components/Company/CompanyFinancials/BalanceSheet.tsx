import React from "react";
import { balanceSheet } from "../../../models/companyOverview/companyOverviewConstants";

interface Props {
  data: Record<string, any>[];
}

const renderTable = (title: string, fields: string[], data: Record<string, any>[]) => (
  <div>
    <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-4">{title}</h3>
    {data.map((entry, idx) => (
      <div
        key={idx}
        className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow"
      >
        <h4 className="text-lg font-semibold mb-2 text-blue-500">
          Year: {entry.year || `#${idx + 1}`}
        </h4>
        <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded-lg">
          <tbody>
            {fields.filter(key => entry[key] !== undefined).map(key => (
              <tr key={key}>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 font-semibold capitalize">
                  {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").replace(/\s+/g, " ").trim()}
                </td>
                <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  {entry[key] === undefined || entry[key] === "nan" ? "N/A" : entry[key]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}
  </div>
);

export const BalanceSheet: React.FC<Props> = ({ data }) => renderTable("Balance Sheet", balanceSheet, data);

