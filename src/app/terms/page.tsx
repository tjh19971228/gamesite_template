import React from "react";
import { Metadata } from "next";
import { Layout } from "@/components/layout";
import { getSiteInfo } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using our gaming platform",
};

export default function TermsPage() {
  const siteInfo = getSiteInfo();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using {siteInfo.siteName}, you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p>
              {siteInfo.siteName} provides a platform for online gaming and gaming-related content. Our service includes:
            </p>
            <ul className="list-disc pl-6 mt-4">
              <li>Access to various online games</li>
              <li>Gaming news and blog content</li>
              <li>Community features and discussions</li>
              <li>Game recommendations and reviews</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Conduct</h2>
            <p>You agree not to use the service to:</p>
            <ul className="list-disc pl-6 mt-4">
              <li>Upload, post, or transmit any content that is illegal, harmful, or offensive</li>
              <li>Impersonate any person or entity or misrepresent your affiliation</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Attempt to gain unauthorized access to any portion of the service</li>
              <li>Use automated scripts or bots to access the service</li>
              <li>Violate any applicable local, state, national, or international law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
            <p>
              The service and its original content, features, and functionality are and will remain the exclusive 
              property of {siteInfo.siteName} and its licensors. The service is protected by copyright, trademark, 
              and other laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Third-Party Games and Content</h2>
            <p>
              Our platform may include games and content from third-party developers. We are not responsible for:
            </p>
            <ul className="list-disc pl-6 mt-4">
              <li>The content, quality, or availability of third-party games</li>
              <li>Third-party privacy practices or terms of service</li>
              <li>Any issues arising from third-party games or services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Disclaimer of Warranties</h2>
            <p>
              The information on this website is provided on an &quot;as is&quot; basis. To the fullest extent permitted by law, 
              this Company excludes all representations, warranties, conditions and terms whether express or implied.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p>
              In no event shall {siteInfo.siteName}, nor its directors, employees, partners, agents, suppliers, 
              or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, 
              including loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Age Requirements</h2>
            <p>
              Our service is intended for users aged 13 and above. Users under 13 should not use our service. 
              Users between 13-18 should have parental consent before using our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
            <p>
              We may terminate or suspend your access immediately, without prior notice or liability, for any reason 
              whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href="/contact" className="text-primary hover:underline">our contact page</a>.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
} 