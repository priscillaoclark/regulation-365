"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Carousel from "./carousel";
import { fetchLastFivePosts, Post } from "../lib/posts";

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
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchLastFivePosts().then((data) => {
      setPosts(data);
    });
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section
        className="w-full px-4 pt-16 bg-cover bg-center"
        style={{ backgroundImage: 'url("images/bg3.jpg")' }}
      >
        <div className="w-full px-4 py-16 text-center">
          <div className="bg-black bg-opacity-50 px-4 py-16 rounded-lg">
            <h1 className="text-5xl font-bold mb-6 text-white">
              Navigate Financial Regulations with Confidence
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Stay compliant with complex regulations and simplify your
              regulatory change process.
            </p>
            <button className="bg-lime-500 hover:bg-lime-400 text-primary-foreground px-6 py-3 rounded-full text-lg font-semibold transition duration-300">
              <Link href="/news">Recent News</Link>
            </button>
            <div className="mt-16 text-2xl font-semibold text-white">
              Webapp coming soon!
            </div>
            <Link
              href="/ea"
              className="mt-16 text-xl text-lime-500 hover:underline"
            >
              See a sample of recent enforcement action data.
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-10">
          Why Choose Regulation 365?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Feature
            icon={<ShieldCheck size={48} className="text-lime-500" />}
            title="Real-time Updates"
            description="Stay up-to-date with the latest US financial service regulations."
          />
          <Feature
            icon={<Brain size={48} className="text-lime-500" />}
            title="AI Summarization and Chat"
            description="Simplify complex legal jargon and ask questions in our custom chatbot."
          />
          <Feature
            icon={<Globe size={48} className="text-lime-500" />}
            title="Broad Coverage"
            description="Understand requirements across multiple products with our comprehensive database."
          />
          <Feature
            icon={<ArrowRight size={48} className="text-lime-500" />}
            title="Personalization"
            description="Customized to fit into your existing workflows and taxonomies."
          />
          <Feature
            icon={<Zap size={48} className="text-lime-500" />}
            title="Proactive Alerts"
            description="Get proactive alerts about upcoming regulatory changes, so you’re always ahead."
          />
          <Feature
            icon={<CircleDollarSign size={48} className="text-lime-500" />}
            title="Reduce Compliance Costs"
            description="Reduce the number of irrelevant regulations you need to review."
          />
        </div>
      </section>

      {/* Posts Carousel Section */}
      <section id="posts" className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-semibold mb-4">Recent Blog Posts</h2>
        {posts.length > 0 ? (
          <Carousel posts={posts} />
        ) : (
          <div>Loading posts...</div>
        )}
      </section>

      {/* Covered Agencies Section */}
      <section id="agencies" className="container mx-auto px-4 py-12 mb-6">
        <div className="mb-1">
          <h2 className="text-3xl font-semibold mb-4">Covered Agencies</h2>
          <p className="mb-4">
            Regulation 365 aggregates regulatory data from a wide range of US
            financial services agencies to provide the most comprehensive
            coverage for your business. Some of the key agencies we cover
            include:
          </p>
          <ul className="list-disc pl-6 grid grid-cols-1 md:grid-cols-3 gap-x-8">
            <li>Consumer Financial Protection Bureau</li>
            <li>Federal Deposit Insurance Corporation</li>
            <li>Federal Reserve Board</li>
            <li>Securities and Exchange Commission</li>
            <li>Office of the Comptroller of the Currency</li>
            <li>Financial Crimes Enforcement Network</li>
            <li>Many more and growing...</li>
          </ul>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="container mx-auto px-6 py-6 text-center bg-cover bg-center rounded-lg"
        style={{ backgroundImage: 'url("images/sky.jpg")' }}
      >
        <div className="bg-black bg-opacity-50 py-8 px-4 rounded-lg">
          <h2 className="text-3xl font-bold mb-8 text-white">
            Ready to Simplify Your Regulatory Change Process?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Get in touch with our team of experts today and see how Regulation
            365 can help your financial service business stay compliant.
          </p>
          <button className="text-black bg-lime-400 hover:bg-lime-500 px-6 py-3 rounded-full text-lg font-semibold transition duration-300">
            <Link href="https://regulation-365.ghost.io/#/portal/signup">
              Subscribe for News and Product Updates
            </Link>
          </button>
        </div>
      </section>
    </div>
  );
};

export default ComplianceLanding;
