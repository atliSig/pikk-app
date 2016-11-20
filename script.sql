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
-- Name: event; Type: TABLE; Schema: public; Owner: peturhelgi
--

CREATE TABLE event (
    id integer NOT NULL,
    group_id integer,
    restaurant_id integer,
    deadline time with time zone,
    toe time with time zone,
    satisfaction real,
    CONSTRAINT deadline_check CHECK ((deadline < toe))
);


ALTER TABLE event OWNER TO peturhelgi;

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

ALTER SEQUENCE event_id_seq OWNED BY event.id;


--
-- Name: groups; Type: TABLE; Schema: public; Owner: peturhelgi
--

CREATE TABLE groups (
    id integer NOT NULL,
    name character varying(75) NOT NULL,
    description text,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


ALTER TABLE groups OWNER TO peturhelgi;

--
-- Name: group_id_seq; Type: SEQUENCE; Schema: public; Owner: peturhelgi
--

CREATE SEQUENCE group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE group_id_seq OWNER TO peturhelgi;

--
-- Name: group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: peturhelgi
--

ALTER SEQUENCE group_id_seq OWNED BY groups.id;


--
-- Name: pikk_users; Type: TABLE; Schema: public; Owner: peturhelgi
--

CREATE TABLE pikk_users (
    id integer NOT NULL,
    username character varying(128),
    phone character varying(32),
    email text,
    first_name text,
    last_name text,
    nikk text,
    "createdAt" timestamp with time zone,
    google json,
    "updatedAt" timestamp with time zone
);


ALTER TABLE pikk_users OWNER TO peturhelgi;

--
-- Name: pikk_user_id_seq; Type: SEQUENCE; Schema: public; Owner: peturhelgi
--

CREATE SEQUENCE pikk_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE pikk_user_id_seq OWNER TO peturhelgi;

--
-- Name: pikk_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: peturhelgi
--

ALTER SEQUENCE pikk_user_id_seq OWNED BY pikk_users.id;


--
-- Name: restaurant; Type: TABLE; Schema: public; Owner: peturhelgi
--

CREATE TABLE restaurant (
    id integer NOT NULL,
    phone_id integer,
    score_0 real DEFAULT 0.5,
    score_1 real DEFAULT 0.5,
    score_2 real DEFAULT 0.5,
    score_3 real DEFAULT 0.5
);


ALTER TABLE restaurant OWNER TO peturhelgi;

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

ALTER SEQUENCE restaurant_id_seq OWNED BY restaurant.id;


--
-- Name: user_in_event; Type: TABLE; Schema: public; Owner: peturhelgi
--

CREATE TABLE user_in_event (
    user_id integer NOT NULL,
    event_id integer NOT NULL,
    answer_0 text,
    answer_1 text,
    answer_2 text,
    answer_3 text,
    answer_4 text,
    satisfaction integer
);


ALTER TABLE user_in_event OWNER TO peturhelgi;

--
-- Name: user_in_group; Type: TABLE; Schema: public; Owner: peturhelgi
--

CREATE TABLE user_in_group (
    user_id integer NOT NULL,
    group_id integer NOT NULL,
    joined timestamp with time zone,
    is_admin boolean DEFAULT false NOT NULL
);


ALTER TABLE user_in_group OWNER TO peturhelgi;

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY event ALTER COLUMN id SET DEFAULT nextval('event_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY groups ALTER COLUMN id SET DEFAULT nextval('group_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY pikk_users ALTER COLUMN id SET DEFAULT nextval('pikk_user_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY restaurant ALTER COLUMN id SET DEFAULT nextval('restaurant_id_seq'::regclass);


--
-- Data for Name: event; Type: TABLE DATA; Schema: public; Owner: peturhelgi
--

COPY event (id, group_id, restaurant_id, deadline, toe, satisfaction) FROM stdin;
\.


--
-- Name: event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: peturhelgi
--

SELECT pg_catalog.setval('event_id_seq', 1, false);


--
-- Name: group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: peturhelgi
--

SELECT pg_catalog.setval('group_id_seq', 2, true);


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: peturhelgi
--

COPY groups (id, name, description, "createdAt", "updatedAt") FROM stdin;
1	Pikkaroo	Descriptionale	2016-11-19 04:48:38.274+00	2016-11-19 04:48:38.274+00
2	Pikk	Þetta er offical description fyrir þig	2016-11-19 05:12:34.396+00	2016-11-19 05:12:34.396+00
\.


--
-- Name: pikk_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: peturhelgi
--

SELECT pg_catalog.setval('pikk_user_id_seq', 86, true);


--
-- Data for Name: pikk_users; Type: TABLE DATA; Schema: public; Owner: peturhelgi
--

COPY pikk_users (id, username, phone, email, first_name, last_name, nikk, "createdAt", google, "updatedAt") FROM stdin;
86	peturhelgi.gmail.com	\N	peturhelgi@gmail.com	Pétur Helgi	Einarsson	\N	2016-11-19 05:40:15.564+00	{"id":"100822127206416694590","token":"ya29.CjCbA8_gFleqmnIeaXWELTnCWmMgkibD6X9XZE65YoSAma_qL6tH3oqG4qwN2rpCTA8","name":"Pétur Helgi Einarsson","email":"peturhelgi@gmail.com"}	2016-11-19 05:40:15.564+00
\.


--
-- Data for Name: restaurant; Type: TABLE DATA; Schema: public; Owner: peturhelgi
--

COPY restaurant (id, phone_id, score_0, score_1, score_2, score_3) FROM stdin;
\.


--
-- Name: restaurant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: peturhelgi
--

SELECT pg_catalog.setval('restaurant_id_seq', 1, false);


--
-- Data for Name: user_in_event; Type: TABLE DATA; Schema: public; Owner: peturhelgi
--

COPY user_in_event (user_id, event_id, answer_0, answer_1, answer_2, answer_3, answer_4, satisfaction) FROM stdin;
\.


--
-- Data for Name: user_in_group; Type: TABLE DATA; Schema: public; Owner: peturhelgi
--

COPY user_in_group (user_id, group_id, joined, is_admin) FROM stdin;
\.


--
-- Name: event_pkey; Type: CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY event
    ADD CONSTRAINT event_pkey PRIMARY KEY (id);


--
-- Name: group_pkey; Type: CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY groups
    ADD CONSTRAINT group_pkey PRIMARY KEY (id);


--
-- Name: pikk_user_nikk_key; Type: CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY pikk_users
    ADD CONSTRAINT pikk_user_nikk_key UNIQUE (nikk);


--
-- Name: pikk_user_phone_key; Type: CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY pikk_users
    ADD CONSTRAINT pikk_user_phone_key UNIQUE (phone);


--
-- Name: pikk_user_username_key; Type: CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY pikk_users
    ADD CONSTRAINT pikk_user_username_key UNIQUE (username);


--
-- Name: restaurant_phone_id_key; Type: CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY restaurant
    ADD CONSTRAINT restaurant_phone_id_key UNIQUE (phone_id);


--
-- Name: restaurant_pkey; Type: CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY restaurant
    ADD CONSTRAINT restaurant_pkey PRIMARY KEY (id);


--
-- Name: user_in_event_pkey; Type: CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY user_in_event
    ADD CONSTRAINT user_in_event_pkey PRIMARY KEY (user_id, event_id);


--
-- Name: event_at_restaurant; Type: FK CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY event
    ADD CONSTRAINT event_at_restaurant FOREIGN KEY (restaurant_id) REFERENCES restaurant(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: event_for_user; Type: FK CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY user_in_event
    ADD CONSTRAINT event_for_user FOREIGN KEY (event_id) REFERENCES event(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: group_involved; Type: FK CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY event
    ADD CONSTRAINT group_involved FOREIGN KEY (group_id) REFERENCES groups(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: in_group; Type: FK CONSTRAINT; Schema: public; Owner: peturhelgi
--

ALTER TABLE ONLY user_in_group
    ADD CONSTRAINT in_group FOREIGN KEY (group_id) REFERENCES groups(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

