/*
 * Simple HTTP server for the Wise full stack webapp.
 *
 * This server uses only Node.js built-in modules to avoid
 * external dependencies. It serves static files from the
 * current directory and exposes an API endpoint at /api/data
 * that returns a JSON representation of the Wise MVP summary.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Port can be set via environment variable or defaults to 3000
const port = process.env.PORT || 3000;

/*
 * Data describing Wise's international transfer product. Each
 * property corresponds to a section in the MVP outline. The
 * front-end fetches this object via the /api/data endpoint.
 */
const data = {
  problem: "Moving money across borders with traditional banks is slow, costly and lacks transparency. Exchange rates often include hidden mark-ups and customers rarely know the full cost upfront.",
  solution: [
    "Open a single account to hold and convert more than 40 currencies.",
    "Send payments to over 70 countries using the mid-market rate and low fees.",
    "Spend or withdraw cash in 160+ countries with a Wise card; freeze and unfreeze the card in-app.",
    "Transfers are protected with two-factor authentication, encryption and biometrics."
  ],
  coreFeatures: [
    "Multi-currency wallet with instant conversion between 40+ currencies.",
    "Low, transparent transfer fees starting from around 0.43%.",
    "Fast transfers — over 65% arrive in under 20 seconds.",
    "Local account details for 9 currencies so you can get paid like a local.",
    "Wise card for global spending and cash withdrawals with automatic currency conversion.",
    "In-app dashboard to track balances, transfers and transaction history."
  ],
  targetUsers: [
    "Freelancers and remote workers paid in multiple currencies.",
    "Expats and travellers managing money abroad.",
    "Small businesses paying overseas suppliers and contractors.",
    "Individuals sending money to family in other countries."
  ],
  valueProposition: [
    "Real mid-market exchange rates with no hidden mark-ups.",
    "Faster transfers than traditional banks — many arrive instantly.",
    "Transparent pricing displayed before you send.",
    "Local account details make receiving payments simple and often free.",
    "Regulated money services business, using two-factor authentication and encryption."
  ],
  successMetrics: [
    "Growth in transfer volume and repeat transactions.",
    "Retention of active users and frequency of app usage.",
    "App Store rating (currently 4.7/5 with 91k+ reviews).",
    "Expansion of the customer base (16 million+ users worldwide)."
  ],
  techStack: [
    "Native apps for iOS and Android devices.",
    "Back-end integrations with global banking networks and payment rails.",
    "Security features including two-factor authentication, encryption and biometric logins.",
    "Wise operates as a Money Service Business rather than a bank, safeguarding funds through partner banks."
  ],
  monetization: [
    "Small flat fees and a low margin on currency conversion.",
    "Interest on USD balances for eligible US customers."
  ]
};

// Mapping of file extensions to Content-Type headers
const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

/*
 * Serve a static file from the current directory. If the file is not
 * found, the callback is invoked with an error. Otherwise the
 * callback receives the file contents and mime type.
 */
function serveStatic(filePath, callback) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      callback(err);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    callback(null, content, mimeType);
  });
}

// Create and start the HTTP server
const server = http.createServer((req, res) => {
  // API endpoint for JSON data
  if (req.url === '/api/data') {
    const json = JSON.stringify(data);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
    res.end(json);
    return;
  }

  // Normalize the request URL and default to index.html
  let urlPath = req.url;
  if (urlPath === '/' || urlPath === '') {
    urlPath = '/index.html';
  }
  const filePath = path.join(__dirname, decodeURIComponent(urlPath));

  serveStatic(filePath, (err, content, mimeType) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(content);
    }
  });
});

server.listen(port, () => {
  console.log(`Wise webapp server listening on port ${port}`);
});
