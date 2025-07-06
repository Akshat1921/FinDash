// CompanyPageNavbar.tsx
import React from 'react';

type Props = {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
};

const CompanyPageNavbar: React.FC<Props> = ({ selectedTab, setSelectedTab }) => {
  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "balance-sheet", label: "Balance Sheet" },
    { key: "income-statement", label: "Income Statement" },
    { key: "cash-flow", label: "Cash Flow" }
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600 shadow">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/stocks" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white text-blue-700">
            FinDash
          </span>
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Sign In
          </button>
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {tabs.map((tab) => (
              <li key={tab.key}>
                <button
                  className={`block py-2 px-3 rounded md:bg-transparent md:p-0 ${
                    selectedTab === tab.key ? "text-blue-700 dark:text-blue-300 font-bold" : "text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => setSelectedTab(tab.key)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default CompanyPageNavbar;
