import React from "react";
import { Metadata } from "next";
import { Layout } from "@/components/layout";
import { getSiteInfo } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Information about how we use cookies and similar technologies",
};

export default function CookiesPage() {
  const siteInfo = getSiteInfo();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
            <p>
              Cookies are small text files that are stored on your device when you visit our website. They help us 
              provide you with a better experience by remembering your preferences and understanding how you use our site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
            <p>{siteInfo.siteName} uses cookies for the following purposes:</p>
            <ul className="list-disc pl-6 mt-4">
              <li>Essential website functionality</li>
              <li>Remembering your preferences and settings</li>
              <li>Analyzing website performance and usage</li>
              <li>Improving user experience</li>
              <li>Security and fraud prevention</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-medium mb-3">Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly. They enable basic functions like page 
              navigation and access to secure areas of the website. The website cannot function properly without these cookies.
            </p>
            
            <h3 className="text-xl font-medium mb-3 mt-6">Analytics Cookies</h3>
            <p>
              These cookies help us understand how visitors interact with our website by collecting and reporting 
              information anonymously. We use this data to improve our website&apos;s performance and user experience.
            </p>
            
            <h3 className="text-xl font-medium mb-3 mt-6">Functional Cookies</h3>
            <p>
              These cookies enable the website to provide enhanced functionality and personalization. They may be set 
              by us or by third-party providers whose services we have added to our pages.
            </p>
            
            <h3 className="text-xl font-medium mb-3 mt-6">Preference Cookies</h3>
            <p>
              These cookies remember your choices and preferences, such as language settings, theme preferences, 
              and other customization options.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
            <p>
              Some cookies on our site are set by third-party services. These may include:
            </p>
            <ul className="list-disc pl-6 mt-4">
              <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
              <li><strong>Game Providers:</strong> For embedded games and related functionality</li>
              <li><strong>Content Delivery Networks:</strong> For faster content loading</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Managing Your Cookie Preferences</h2>
            <p>You have several options for managing cookies:</p>
            
            <h3 className="text-xl font-medium mb-3 mt-6">Browser Settings</h3>
            <p>
              Most web browsers allow you to control cookies through their settings preferences. You can set your 
              browser to refuse cookies or delete certain cookies. However, please note that if you delete or refuse 
              cookies, some features of our website may not function properly.
            </p>
            
            <h3 className="text-xl font-medium mb-3 mt-6">Opt-Out Links</h3>
            <p>For specific third-party services, you can opt out directly:</p>
            <ul className="list-disc pl-6 mt-4">
              <li>
                <strong>Google Analytics:</strong>{" "}
                <a 
                  href="https://tools.google.com/dlpage/gaoptout" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cookie Duration</h2>
            <p>Cookies may be either &quot;session&quot; cookies or &quot;persistent&quot; cookies:</p>
            <ul className="list-disc pl-6 mt-4">
              <li><strong>Session Cookies:</strong> These are temporary and are deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> These remain on your device for a set period or until you delete them</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other 
              operational, legal, or regulatory reasons. We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us at{" "}
              <a href="/contact" className="text-primary hover:underline">our contact page</a>.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
} 