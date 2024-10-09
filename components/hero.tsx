import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Globe,
  Zap,
  ArrowRight,
  Brain,
  CircleDollarSign,
} from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-4">
    {icon}
    <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const ComplianceLanding: React.FC = () => {
  return (
    <div className="w-full">
      <section className="container mx-auto px-4 py-16 text-center border-b border-b-foreground/10">
        <h1 className="text-5xl font-bold mb-6">
          Navigate Financial Regulations with Confidence
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Stay compliant with complex regulations and simplify your regulatory
          change process.
        </p>
        <button className="bg-lime-400 text-primary-foreground px-6 py-3 rounded-full text-lg font-semibold hover:bg-lime-400/50 transition duration-300">
          Coming Soon
        </button>
      </section>

      <section id="features" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Regulation 365?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Feature
            icon={<ShieldCheck size={48} className="text-lime-400" />}
            title="Real-time Updates"
            description="Stay up-to-date with the latest US financial service regulations."
          />
          <Feature
            icon={<Brain size={48} className="text-lime-400" />}
            title="AI Summarization and Chat"
            description="Simplify complex legal jargon and ask questions in our custom chatbot."
          />
          <Feature
            icon={<Globe size={48} className="text-lime-400" />}
            title="Broad Coverage"
            description="Understand requirements across multiple products with our comprehensive database."
          />
          <Feature
            icon={<Globe size={48} className="text-lime-400" />}
            title="Personalization"
            description="Customized to fit into your existing workflows and taxonomies."
          />
          <Feature
            icon={<Zap size={48} className="text-lime-400" />}
            title="Proactive Alerts"
            description="Get proactive alerts about upcoming regulatory changes, so you’re always ahead."
          />
          <Feature
            icon={<CircleDollarSign size={48} className="text-lime-400" />}
            title="Reduce Compliance Costs"
            description="Reduce the number of irrelevant regulations you need to review."
          />
        </div>
      </section>

      <section id="agencies" className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Covered Agencies</h2>
          <p className="mb-4 text-muted-foreground">
            Regulation 365 aggregates regulatory data from a wide range of US
            financial services agencies to provide the most comprehensive
            coverage for your business. Some of the key agencies we cover
            include:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <li>Consumer Financial Protection Bureau (CFPB)</li>
            <li>Federal Deposit Insurance Corporation (FDIC)</li>
            <li>Federal Reserve System (FRS)</li>
            <li>Securities and Exchange Commission (SEC)</li>
            <li>Office of the Comptroller of the Currency (OCC)</li>
            <li>Financial Crimes Enforcement Network (FINCEN)</li>
            <li>Many more and growing...</li>
          </ul>
        </div>
      </section>

      {/*<section id="pricing" className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Simple, Transparent Pricing
          </h2>
          <div className="max-w-sm mx-auto bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <h3 className="text-2xl font-semibold text-center mb-4">
                Pro Plan
              </h3>
              <div className="text-center mb-6">
                <span className="text-4xl font-bold">$299</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mb-8">
                <li className="flex items-center mb-3">
                  <ArrowRight size={20} className="text-primary mr-2" />
                  <span>Full regulatory database access</span>
                </li>
                <li className="flex items-center mb-3">
                  <ArrowRight size={20} className="text-primary mr-2" />
                  <span>Automated compliance checks</span>
                </li>
                <li className="flex items-center mb-3">
                  <ArrowRight size={20} className="text-primary mr-2" />
                  <span>AI summarization and chat</span>
                </li>
              </ul>
              <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold hover:bg-primary/90 transition duration-300">
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </section>*/}

      <section
        id="contact"
        className="container mx-auto px-4 py-16 text-center bg-secondary"
      >
        <h2 className="text-3xl font-bold mb-8">
          Ready to Simplify Your Regulatory Change Process?
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Get in touch with our team of experts today and see how Regulation 365
          can help your financial service business stay compliant.
        </p>
        <button className="bg-lime-400 text-primary-foreground px-6 py-3 rounded-full text-lg font-semibold hover:bg-lime-400/50 transition duration-300">
          Coming Soon
        </button>
      </section>
    </div>
  );
};

export default ComplianceLanding;
