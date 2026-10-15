
import http from "k6/http";
import { check, sleep } from "k6";

const BASE = __ENV.BASE_URL || "http://localhost:5000";
const PASSWORD = "CivicTest#2026";
const JSON_HEADERS = { "Content-Type": "application/json" };

export const options = {
  scenarios: {
    dashboard: {
      executor: "constant-vus",
      vus: 50,
      duration: "1m",
    },
  },
  thresholds: {
    "http_req_duration{scenario:dashboard}": ["p(95)<2000"],
    "http_req_failed{scenario:dashboard}": ["rate<0.01"],
  },
};

function login(email) {
  const response = http.post(
    `${BASE}/api/auth/login`,
    JSON.stringify({ email, password: PASSWORD }),
    { headers: JSON_HEADERS }
  );

  if (response.status !== 200) {
    throw new Error(`Login failed for ${email}: ${response.status}`);
  }

  return response.json("token");
}

export function setup() {
  const requesterToken = login("requester@test.civicconnect.local");

  for (let i = 1; i <= 200; i++) {
    http.post(
      `${BASE}/api/requests`,
      JSON.stringify({
        title: `Load test request ${i}`,
        description: "Created by the TC-P01 performance test.",
        category: "Maintenance",
      }),
      {
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${requesterToken}`,
        },
      }
    );
  }

  return {
    token: login("management@test.civicconnect.local"),
  };
}

export default function (data) {
  const response = http.get(`${BASE}/api/requests`, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });

  check(response, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
