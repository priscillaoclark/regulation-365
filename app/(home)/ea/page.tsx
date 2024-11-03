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

// Define the agency metadata
interface AgencyMeta {
  name: string;
  fullName: string;
  description: string;
}

const agencyMetadata: { [key: string]: AgencyMeta } = {
  CFPB: {
    name: "CFPB",
    fullName: "Consumer Financial Protection Bureau",
    description:
      "Federal agency responsible for consumer protection in the financial sector",
  },
  FDIC: {
    name: "FDIC",
    fullName: "Federal Deposit Insurance Corporation",
    description:
      "Provides deposit insurance and supervises financial institutions",
  },
  FRB: {
    name: "FRB",
    fullName: "Federal Reserve Board",
    description:
      "Central bank of the United States and banking system supervisor",
  },
  OCC: {
    name: "OCC",
    fullName: "Office of the Comptroller of the Currency",
    description:
      "Primary regulator of national banks and federal savings associations",
  },
  FINCEN: {
    name: "FINCEN",
    fullName: "Financial Crimes Enforcement Network",
    description: "Combats money laundering and promotes financial security",
  },
  OFAC: {
    name: "OFAC",
    fullName: "Office of Foreign Assets Control",
    description: "Administers and enforces economic sanctions",
  },
  SEC: {
    name: "SEC",
    fullName: "Securities and Exchange Commission",
    description: "Regulates securities markets and protects investors",
  },
};

const components: { [key: string]: React.ComponentType } = {
  CFPB: cfpb_client,
  FDIC: fdic_client,
  FRB: frb_client,
  OCC: occ_client,
  FINCEN: fincen_client,
  OFAC: ofac_client,
  SEC: sec_client,
};

const AgencyInfo = ({ agency }: { agency: AgencyMeta }) => (
  <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow mb-6">
    <h2 className="text-2xl font-bold mb-2">{agency.fullName}</h2>
    <p className="text-gray-600 dark:text-gray-300">{agency.description}</p>
  </div>
);

const AgencySelector = ({
  selectedAgency,
  onAgencyChange,
}: {
  selectedAgency: string | null;
  onAgencyChange: (agency: string) => void;
}) => (
  <div className="w-full md:w-1/2 mb-4 md:mb-6">
    <select
      onChange={(e) => onAgencyChange(e.target.value)}
      value={selectedAgency || ""}
      className="w-full px-4 py-3 text-sm md:text-base text-black bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-lime-500"
    >
      <option value="" disabled>
        Select an agency
      </option>
      {Object.keys(components).map((agency) => (
        <option key={agency} value={agency}>
          {agencyMetadata[agency].fullName} ({agency})
        </option>
      ))}
    </select>
  </div>
);

export default function Home() {
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);

  // Use DefaultComponent when no agency is selected
  const ComponentToRender = selectedAgency
    ? components[selectedAgency]
    : SummaryClient;

  const handleAgencyChange = (agency: string) => {
    setSelectedAgency(agency);
  };

  return (
    <main className="flex-1 w-full flex flex-col gap-6 p-4 mt-16 md:gap-12 md:p-8 max-w-7xl mx-auto">
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-4xl font-bold mb-6 md:mb-0">
            Recent Enforcement Actions
          </h1>

          <AgencySelector
            selectedAgency={selectedAgency}
            onAgencyChange={handleAgencyChange}
          />
        </div>

        {/* Show agency info when an agency is selected */}
        {selectedAgency && (
          <AgencyInfo agency={agencyMetadata[selectedAgency]} />
        )}

        <hr className="w-full border-t-2 border-gray-300 mb-8" />

        {/* Main content area */}
        <div className="w-full">
          <ComponentToRender />
        </div>

        {/* Footer area for additional information */}
        <footer className="mt-12 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Data is updated daily. For the most current information, please
            visit the respective agency websites.
          </p>
        </footer>
      </div>
    </main>
  );
}
