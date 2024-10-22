"use client";

import { useState } from "react";
import cfpb_client from "@/components/ea/cfpb";
import frb_client from "@/components/ea/frb";
import fdic_client from "@/components/ea/fdic";
import occ_client from "@/components/ea/occ";
import fincen_client from "@/components/ea/fincen";
import ofac_client from "@/components/ea/ofac";
import sec_client from "@/components/ea/sec";
import SummaryClient from "@/components/ea/summary";

const DefaultComponent = () => (
  <div>
    {/* Render the summary_client component */}
    <SummaryClient />
  </div>
);

const components: { [key: string]: React.ComponentType } = {
  CFPB: cfpb_client,
  FDIC: fdic_client,
  FRB: frb_client,
  OCC: occ_client,
};

export default function Home() {
  const [selectedComponent, setSelectedComponent] = useState<
    keyof typeof components | null
  >(null);

  // Use DefaultComponent when no agency is selected
  const ComponentToRender = selectedComponent
    ? components[selectedComponent]
    : DefaultComponent;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedComponent(e.target.value as keyof typeof components);
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-6 p-4 md:gap-12 md:p-8 max-w-full mx-auto">
      <div className="w-full">
        <h1 className="text-4xl font-bold mb-6">Recent Enforcement Actions</h1>

        <div className="flex flex-col md:flex-row md:justify-between">
          {/* Dropdown Menu: Compact and Centered */}
          <div className="w-full md:w-1/2 mb-4 md:mb-6">
            <select
              onChange={handleSelectChange}
              className="w-full px-4 py-3 text-sm md:text-base text-black bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-500"
              defaultValue=""
            >
              <option value="" disabled>
                Select an agency
              </option>
              {Object.keys(components).map((folder) => (
                <option key={folder} value={folder}>
                  {folder}
                </option>
              ))}
            </select>
          </div>
        </div>

        <hr className="w-full border-t-2 border-gray-300 mb-4 md:mb-6 lg:my-8" />

        {/* Content Section: Full Width */}
        <div className="w-full mx-auto mt-6">
          <ComponentToRender />
        </div>
      </div>
    </div>
  );
}
