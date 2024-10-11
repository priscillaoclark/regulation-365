"use client";

import { useState } from "react";
import cfpb_client from "@/components/ea/cfpb";
import frb_client from "@/components/ea/frb";
import fincen_client from "@/components/ea/fincen";
import fdic_client from "@/components/ea/fdic";
import occ_client from "@/components/ea/occ";
import ofac_client from "@/components/ea/ofac";
import sec_client from "@/components/ea/sec";

const components: { [key: string]: React.ComponentType } = {
  CFPB: cfpb_client,
  FRB: frb_client,
};

export default function Home() {
  const [selectedComponent, setSelectedComponent] = useState<
    keyof typeof components | null
  >(null);
  const ComponentToRender = selectedComponent
    ? components[selectedComponent]
    : null;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedComponent(e.target.value as keyof typeof components);
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-6 p-4 md:gap-12 md:p-8 lg:max-w-screen-lg mx-auto">
      <div className="w-full">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
          Recent Enforcement Actions
        </h1>

        {/* Dropdown Menu: Compact and Centered */}
        <div className="w-64 ml-0 mb-4 md:mb-6">
          <select
            onChange={handleSelectChange}
            className="w-full px-4 py-3 text-sm md:text-base text-black bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-500"
          >
            <option value="" disabled selected>
              Select an agency
            </option>
            {Object.keys(components).map((folder) => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </div>

        <hr className="w-full border-t-2 border-gray-300 mb-4 md:mb-6 lg:my-8" />

        {/* Content Section: Full Width */}
        <div className="w-full mx-auto mt-6">
          {ComponentToRender ? (
            <ComponentToRender />
          ) : (
            <h2 className="text-sm md:text-base lg:text-lg">
              Select an agency from the dropdown menu to see recent enforcement
              actions. Summary statistics and additional agencies coming soon.
            </h2>
          )}
        </div>
      </div>
    </div>
  );
}
