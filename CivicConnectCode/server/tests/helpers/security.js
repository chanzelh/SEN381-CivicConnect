const INTERNAL_PATTERNS = [
  /stack/i,
  /\bat\s+\S+\s+\(/,          // stack frame: "at fn (file:line)"
  /node_modules/i,
  /\.js:\d+/,                 // file:line
  /\b(select|insert|update|delete)\b.+\b(from|into|set)\b/i, // SQL
  /postgres|pg_|relation\s+"/i,
  /jsonwebtoken|JsonWebTokenError|TokenExpiredError|jwt (malformed|expired)|invalid signature/i,
  /JWT_SECRET|DB_PASSWORD/i,
];

function expectNoInternalDetails(body) {
  expect(Object.keys(body)).toEqual(["message"]);
  const text = JSON.stringify(body);
  for (const pattern of INTERNAL_PATTERNS) {
    expect(text).not.toMatch(pattern);
  }
}

module.exports = { expectNoInternalDetails };