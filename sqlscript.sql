--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.5
-- Dumped by pg_dump version 9.5.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: eventMembers; Type: TABLE; Schema: public; Owner: peturhelgi
--

CREATE TABLE "eventMembers" (
    "memberId" integer NOT NULL,
    "eventId" integer NOT NULL,
    answer0 text,
    answer1 text,
    answer2 text,
    answer3 text,
    answer4 text,
    satisfaction integer,
    "isAdmin" boolean DEFAULT false,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    "selectedPlace" integer
);


ALTER TABLE "eventMembers" OWNER TO peturhelgi;

--
-- Name: events; Type: TABLE; Schema: public; Owner: peturhelgi
--

CREATE TABLE events (
    id integer NOT NULL,
    "groupId" integer,
    "restaurantId" integer,
    satisfaction real,
    deadline timestamp with time zone,
    toe timestamp with time zone,
    description character varying(256),
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    title character varying(70),
    "isReady" boolean DEFAULT false
);


ALTER TABLE events OWNER TO peturhelgi;

--
-- Name: COLUMN events.toe; Type: COMMENT; Schema: public; Owner: peturhelgi
--

COMMENT ON COLUMN events.toe IS 'Time of Eating';


--
-- Name: event_id_seq; Type: SEQUENCE; Schema: public; Owner: peturhelgi
--

CREATE SEQUENCE event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE event_id_seq OWNER TO peturhelgi;

--
-- Name: event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: peturhelgi
--

ALTER SEQUENCE event_id_seq OWNED BY events.id;


--
-- Name: groupMembers; Type: TABLE; Schema: public; Owner: peturhelgi
--

CREATE TABLE "groupMembers" (
    "isAdmin" boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "groupId" integer NOT NULL,
    "memberId" integer NOT NULL
);


ALTER TABLE "groupMembers" OWNER TO peturhelgi;

--
-- Name: groups; Type: TABLE; Schema: public; Owner: peturhelgi
--

CREATE TABLE groups (
    id integer NOT NULL,
    name character varying(75) NOT NULL,
    description character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE groups OWNER TO peturhelgi;

--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: peturhelgi
--

CREATE SEQUENCE groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE groups_id_seq OWNER TO peturhelgi;

--
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: peturhelgi
--

ALTER SEQUENCE groups_id_seq OWNED BY groups.id;


--
-- Name: members; Type: TABLE; Schema: public; Owner: peturhelgi
--

CREATE TABLE members (
    id integer NOT NULL,
    username character varying(255),
    phone character varying(32),
    email character varying(255),
    first_name character varying(255),
    last_name character varying(255),
    nikk character varying(32),
    google json,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    img_url text
);


ALTER TABLE members OWNER TO peturhelgi;

--
-- Name: members_id_seq; Type: SEQUENCE; Schema: public; Owner: peturhelgi
--

CREATE SEQUENCE members_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE members_id_seq OWNER TO peturhelgi;

--
-- Name: members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: peturhelgi
--

ALTER SEQUENCE members_id_seq OWNED BY members.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: peturhelgi
--

CREATE TABLE notifications (
    id integer NOT NULL,
    "memberId" integer NOT NULL,
    content text,
    url character varying(64),
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


ALTER TABLE notifications OWNER TO peturhelgi;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: peturhelgi
--

CREATE SEQUENCE notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE notifications_id_seq OWNER TO peturhelgi;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: peturhelgi
--

ALTER SEQUENCE notifications_id_seq OWNED BY notifications.id;


--
-- Name: restaurants; Type: TABLE; Schema: public; Owner: peturhelgi
--

CREATE TABLE restaurants (
    id integer NOT NULL,
    "phoneId" integer,
    score0 real DEFAULT 0.5,
    score1 real DEFAULT 0.5,
    score2 real DEFAULT 0.5,
    score3 real DEFAULT 0.5,
    "updatedAt" timestamp with time zone,
    "createdAt" timestamp with time zone
);


ALTER TABLE restaurants OWNER TO peturhelgi;

--
-- Name: restaurant_id_seq; Type: SEQUENCE; Schema: public; Owner: peturhelgi
--

CREATE SEQUENCE restaurant_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE restaurant_id_seq OWNER TO peturhelgi;

--
-- Name: restaurant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: peturhelgi
--

ALTER SEQUENCE restaurant_id_seq OWNED BY restaurants.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY events ALTER COLUMN id SET DEFAULT nextval('event_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY groups ALTER COLUMN id SET DEFAULT nextval('groups_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY members ALTER COLUMN id SET DEFAULT nextval('members_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY notifications ALTER COLUMN id SET DEFAULT nextval('notifications_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY restaurants ALTER COLUMN id SET DEFAULT nextval('restaurant_id_seq'::regclass);


--
-- Data for Name: eventMembers; Type: TABLE DATA; Schema: public; Owner: peturhelgi
--

COPY "eventMembers" ("memberId", "eventId", answer0, answer1, answer2, answer3, answer4, satisfaction, "isAdmin", "createdAt", "updatedAt", "selectedPlace") FROM stdin;
5	206	\N	\N	\N	\N	\N	\N	f	2017-02-02 23:17:29.987+00	2017-02-02 23:17:29.987+00	\N
6	206	\N	\N	\N	\N	\N	\N	f	2017-02-02 23:17:29.987+00	2017-02-02 23:17:29.987+00	\N
7	206	\N	\N	\N	\N	\N	\N	f	2017-02-02 23:17:29.987+00	2017-02-02 23:17:29.987+00	\N
\.


--
-- Name: event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: peturhelgi
--

SELECT pg_catalog.setval('event_id_seq', 206, true);


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: peturhelgi
--

COPY events (id, "groupId", "restaurantId", satisfaction, deadline, toe, description, "createdAt", "updatedAt", title, "isReady") FROM stdin;
206	79	\N	\N	2017-01-31 22:00:00+00	2017-02-03 22:00:00+00	Vera með sýningu á Pikk og vera legends	2017-02-02 23:17:29.928+00	2017-02-02 23:17:29.928+00	UT messan 	f
\.


--
-- Data for Name: groupMembers; Type: TABLE DATA; Schema: public; Owner: peturhelgi
--

COPY "groupMembers" ("isAdmin", "createdAt", "updatedAt", "groupId", "memberId") FROM stdin;
t	2017-02-02 23:12:06.912+00	2017-02-02 23:12:06.912+00	78	5
f	2017-02-02 23:12:07.001+00	2017-02-02 23:12:07.001+00	78	6
f	2017-02-02 23:12:07.001+00	2017-02-02 23:12:07.001+00	78	7
t	2017-02-02 23:14:58.607+00	2017-02-02 23:14:58.607+00	79	5
f	2017-02-02 23:14:58.654+00	2017-02-02 23:14:58.654+00	79	6
f	2017-02-02 23:14:58.654+00	2017-02-02 23:14:58.654+00	79	7
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: peturhelgi
--

COPY groups (id, name, description, "createdAt", "updatedAt") FROM stdin;
78	Kenkyu Guruppu	123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345	2017-02-02 23:12:06.754+00	2017-02-02 23:12:06.754+00
79	new group	123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345	2017-02-02 23:14:58.547+00	2017-02-02 23:14:58.547+00
\.


--
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: peturhelgi
--

SELECT pg_catalog.setval('groups_id_seq', 79, true);


--
-- Data for Name: members; Type: TABLE DATA; Schema: public; Owner: peturhelgi
--

COPY members (id, username, phone, email, first_name, last_name, nikk, google, "createdAt", "updatedAt", img_url) FROM stdin;
5	\N	\N	peturhelgi@gmail.com	Pétur Helgi	Einarsson	\N	{"id":"100822127206416694590","token":"ya29.Ci-gA0KA7_1KsEa4fSQPeiZGiNOEzrDuc0KrtiAR4mrGdRBoi8CGyRA-K76QOg0p8Q","displayName":"Pétur Helgi Einarsson","email":"peturhelgi@gmail.com"}	2016-11-24 10:07:11.705+00	2016-11-24 10:07:11.705+00	https://lh6.googleusercontent.com/-gqsZ_pAymxQ/AAAAAAAAAAI/AAAAAAAAKNY/tEB4Goe2l-c/photo.jpg?sz=250
6	\N	\N	atli.sigurgeirsson@aiesec.net	Atli	Sigurgeirsson	\N	{"id":"112917647979991486000","token":"ya29.CjCgAwq8q5G_quDbI5CoV037iWBe6nbGmxfEnzJN9mk_cBcqB8s-K8JvFY_v8utvnd4","displayName":"Atli Sigurgeirsson","email":"atli.sigurgeirsson@aiesec.net"}	2016-11-24 10:08:15.421+00	2016-11-24 10:08:15.421+00	https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=250
7	\N	\N	petur.einarsson@aiesec.net	Petur Helgi	Einarsson	\N	{"id":"103992355250381317001","token":"ya29.CjCjA7vRIocX2P4mhBUghswU4qORYxU-rTQVxSaLPj2yRVsqfB1sYP2JhFge_XgObTc","displayName":"Petur Helgi Einarsson","email":"petur.einarsson@aiesec.net"}	2016-11-27 21:57:09.529+00	2016-11-27 21:57:09.529+00	https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=250
\.


--
-- Name: members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: peturhelgi
--

SELECT pg_catalog.setval('members_id_seq', 7, true);


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: peturhelgi
--

COPY notifications (id, "memberId", content, url, "createdAt", "updatedAt") FROM stdin;
69	6	undefined added you to the group Pikkadoo	/g/71	2016-11-27 21:56:43.108+00	2016-11-27 21:56:43.108+00
72	6	Petur Helgi invited you to the event Celebration dinner with your group Pikkadoo!	/e/199	2016-11-27 22:02:24.453+00	2016-11-27 22:02:24.453+00
74	6	Petur Helgi invited you to the event True dinner with your group Pikkadoo!	/e/200	2016-11-27 22:05:26.721+00	2016-11-27 22:05:26.721+00
75	6	undefined added you to the group addf	/g/72	2016-11-27 22:58:14.347+00	2016-11-27 22:58:14.347+00
76	6	Pétur Helgi invited you to the event asdf with your group addf!	/e/201	2016-11-27 22:58:22.059+00	2016-11-27 22:58:22.059+00
79	6	Pétur Helgi invited you to the event hambo with your group addf!	/e/203	2016-11-27 23:09:52.066+00	2016-11-27 23:09:52.066+00
81	6	undefined added you to the group adsf	/g/74	2016-11-27 23:19:15.321+00	2016-11-27 23:19:15.321+00
83	6	undefined added you to the group Group name	/g/75	2016-11-27 23:33:14.121+00	2016-11-27 23:33:14.121+00
84	7	undefined added you to the group Group name	/g/75	2016-11-27 23:33:14.121+00	2016-11-27 23:33:14.121+00
85	6	Pétur Helgi invited you to the event New Event with your group Group name!	/e/205	2016-11-27 23:33:25.473+00	2016-11-27 23:33:25.473+00
87	7	undefined added you to the group petur	/g/76	2016-11-27 23:36:46.196+00	2016-11-27 23:36:46.196+00
88	7	Pétur Helgi Einarsson added you to the group gutrop	/g/77	2016-11-27 23:37:57.98+00	2016-11-27 23:37:57.98+00
89	6	Pétur Helgi Einarsson added you to the group Kenkyu Guruppu	/g/78	2017-02-02 23:12:07.024+00	2017-02-02 23:12:07.024+00
90	7	Pétur Helgi Einarsson added you to the group Kenkyu Guruppu	/g/78	2017-02-02 23:12:07.024+00	2017-02-02 23:12:07.024+00
91	6	Pétur Helgi Einarsson added you to the group new group	/g/79	2017-02-02 23:14:58.667+00	2017-02-02 23:14:58.667+00
92	7	Pétur Helgi Einarsson added you to the group new group	/g/79	2017-02-02 23:14:58.667+00	2017-02-02 23:14:58.667+00
93	6	Pétur Helgi invited you to the event UT messan  with your group new group!	/e/206	2017-02-02 23:17:30.045+00	2017-02-02 23:17:30.045+00
94	7	Pétur Helgi invited you to the event UT messan  with your group new group!	/e/206	2017-02-02 23:17:30.045+00	2017-02-02 23:17:30.045+00
\.


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: peturhelgi
--

SELECT pg_catalog.setval('notifications_id_seq', 94, true);


--
-- Name: restaurant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: peturhelgi
--

SELECT pg_catalog.setval('restaurant_id_seq', 1, false);


--
-- Data for Name: restaurants; Type: TABLE DATA; Schema: public; Owner: peturhelgi
--

COPY restaurants (id, "phoneId", score0, score1, score2, score3, "updatedAt", "createdAt") FROM stdin;
\.


--
-- Name: event_pkey; Type: CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY events
    ADD CONSTRAINT event_pkey PRIMARY KEY (id);


--
-- Name: groupMembers_pkey; Type: CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY "groupMembers"
    ADD CONSTRAINT "groupMembers_pkey" PRIMARY KEY ("groupId", "memberId");


--
-- Name: groups_pkey; Type: CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: members_email_key; Type: CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY members
    ADD CONSTRAINT members_email_key UNIQUE (email);


--
-- Name: members_nikk_key; Type: CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY members
    ADD CONSTRAINT members_nikk_key UNIQUE (nikk);


--
-- Name: members_phone_key; Type: CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY members
    ADD CONSTRAINT members_phone_key UNIQUE (phone);


--
-- Name: members_pkey; Type: CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY members
    ADD CONSTRAINT members_pkey PRIMARY KEY (id);


--
-- Name: members_username_key; Type: CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY members
    ADD CONSTRAINT members_username_key UNIQUE (username);


--
-- Name: notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: restaurant_phone_id_key; Type: CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY restaurants
    ADD CONSTRAINT restaurant_phone_id_key UNIQUE ("phoneId");


--
-- Name: restaurant_pkey; Type: CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY restaurants
    ADD CONSTRAINT restaurant_pkey PRIMARY KEY (id);


--
-- Name: user_in_event_pkey; Type: CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY "eventMembers"
    ADD CONSTRAINT user_in_event_pkey PRIMARY KEY ("memberId", "eventId");


--
-- Name: event_at_restaurant; Type: FK CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY events
    ADD CONSTRAINT event_at_restaurant FOREIGN KEY ("restaurantId") REFERENCES restaurants(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: fk_eventid; Type: FK CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY "eventMembers"
    ADD CONSTRAINT fk_eventid FOREIGN KEY ("eventId") REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_memberId; Type: FK CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY "eventMembers"
    ADD CONSTRAINT "fk_memberId" FOREIGN KEY ("memberId") REFERENCES members(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_memberId; Type: FK CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT "fk_memberId" FOREIGN KEY ("memberId") REFERENCES members(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: groupMembers_groupId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY "groupMembers"
    ADD CONSTRAINT "groupMembers_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: groupMembers_memberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY "groupMembers"
    ADD CONSTRAINT "groupMembers_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES members(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

