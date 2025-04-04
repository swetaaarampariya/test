"use client";

import { useState } from "react";

interface Tab {
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: number;
}

const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab = 0 }) => {
  const [activeTab, setActiveTab] = useState<number>(defaultTab);

  return (
    <div >
      {/* Tabs Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-gray-100 p-2 rounded-lg">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-6 py-2 text-base font-medium  transition-all
              ${
                index === activeTab
                  ? "bg-teal-700 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-200"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4 p-4 ">
        {tabs[activeTab].content}
      </div>
    </div>


    // <div className="w-full max-w-4xl mx-auto">
    //   {/* Tabs Navigation */}
    //   <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-gray-100 p-2 rounded-lg">
    //     {tabs.map((tab, index) => (
    //       <button
    //         key={index}
    //         onClick={() => setActiveTab(index)}
    //         className={`px-4 py-2 text-sm sm:text-base font-medium transition-all rounded-lg text-center 
    //           ${
    //             index === activeTab
    //               ? "bg-teal-700 text-white shadow-md"
    //               : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-200"
    //           }`}
    //       >
    //         {tab.label}
    //       </button>
    //     ))}
    //   </div>

    //   {/* Tab Content */}
    //   <div className="mt-4 p-4 bg-white shadow-md rounded-lg">
    //     {tabs[activeTab].content}
    //   </div>
    // </div>
  );
};

export default Tabs;
