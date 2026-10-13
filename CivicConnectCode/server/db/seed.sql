   -- CivicConnect test/dev seed data. TEST-ONLY accounts, not real users.
   -- All three accounts use the documented test password: CivicTest#2026
   -- IMPORTANT NOTE: Contact Kaylee, Alyssa or Chanzél for access to dev data.
   -- Only the bcrypt hash is stored here. Never reuse this password anywhere real.
   -- No role/owner statements: must run under any DB user (CI uses "civic").
   -- Apply after schema.sql:  psql -d <db_name> -f server/db/seed.sql

   INSERT INTO public.users (full_name, email, password_hash, role) VALUES
     ('Test Requester',  'requester@test.civicconnect.local',  '$2b$10$cmyoQ.cdJlnQSP1r1EJsu.MwcCcUWe3q7v8mRsWnZgbBnbxjQAlmi', 'requester'),
     ('Test Staff',      'staff@test.civicconnect.local',      '$2b$10$cmyoQ.cdJlnQSP1r1EJsu.MwcCcUWe3q7v8mRsWnZgbBnbxjQAlmi', 'staff'),
     ('Test Management', 'management@test.civicconnect.local', '$2b$10$cmyoQ.cdJlnQSP1r1EJsu.MwcCcUWe3q7v8mRsWnZgbBnbxjQAlmi', 'management');