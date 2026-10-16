INSERT INTO public.users (full_name, email, password_hash, role) VALUES
     ('Test Requester',  'requester@test.civicconnect.local',  '$2b$10$cmyoQ.cdJlnQSP1r1EJsu.MwcCcUWe3q7v8mRsWnZgbBnbxjQAlmi', 'requester'),
     ('Test Staff',      'staff@test.civicconnect.local',      '$2b$10$cmyoQ.cdJlnQSP1r1EJsu.MwcCcUWe3q7v8mRsWnZgbBnbxjQAlmi', 'staff'),
     ('Test Management', 'management@test.civicconnect.local', '$2b$10$cmyoQ.cdJlnQSP1r1EJsu.MwcCcUWe3q7v8mRsWnZgbBnbxjQAlmi', 'management');