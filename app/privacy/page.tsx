import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy – Use AI Tools',
  description: 'Learn how Use AI Tools handles your data and protects your privacy.',
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Privacy Policy – Use AI Tools',
    description: 'Learn how Use AI Tools handles your data and protects your privacy.',
    url: 'https://useaitools.me/privacy',
    siteName: 'Use AI Tools',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy – Use AI Tools',
    description: 'Learn how Use AI Tools handles your data and protects your privacy.',
  },
  alternates: {
    canonical: 'https://useaitools.me/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy', href: '/privacy', current: true }]} />
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>Privacy Policy</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-10">Last updated: June 2, 2026</p>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Information We Collect</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">We collect minimal data to provide our service. Your saved tools, browsing history, and preferences are stored locally in your browser (localStorage) and never sent to our servers. We use privacy-friendly analytics (Vercel Analytics) that do not use cookies or track personal information.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. How We Use Your Data</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your data is used solely to improve your experience on our site — saving your favorite tools, remembering your preferences, and providing personalized recommendations. We do not sell, share, or transfer your personal data to third parties.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Cookies</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">We use minimal cookies for essential site functionality (such as theme preference and language selection). Our analytics are cookie-free. You can clear your local data at any time through your browser settings.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Affiliate Links</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Some links on our site are affiliate links. When you click these links and make a purchase, we may earn a commission at no extra cost to you. This does not affect our editorial independence. See our <a href="/affiliate-disclosure" className="text-emerald-600 dark:text-emerald-400 hover:underline">Affiliate Disclosure</a> for details.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">5. Third-Party Services</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">We use Vercel for hosting and analytics, which may collect anonymized usage data. We do not use Google Analytics, Facebook Pixel, or any invasive tracking tools.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">6. Your Rights</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">You have the right to access, correct, or delete your data at any time. Since we store data locally in your browser, you can clear it through browser settings. For any questions, contact us at affiliate@useaitools.me.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">7. GDPR Compliance (EU/EEA Users)</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">If you are located in the European Economic Area (EEA), you have the following rights under the General Data Protection Regulation (GDPR):</p>
            <ul className="list-disc pl-5 space-y-2 mt-3 text-slate-600 dark:text-slate-400">
              <li><strong>Right of Access</strong> — You can request a copy of your personal data we hold.</li>
              <li><strong>Right to Rectification</strong> — You can ask us to correct inaccurate or incomplete data.</li>
              <li><strong>Right to Erasure</strong> — You can request deletion of your personal data ("right to be forgotten").</li>
              <li><strong>Right to Restriction</strong> — You can ask us to limit how we process your data.</li>
              <li><strong>Right to Data Portability</strong> — You can request your data in a machine-readable format.</li>
              <li><strong>Right to Object</strong> — You can object to processing based on legitimate interests.</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-3">Our legal basis for processing is <strong>legitimate interest</strong> (Article 6(1)(f)) — providing and improving our service. We store all user preferences locally in your browser, not on our servers. To exercise any of these rights, email us at <strong>affiliate@useaitools.me</strong>. We will respond within 30 days.</p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-3">You also have the right to lodge a complaint with your local data protection supervisory authority.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">8. International Data Transfers</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Our website is hosted through Vercel, which may process data on servers located globally including the United States. Vercel is certified under the EU-U.S. Data Privacy Framework, ensuring adequate protection for personal data transferred from the EEA. Your localStorage data never leaves your browser.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">9. Data Retention</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">We do not store personal data on our servers. All preferences (saved tools, theme, language) are stored in your browser's localStorage and remain there until you clear your browser data. You can delete this data at any time through your browser settings.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">10. Children's Privacy</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Our service is not directed to children under 13 (or 16 in the EEA). We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us and we will delete it.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">11. Changes to This Policy</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. For material changes, we will display a notice on our homepage.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
