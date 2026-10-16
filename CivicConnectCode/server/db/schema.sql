SET client_encoding = 'UTF8';


CREATE TABLE public.users (
    user_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name character varying(100) NOT NULL,
    email character varying(255) NOT NULL UNIQUE,
    password_hash text NOT NULL,
    role character varying(20) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT users_role_check CHECK (role IN ('requester', 'staff', 'management'))
);

CREATE TABLE public.service_requests (
    request_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    requester_id integer NOT NULL REFERENCES public.users(user_id),
    assigned_staff_id integer REFERENCES public.users(user_id),
    title character varying(150) NOT NULL,
    description text NOT NULL,
    category character varying(100) NOT NULL,
    status character varying(30) DEFAULT 'Open' NOT NULL,
    submitted_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    due_date date,
    issue_type character varying(100),
    device_type character varying(100),
    device_name character varying(255),
    manufacturer character varying(150),
    model character varying(150),
    software_name character varying(255),
    software_version character varying(100),
    operating_system character varying(150),
    error_message text,
    location text,
    date_started timestamp with time zone,
    impact character varying(100),
    urgency character varying(100),
    troubleshooting text,
    maintenance_type character varying(150),
    affected_area character varying(255),
    additional_details text,
    damage_details text,
    incident_type character varying(150),
    incident_date date,
    item_description text,
    last_known_location character varying(255),
    date_lost date,
    other_request_type character varying(150),
    CONSTRAINT service_requests_status_check CHECK (status IN
        ('Open', 'Pending', 'Assigned', 'In Progress', 'On Hold', 'Resolved', 'Overdue', 'Closed'))
);

CREATE TABLE public.request_status_history (
    history_id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    request_id integer NOT NULL REFERENCES public.service_requests(request_id) ON DELETE CASCADE,
    changed_by integer REFERENCES public.users(user_id),
    old_status character varying(30),
    new_status character varying(30) NOT NULL,
    change_note text,
    changed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE public.request_comments (
    comment_id serial PRIMARY KEY,
    request_id integer NOT NULL REFERENCES public.service_requests(request_id) ON DELETE CASCADE,
    user_id integer NOT NULL REFERENCES public.users(user_id),
    comment_text text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT request_comments_comment_text_check CHECK (length(TRIM(BOTH FROM comment_text)) > 0)
);

CREATE TABLE public.notifications (
    notification_id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    request_id integer REFERENCES public.service_requests(request_id) ON DELETE CASCADE,
    title character varying(150) NOT NULL,
    message text NOT NULL,
    notification_type character varying(50) NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ---------- Indexes ----------

CREATE INDEX idx_request_comments_request_id ON public.request_comments (request_id);
CREATE INDEX idx_notifications_user_unread ON public.notifications (user_id, is_read, created_at DESC);