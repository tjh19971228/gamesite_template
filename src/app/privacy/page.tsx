import React from "react";
import { Metadata } from "next";
import { Layout } from "@/components/layout";
import { getSiteInfo } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Our privacy policy and how we handle your personal information",
};

export default function PrivacyPage() {
  const siteInfo = getSiteInfo();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p>
              Welcome to {siteInfo.siteName}. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our website 
              and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <h3 className="text-xl font-medium mb-3">Personal Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Email address (when you contact us)</li>
              <li>Name (when provided voluntarily)</li>
              <li>Any other information you choose to provide</li>
            </ul>
            
            <h3 className="text-xl font-medium mb-3">Technical Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Pages visited and time spent on our site</li>
              <li>Referring website addresses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-4">
              <li>Provide and maintain our gaming platform</li>
              <li>Improve user experience and website functionality</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Analyze website usage and performance</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your browsing experience. 
              You can control cookie settings through your browser preferences. For more detailed information, 
              please see our <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic 
              storage is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p>
              Our website may contain links to third-party websites or services. We are not responsible for the privacy 
              practices or content of these external sites. We encourage you to review their privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 mt-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate personal data</li>
              <li>Delete your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new 
              privacy policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at{" "}
              <a href="/contact" className="text-primary hover:underline">our contact page</a>.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
} 