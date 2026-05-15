import tools from '@/data/tools.json';
import Footer from '@/app/components/Footer';
import HomeClient from '@/app/components/HomeClient';

type Tool = (typeof tools)[0];

// Helper function to get affiliate link from environment variable or fallback to JSON
function getAffiliateLink(tool: Tool): string {
  const envVarName = `AFFILIATE_${tool.name.toUpperCase().replace(/\s+/g, '_')}`;
  const envLink = process.env[envVarName];
  return envLink || tool.affiliate_link;
}

export default function Home() {
  // Enrich tools with affiliate links from environment variables
  const enrichedTools = tools.map(tool => ({
    ...tool,
    affiliate_link: getAffiliateLink(tool)
  }));

  return (
    <>
      <HomeClient initialTools={enrichedTools} />
      <Footer />
    </>
  );
}
