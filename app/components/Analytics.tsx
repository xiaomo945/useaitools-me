const PLAUSIBLE_SCRIPT_URL = "https://plausible.io/js/script.js";

interface LocalAnalyticsConfig {
  domain: string;
  scriptUrl: string;
}

function getLocalAnalyticsScript(): string {
  return `
(function() {
  try {
    var key = 'local_analytics_' + (window.location.hostname || 'dev');
    var raw = localStorage.getItem(key);
    var data = raw ? JSON.parse(raw) : {
      total: 0,
      firstVisit: new Date().toISOString(),
      pages: {},
      sessions: 0
    };

    if (!data.sessions || data.lastVisitDate !== new Date().toDateString()) {
      data.sessions = (data.sessions || 0) + 1;
    }
    data.lastVisitDate = new Date().toDateString();

    var path = window.location.pathname || '/';
    data.pages[path] = (data.pages[path] || 0) + 1;
    data.total = (data.total || 0) + 1;
    data.lastVisit = new Date().toISOString();

    localStorage.setItem(key, JSON.stringify(data));

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('[Local Analytics] Visit:', path, '| Total:', data.total, '| Sessions:', data.sessions);
    }
  } catch (e) {
    // Silent fail for privacy-first environments
  }
})();
`.trim();
}

function getPlausibleConfig(): LocalAnalyticsConfig | null {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain || typeof domain !== "string" || domain.trim() === "") {
    return null;
  }
  return {
    domain: domain.trim(),
    scriptUrl: PLAUSIBLE_SCRIPT_URL,
  };
}

export default function Analytics(): React.ReactElement | null {
  const plausible = getPlausibleConfig();

  if (plausible) {
    return (
      <script
        defer
        data-domain={plausible.domain}
        src={plausible.scriptUrl}
      />
    );
  }

  return (
    <script
      type="text/javascript"
      dangerouslySetInnerHTML={{ __html: getLocalAnalyticsScript() }}
    />
  );
}
