"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Carousel from "./carousel";
import { fetchLastFivePosts, Post } from "../lib/posts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShieldCheck,
  Globe,
  Zap,
  ArrowRight,
  Brain,
  CircleDollarSign,
  Loader2,
} from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="relative"
  >
    <Card className="h-full">
      <CardContent className="flex flex-col items-center text-center p-6 space-y-4">
        <div className="text-lime-500">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

const AGENCIES = [
  "Consumer Financial Protection Bureau",
  "Federal Deposit Insurance Corporation",
  "Federal Reserve Board",
  "Securities and Exchange Commission",
  "Office of the Comptroller of the Currency",
  "Financial Crimes Enforcement Network",
  "National Credit Union Administration",
  "Financial Industry Regulatory Authority",
  "Commodity Futures Trading Commission",
] as const;

const ComplianceLanding: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchLastFivePosts();
        setPosts(data);
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center">
        <Image
          src="/images/bg3.jpg"
          alt="Hero background"
          fill
          priority
          className="object-cover"
          quality={90}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 container mx-auto px-4 py-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Navigate Financial Regulations with Confidence
            </h1>
            <p className="text-xl md:text-2xl text-gray-200">
              Stay compliant with complex regulations and simplify your
              regulatory change process.
            </p>
            <div className="space-y-4">
              <Button
                asChild
                size="lg"
                className="bg-lime-500 hover:bg-lime-400 text-white"
              >
                <Link href="/news">Recent News</Link>
              </Button>
              <div className="text-2xl font-semibold text-white">
                Webapp coming soon!
              </div>
              <div>
                <Link
                  href="/ea"
                  className="text-lime-400 hover:text-lime-300 underline-offset-4 hover:underline"
                >
                  See a sample of recent enforcement action data
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center">
            Why Choose Regulation 365?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature
              icon={<ShieldCheck size={48} />}
              title="Real-time Updates"
              description="Stay up-to-date with the latest US financial service regulations."
            />
            <Feature
              icon={<Brain size={48} />}
              title="AI Summarization and Chat"
              description="Simplify complex legal jargon and ask questions in our custom chatbot."
            />
            <Feature
              icon={<Globe size={48} />}
              title="Broad Coverage"
              description="Understand requirements across multiple products with our comprehensive database."
            />
            <Feature
              icon={<ArrowRight size={48} />}
              title="Personalization"
              description="Customized to fit into your existing workflows and taxonomies."
            />
            <Feature
              icon={<Zap size={48} />}
              title="Proactive Alerts"
              description="Get proactive alerts about upcoming regulatory changes, so you're always ahead."
            />
            <Feature
              icon={<CircleDollarSign size={48} />}
              title="Reduce Compliance Costs"
              description="Reduce the number of irrelevant regulations you need to review."
            />
          </div>
        </motion.div>
      </section>

      <section id="features" className="container mx-auto px-4 py-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Screenshots</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Image
            src="/images/screenshots/2.png"
            alt="Screenshot 2"
            layout="responsive"
            width={1920}
            height={1080}
          />
          <Image
            src="/images/screenshots/3.png"
            alt="Screenshot 3"
            layout="responsive"
            width={1920}
            height={1080}
          />
        </div>
      </section>

      {/* Posts Carousel Section */}
      <section id="posts" className="container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold">Recent Blog Posts</h2>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-lime-500" />
            </div>
          ) : posts.length > 0 ? (
            <Carousel posts={posts} />
          ) : (
            <p className="text-muted-foreground text-center">No posts found.</p>
          )}
        </motion.div>
      </section>

      {/* Covered Agencies Section */}
      <section id="agencies" className="container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold">Covered Agencies</h2>
          <p className="text-lg text-muted-foreground">
            Regulation 365 aggregates regulatory data from a wide range of US
            financial services agencies to provide the most comprehensive
            coverage for your business.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AGENCIES.map((agency, index) => (
              <motion.div
                key={agency}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-2"
              >
                <ArrowRight className="w-4 h-4 text-lime-500 flex-shrink-0" />
                <span>{agency}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative w-full">
        <Image
          src="/images/sky.jpg"
          alt="Contact background"
          width={1920}
          height={1080}
          className="object-cover w-full h-[400px]"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 text-center space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Simplify Your Regulatory Change Process?
            </h2>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Get in touch with our team of experts today and see how Regulation
              365 can help your financial service business stay compliant.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-lime-500 hover:bg-lime-400 text-white"
            >
              <Link href="https://regulation-365.ghost.io/#/portal/signup">
                Subscribe for News and Product Updates
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ComplianceLanding;
