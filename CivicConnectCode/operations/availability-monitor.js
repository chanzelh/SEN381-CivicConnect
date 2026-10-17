// Availability monitor (#89, NFR-008: >= 99% availability over the test period).
// Calls the health endpoint at a fixed interval, logs every check to a CSV,
// and prints the availability percentage at the end.
//
// Usage:  node availability-monitor.js <healthUrl> <minutes> <intervalSeconds>
// Example: node availability-monitor.js http://localhost:5000/health 60 30
const fs = require("node:fs");

const url = process.argv[2] || "http://localhost:5000/health";
const minutes = Number(process.argv[3] || 60);
const intervalSeconds = Number(process.argv[4] || 30);
const csvFile = "availability-log.csv";

fs.writeFileSync(csvFile, "timestamp,result,http_status,response_ms\n");

let checks = 0;
let up = 0;
const endAt = Date.now() + minutes * 60 * 1000;

async function check() {
  const started = Date.now();
  let result = "DOWN";
  let status = "";

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    status = res.status;
    if (res.status === 200) result = "UP";
  } catch {
    status = "no response";
  }

  checks += 1;
  if (result === "UP") up += 1;

  const line = `${new Date().toISOString()},${result},${status},${Date.now() - started}`;
  fs.appendFileSync(csvFile, line + "\n");
  console.log(line);
}

async function run() {
  console.log(`Monitoring ${url} for ${minutes} min, every ${intervalSeconds} s`);
  while (Date.now() < endAt) {
    await check();
    await new Promise((resolve) => setTimeout(resolve, intervalSeconds * 1000));
  }

  const availability = checks ? ((up / checks) * 100).toFixed(2) : "0.00";
  const summary = `\nChecks: ${checks} | Up: ${up} | Down: ${checks - up} | Availability: ${availability}% | Target (NFR-008): >= 99% | ${Number(availability) >= 99 ? "MET" : "NOT MET"}`;
  console.log(summary);
  fs.appendFileSync(csvFile, `# ${summary.trim()}\n`);
}

run();