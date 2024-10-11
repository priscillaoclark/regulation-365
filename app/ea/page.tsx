"use client";

import Link from "next/link";
import { useState } from "react";
import cfpb_client from "@/components/ea/cfpb";
import fincen from "@/components/ea/fincen";
import fdic from "@/components/ea/fdic";
import frb from "@/components/ea/frb";
import occ from "@/components/ea/occ";
import ofac from "@/components/ea/ofac";
import sec from "@/components/ea/sec";

const components: { [key: string]: React.ComponentType } = {
  CFPB: cfpb_client,
  FDIC: fdic,
  FINCEN: fincen,
  FRB: frb,
  OCC: occ,
  OFAC: ofac,
  SEC: sec,
};

export default function Home() {
  const [selectedComponent, setSelectedComponent] = useState<
    keyof typeof components | null
  >(null);
  const ComponentToRender = selectedComponent
    ? components[selectedComponent]
    : null;

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
        <h1 className="text-4xl font-bold mb-6">Recent Enforcement Actions</h1>
        <div className="flex justify-between mb-6">
          {Object.keys(components).map((folder) => (
            <button
              key={folder}
              onClick={() => setSelectedComponent(folder)}
              className="px-4 py-2 text-black bg-lime-400 rounded hover:bg-lime-600 mx-2"
            >
              {folder}
            </button>
          ))}
        </div>
        <hr className="w-full border-t-2 border-gray-300 mb-6" />
        <div className="w-full">
          {ComponentToRender ? (
            <ComponentToRender />
          ) : (
            <h2>
              Click on a button above to see recent enforcement actions for that
              agency. Summary statistics coming soon!
            </h2>
          )}
        </div>
      </div>
    </div>
  );
}
