// Locally: loads server/.env.test (points at civicconnect_test, never your dev DB).
// In CI: .env.test does not exist, so values come from the workflow env block.
require("dotenv").config({ path: ".env.test", quiet: true });