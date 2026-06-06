import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service – Use AI Tools',
  description: 'Terms and conditions for using Use AI Tools directory.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Terms of Service', href: '/terms', current: true }]} />
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Terms of Service</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">Last updated: June 2, 2026</p>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">By accessing and using Use AI Tools (useaitools.me), you agree to be bound by these Terms of Service. If you do not agree, please do not use our service.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Description of Service</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use AI Tools is a curated directory of AI tools. We provide information, comparisons, and reviews to help users discover and choose AI tools. We are not responsible for the functionality, pricing, or content of third-party tools listed on our site.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. User Conduct</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You agree not to misuse our service, including but not limited to: submitting false or misleading tool information, attempting to manipulate ratings or reviews, scraping our content without permission, or engaging in any activity that could damage or impair the service.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Intellectual Property</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">All content on Use AI Tools, including text, design, and code, is the property of Use AI Tools unless otherwise noted. You may not reproduce, distribute, or create derivative works without our written permission.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Disclaimer of Warranties</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Our service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of any tool listings, reviews, or comparisons. Use the information at your own risk.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">6. Limitation of Liability</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Use AI Tools shall not be liable for any indirect, incidental, or consequential damages arising from your use of our service. This includes, but is not limited to, damages for loss of profits, data, or goodwill.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">7. Changes to Terms</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">8. Contact</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">For questions about these terms, contact us at affiliate@useaitools.me.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
