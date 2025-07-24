import React from "react";
import { incomeStatement } from "../../../models/companyOverview/companyOverviewConstants";

interface Props {
  data: Record<string, any>[];
}

const renderTable = (title: string, fields: string[], data: Record<string, any>[]) => (
  <div>
    <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
    {data.map((entry, idx) => (
      <div
        key={idx}
        className="mb-8 p-4 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg"
      >
        <h4 className="text-lg font-semibold mb-2 text-white/90">
          Year: {entry.year || `#${idx + 1}`}
        </h4>
        <table className="min-w-full border border-white/20 rounded-lg">
          <tbody>
            {fields.filter(key => entry[key] !== undefined).map(key => (
              <tr key={key}>
                <td className="px-4 py-2 border-b border-white/20 font-semibold capitalize text-white/90">
                  {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").replace(/\s+/g, " ").trim()}
                </td>
                <td className="px-4 py-2 border-b border-white/20 text-white/80">
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

export const IncomeStatement: React.FC<Props> = ({ data }) => renderTable("Income Statement", incomeStatement, data);