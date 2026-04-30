--
-- PostgreSQL database dump
--

\restrict 7ycejSctziqh2aY3YEoZWxA4UDy8VoXhCrpXGtrsunhBO5djrWqFxRQPJWTz3Cc

-- Dumped from database version 17.9 (Debian 17.9-1.pgdg13+1)
-- Dumped by pg_dump version 17.9 (Ubuntu 17.9-1.pgdg24.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.users_role_enum AS ENUM (
    'user',
    'employee',
    'super_admin'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: employees; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employees (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "position" character varying(255) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    user_id uuid
);


--
-- Name: employees_schedules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.employees_schedules (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    employee_id uuid,
    "startTime" timestamp without time zone NOT NULL,
    "endTime" timestamp without time zone NOT NULL
);


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: movie; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.movie (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    synopsis text NOT NULL,
    "durationMinutes" integer NOT NULL,
    "releaseDate" date NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    "posterUrl" character varying,
    genre_id integer
);


--
-- Name: movie-genre; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."movie-genre" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


--
-- Name: movie-genre_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."movie-genre_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: movie-genre_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."movie-genre_id_seq" OWNED BY public."movie-genre".id;


--
-- Name: movie_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.movie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: movie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.movie_id_seq OWNED BY public.movie.id;


--
-- Name: projection-type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."projection-type" (
    id integer NOT NULL,
    type_name character varying(255) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


--
-- Name: projection-type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."projection-type_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: projection-type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."projection-type_id_seq" OWNED BY public."projection-type".id;


--
-- Name: refresh-tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."refresh-tokens" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    user_id uuid,
    expired_at timestamp without time zone NOT NULL
);


--
-- Name: room; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.room (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    capacity integer NOT NULL,
    "isMaintenance" boolean NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    "isHandicapAccessible" boolean DEFAULT false NOT NULL,
    projection_type_id integer
);


--
-- Name: room-image; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."room-image" (
    id integer NOT NULL,
    "imageUrl" character varying NOT NULL,
    "displayOrder" integer NOT NULL,
    room_id integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


--
-- Name: room-image_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."room-image_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: room-image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."room-image_id_seq" OWNED BY public."room-image".id;


--
-- Name: room_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.room_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: room_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.room_id_seq OWNED BY public.room.id;


--
-- Name: screening; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.screening (
    id integer NOT NULL,
    "startTime" timestamp without time zone NOT NULL,
    "endTime" timestamp without time zone NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    movie_id integer NOT NULL,
    room_id integer NOT NULL
);


--
-- Name: screening_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.screening_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: screening_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.screening_id_seq OWNED BY public.screening.id;


--
-- Name: ticket_price; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ticket_price (
    id integer NOT NULL,
    price double precision NOT NULL,
    start_activity timestamp without time zone NOT NULL,
    end_activity timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    projection_type_id integer NOT NULL
);


--
-- Name: ticket_price_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ticket_price_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ticket_price_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ticket_price_id_seq OWNED BY public.ticket_price.id;


--
-- Name: ticket_usage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ticket_usage (
    id integer NOT NULL,
    used_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    ticket_id integer NOT NULL,
    screening_id integer NOT NULL
);


--
-- Name: ticket_usage_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ticket_usage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ticket_usage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ticket_usage_id_seq OWNED BY public.ticket_usage.id;


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tickets (
    id integer NOT NULL,
    ticket_type character varying(10) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    user_id uuid NOT NULL
);


--
-- Name: tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tickets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tickets_id_seq OWNED BY public.tickets.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transactions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    type character varying(255) NOT NULL,
    amount double precision NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" uuid
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    firstname character varying(255) NOT NULL,
    lastname character varying(255) NOT NULL,
    role public.users_role_enum DEFAULT 'user'::public.users_role_enum NOT NULL,
    balance double precision DEFAULT '0'::double precision NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: movie id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movie ALTER COLUMN id SET DEFAULT nextval('public.movie_id_seq'::regclass);


--
-- Name: movie-genre id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."movie-genre" ALTER COLUMN id SET DEFAULT nextval('public."movie-genre_id_seq"'::regclass);


--
-- Name: projection-type id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."projection-type" ALTER COLUMN id SET DEFAULT nextval('public."projection-type_id_seq"'::regclass);


--
-- Name: room id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room ALTER COLUMN id SET DEFAULT nextval('public.room_id_seq'::regclass);


--
-- Name: room-image id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."room-image" ALTER COLUMN id SET DEFAULT nextval('public."room-image_id_seq"'::regclass);


--
-- Name: screening id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screening ALTER COLUMN id SET DEFAULT nextval('public.screening_id_seq'::regclass);


--
-- Name: ticket_price id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_price ALTER COLUMN id SET DEFAULT nextval('public.ticket_price_id_seq'::regclass);


--
-- Name: ticket_usage id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_usage ALTER COLUMN id SET DEFAULT nextval('public.ticket_usage_id_seq'::regclass);


--
-- Name: tickets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets ALTER COLUMN id SET DEFAULT nextval('public.tickets_id_seq'::regclass);


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.employees (id, "position", "createdAt", "updatedAt", "deletedAt", user_id) FROM stdin;
fcbaafb2-5d08-4908-a429-5556fa7df9e6	candy_store	2026-04-28 11:56:53.158263	2026-04-28 11:56:53.158263	\N	01802cb8-fb77-4374-9644-1fa9bafbd650
056c7a2e-c4df-4ae3-b029-ae3a079cb941	reception	2026-04-28 11:56:53.210198	2026-04-28 11:56:53.210198	\N	9d35dc06-22db-496c-9a63-2ba83c2788f4
8650ce59-83f8-43ac-871e-1fefd662545c	projectionist	2026-04-28 11:56:53.26227	2026-04-28 11:56:53.26227	\N	0f14bafe-bcd3-4a3c-ade3-d345a92d95c8
\.


--
-- Data for Name: employees_schedules; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.employees_schedules (id, "createdAt", "updatedAt", "deletedAt", employee_id, "startTime", "endTime") FROM stdin;
a48b706e-1ef8-4537-8dad-222a944b34f0	2026-04-28 11:56:53.347734	2026-04-28 11:56:53.347734	\N	fcbaafb2-5d08-4908-a429-5556fa7df9e6	2026-05-01 11:00:00	2026-05-01 19:00:00
d8af0d11-9749-4ae0-a0a9-c890e9022042	2026-04-28 11:56:53.412169	2026-04-28 11:56:53.412169	\N	fcbaafb2-5d08-4908-a429-5556fa7df9e6	2026-05-02 11:00:00	2026-05-02 19:00:00
4b9f4930-2aa0-445f-bc89-80da013c189c	2026-04-28 11:56:53.472956	2026-04-28 11:56:53.472956	\N	fcbaafb2-5d08-4908-a429-5556fa7df9e6	2026-05-03 11:00:00	2026-05-03 19:00:00
a61e409d-73ca-46e4-8562-68765084183f	2026-04-28 11:56:53.533103	2026-04-28 11:56:53.533103	\N	fcbaafb2-5d08-4908-a429-5556fa7df9e6	2026-05-04 11:00:00	2026-05-04 19:00:00
a935b3b1-e12e-4d20-b7aa-552f84e04316	2026-04-28 11:56:53.594746	2026-04-28 11:56:53.594746	\N	fcbaafb2-5d08-4908-a429-5556fa7df9e6	2026-05-05 11:00:00	2026-05-05 19:00:00
f3cd69dd-a075-478f-9a4d-1dd91ada6143	2026-04-28 11:56:53.657117	2026-04-28 11:56:53.657117	\N	056c7a2e-c4df-4ae3-b029-ae3a079cb941	2026-05-01 11:00:00	2026-05-01 19:00:00
bfc52565-4aab-4dfe-9902-714b1d2b391c	2026-04-28 11:56:53.719594	2026-04-28 11:56:53.719594	\N	056c7a2e-c4df-4ae3-b029-ae3a079cb941	2026-05-02 11:00:00	2026-05-02 19:00:00
440cbbdb-4949-4542-8eb8-7179475d786d	2026-04-28 11:56:53.782326	2026-04-28 11:56:53.782326	\N	056c7a2e-c4df-4ae3-b029-ae3a079cb941	2026-05-03 11:00:00	2026-05-03 19:00:00
7052600d-d979-4805-8b6d-1eeadbf7c406	2026-04-28 11:56:53.843376	2026-04-28 11:56:53.843376	\N	056c7a2e-c4df-4ae3-b029-ae3a079cb941	2026-05-04 11:00:00	2026-05-04 19:00:00
e502aad0-4b81-4ea1-b497-9b9d8860628c	2026-04-28 11:56:53.905289	2026-04-28 11:56:53.905289	\N	056c7a2e-c4df-4ae3-b029-ae3a079cb941	2026-05-05 11:00:00	2026-05-05 19:00:00
0b10a5a4-40a5-4e54-938c-85b19c385774	2026-04-28 11:56:53.966713	2026-04-28 11:56:53.966713	\N	8650ce59-83f8-43ac-871e-1fefd662545c	2026-05-01 11:00:00	2026-05-01 19:00:00
7560f788-1e89-437d-a438-252ea206db61	2026-04-28 11:56:54.028202	2026-04-28 11:56:54.028202	\N	8650ce59-83f8-43ac-871e-1fefd662545c	2026-05-02 11:00:00	2026-05-02 19:00:00
f068804b-06e3-4b61-a759-5552b732a692	2026-04-28 11:56:54.089215	2026-04-28 11:56:54.089215	\N	8650ce59-83f8-43ac-871e-1fefd662545c	2026-05-03 11:00:00	2026-05-03 19:00:00
24744951-d775-4b65-9e3a-176badc39e6b	2026-04-28 11:56:54.150167	2026-04-28 11:56:54.150167	\N	8650ce59-83f8-43ac-871e-1fefd662545c	2026-05-04 11:00:00	2026-05-04 19:00:00
865e6897-fdee-41bc-ada8-f2cb27f59693	2026-04-28 11:56:54.209414	2026-04-28 11:56:54.209414	\N	8650ce59-83f8-43ac-871e-1fefd662545c	2026-05-05 11:00:00	2026-05-05 19:00:00
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
9	1773581475895	AddMovieGenreTable1773581475895
10	1773581500000	AddProjectionTypeTable1773581500000
11	1774457205053	AddRoomsAndRoomImagesTables1774457205053
12	1774790422241	AddUserEmployeeRefreshTokenEmployeeScheduleTables1774790422241
13	1774797778609	UpdateExpirationDateTokenToTimestamp1774797778609
14	1774801114462	ChangeEmployeeScheduleDayToISO86011774801114462
15	1774809000000	AddMovieAndScreeningTables1774809000000
16	1776887354502	AddRoomAndMovieField1776887354502
17	1777375523160	AddmovieGenre1777375523160
\.


--
-- Data for Name: movie; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.movie (id, title, synopsis, "durationMinutes", "releaseDate", "createdAt", "updatedAt", "deletedAt", "posterUrl", genre_id) FROM stdin;
7	Projet Annuel : Mission Impossible	Erwan dirige le département des « Missions impossibles » du couloir de l'ESGI. Un jour, il décide de mener une opération délicate dans le bâtiment principal : s'introduire dans le bureau de Monsieur Sananes, le redoutable directeur pédagogique, pour dérober le sujet du Projet Annuel avant sa publication officielle.	161	2026-04-17	2026-04-28 10:33:36.508299	2026-04-28 10:33:36.508299	\N	movies/posters/1777372416394-mission-impossible.png	1
1	test	Lorem Ipsum	169	2014-11-05	2026-04-26 08:19:23.966454	2026-04-28 10:54:36.889221	2026-04-28 10:54:36.889221	movies/posters/1777191563633-Absolute.png	1
3	Maman, j'ai raté le PA	Rémy, jeune étudiant acharné, s'apprêtait à valider son Projet Annuel quand il réalisa, dans un silence d'effroi, qu'il avait oublié de push son code sur GitHub avant la fermeture définitive du dépôt.	169	2026-04-17	2026-04-28 10:23:44.708742	2026-04-28 10:23:44.708742	\N	movies/posters/1777371824661-maman-rate-le-pa.png	1
15	La plateforme 2	Dans le futur, les étudiants sont répartis dans des salles verticales où ceux des étages supérieurs héritent de projets annuels simplistes, tandis que ceux du bas croulent sous les tâches supplémentaires. Racim et Erwan, jeunes étudiants déterminés, vont alors se battre pour renverser ce système et instaurer une équité de charge de travail pour tous.	142	2026-06-15	2026-04-28 10:54:20.006404	2026-04-28 10:54:20.006404	\N	movies/posters/1777373659862-plateforme.png	1
9	ESGI - Matrix	Kevin Trancho, enseignant de génie le jour, devient « Root » la nuit venue pour sauver l'école d'un déluge de bugs en perçant le secret de la Matrice de l'IA.	172	2026-04-28	2026-04-28 10:41:07.449885	2026-04-28 10:41:07.449885	\N	movies/posters/1777372867393-matrix.png	1
14	Le loup des AL	Le code. Les technos. Le Major de promo. La validation du diplôme. Les tentations étaient là, à portée de main, et le jury n'avait aucune prise. Aux yeux de Rémy et de sa meute, les features bonus étaient devenues indispensables ; trop n'était jamais assez.	138	2026-06-11	2026-04-28 10:52:27.49995	2026-04-28 10:52:27.49995	\N	movies/posters/1777373547441-loup-al.png	1
13	Bienvenue chez les AL	Racim, jeune étudiant d'Epitech fraîchement débarqué à l'ESGI en Architecture Logicielle, se retrouve confronté à son premier obstacle : le redoutable Projet Annuel. Contre toute attente, il découvre une filière soudée et peut compter sur Rémy, habitué des lieux et des rouages de l'école, pour l'accompagner dans cette aventure afin de valider ensemble leur année.	146	2026-06-23	2026-04-28 10:50:26.902664	2026-04-28 10:50:26.902664	\N	movies/posters/1777373426781-bienvenue-al.png	1
12	Guerre des PA	Entre le groupe d'Erwan et une équipe rivale, la guerre du PA est déclarée pour décrocher la meilleure note, une lutte acharnée où chaque commit et chaque fonctionnalité deviennent des armes pour obtenir l'ultime validation de l'année.	124	2026-05-21	2026-04-28 10:48:34.956087	2026-04-28 10:48:34.956087	\N	movies/posters/1777373314822-guerre-bouton.png	1
2	Le directeur pédagogique	En 2026, à l’ESGI, les différentes promotions forment les piliers de l'école. Sananes, le « directeur pédagogique » et grand maître de la filière Architecture Logicielle, organise le lancement du projet annuel.	169	2026-04-26	2026-04-28 10:21:16.266346	2026-04-28 10:21:16.266346	\N	movies/posters/1777371676130-directeur-pedagogique.png	1
10	Titanic	En 2026, l'épave du Titanic en VR est le théâtre d'un hackathon mémorable où des étudiants s'affrontent pour coder le futur. Frappé par le talent brut d'un participant, le « directeur pédagogique » Frédéric Sananes croise sur le pont virtuel Rémy Machavoine, un développeur de génie mais sans diplôme officiel.	143	2026-05-13	2026-04-28 10:44:46.439713	2026-04-28 10:44:46.439713	\N	movies/posters/1777373086333-titanic.png	1
8	LET'S COOK : Projet Annuel	Racim, étudiant à l'ESGI, n'a pas d'autre choix que de monter un laboratoire de développement clandestin pour valider son Projet Annuel ; après sa première compilation réussie, il bâtit un véritable empire en interne pour faire valider l'ensemble des étudiants de l'école.	161	2026-04-24	2026-04-28 10:35:49.90882	2026-04-28 10:35:49.90882	\N	movies/posters/1777372549854-let-cook.png	1
6	Projet Annuel	En 2026, l'humanité vacille face à une menace invisible mais totale : le "Bug de l'an 2026", une faille logique capable de paralyser chaque serveur de la planète. Erwan, génie du dev et pro de la tech, est choisi pour mener l'ultime contre-offensive ; il dispose exactement de 365 jours pour réécrire le noyau du monde, une mission de la dernière chance sobrement baptisée Projet Annuel.	142	2026-06-02	2026-04-28 10:30:27.307802	2026-04-28 10:30:27.307802	\N	movies/posters/1777372227238-pa.png	1
5	Il faut sauver le PA	Tandis que le projet annuel touche à sa fin, Erwan, Racim et Rémy lancent une offensive désespérée dans le code legacy pour corriger un bug critique et sauver leur année.	142	2026-05-08	2026-04-28 10:28:28.597503	2026-04-28 10:28:28.597503	\N	movies/posters/1777372108474-sauver-le-pa.png	1
4	Trancho	Un Trancho, enseignant d'aspect humain, est envoyé d'un futur où les processeurs ne comprennent plus que le binaire pur et les équations complexes. Sa mission est de trouver et de convertir chaque étudiant de l'ESGI avant qu'ils ne cèdent à la facilité du No-Code, armé de sa fidèle souris imprimée en 3D et de ses pointeurs C.	157	2026-05-01	2026-04-28 10:26:00.770161	2026-04-28 10:26:00.770161	\N	movies/posters/1777371960658-trancho.png	1
11	Back to the PA	Après avoir accidentellement déployé leur code dans une boucle temporelle, Rémy apprend par un commit vieux de cent ans que son ami Racim est resté bloqué en 1880 sans aucun accès Wi-Fi. Accompagné d'Erwan, il doit trouver un moyen de ramener toute l'équipe en 2026 avant que Monsieur Sananes ne ferme définitivement les dépôts, ne leur laissant que cinq jours pour uploader leur Projet Annuel et sauver leur diplôme.	136	2026-05-17	2026-04-28 10:47:14.975832	2026-04-28 10:47:14.975832	\N	movies/posters/1777373234916-back-pa.png	1
\.


--
-- Data for Name: movie-genre; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."movie-genre" (id, name, "createdAt", "updatedAt", "deletedAt") FROM stdin;
1	Action	2026-04-28 09:47:06.340959	2026-04-28 09:47:06.340959	\N
2	Science-Fiction	2026-04-28 09:47:13.995136	2026-04-28 09:47:13.995136	\N
3	Horreur	2026-04-28 09:47:20.298936	2026-04-28 09:47:20.298936	\N
4	Comédie	2026-04-28 09:47:26.29826	2026-04-28 09:47:26.29826	\N
5	Drame	2026-04-28 09:47:32.115669	2026-04-28 09:47:32.115669	\N
6	Fantasy	2026-04-28 09:47:37.4187	2026-04-28 09:47:37.4187	\N
7	Thriller	2026-04-28 09:47:42.54821	2026-04-28 09:47:42.54821	\N
8	Western	2026-04-28 09:47:48.161827	2026-04-28 09:47:48.161827	\N
9	Animation	2026-04-28 09:47:53.000358	2026-04-28 09:47:53.000358	\N
10	Documentaire	2026-04-28 09:48:00.616057	2026-04-28 09:48:00.616057	\N
11	Aventure	2026-04-28 09:48:08.113313	2026-04-28 09:48:08.113313	\N
12	Biopic	2026-04-28 09:48:16.028274	2026-04-28 09:48:16.028274	\N
\.


--
-- Data for Name: projection-type; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."projection-type" (id, type_name, "createdAt", "updatedAt", "deletedAt") FROM stdin;
1	Normal	2026-04-28 09:46:06.645915	2026-04-28 09:46:06.645915	\N
2	3D	2026-04-28 09:46:12.582023	2026-04-28 09:46:12.582023	\N
3	IMAX	2026-04-28 09:46:17.049815	2026-04-28 09:46:17.049815	\N
\.


--
-- Data for Name: refresh-tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."refresh-tokens" (id, token, "createdAt", user_id, expired_at) FROM stdin;
947fe626-a6b2-4bdc-8d72-461bcabc18dc	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzE5MTQyMywiZXhwIjoxNzc3Nzk2MjIzfQ.nbruJkP0V_ZX0MRgVf0P6-B18mMclf0wkHk0eethu_o	2026-04-26 08:17:03.560262	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-03 08:17:03.552
42f55dcb-2554-46b1-8586-f6cd4739668b	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzMwMTY1MCwiZXhwIjoxNzc3OTA2NDUwfQ.byrjTBYu8rFY_YV67tem5rBZ1VPxag1nYuvt1kkzy9I	2026-04-27 14:54:10.188011	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-04 16:54:10.18
8b495572-c9f6-4e85-8dc4-c97f5fed999d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzMwMTgzMywiZXhwIjoxNzc3OTA2NjMzfQ.tIRm6uXOcMnyhjmusVTaCmWcm8-7CM3uUC9gF5yL18I	2026-04-27 14:57:13.374301	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-04 16:57:13.368
dd725473-5353-4367-93d4-fe2b79ff312b	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM2ODUwMCwiZXhwIjoxNzc3OTczMzAwfQ.h86sSFq-w8HA7dgl6z8hsuyV_Cwl62Qq5UhCl8zF2os	2026-04-28 09:28:20.519576	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 11:28:20.508
26d5669b-572d-487e-9b20-9784df3792ae	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM2OTg2MiwiZXhwIjoxNzc3OTc0NjYyfQ.rjUp1iNuixOeshpMfWPM_9qS0v1xD-CRUrOOqw_9NIs	2026-04-28 09:51:02.613017	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 11:51:02.601
0a1da345-b0cc-4b1a-9a7e-017bc4fa8a08	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM3MTM2NSwiZXhwIjoxNzc3OTc2MTY1fQ.wDhbOPilZ-r4L4tmxoUycbUM9RnWTu_q9kf2LcSL3QY	2026-04-28 10:16:05.204926	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 12:16:05.185
1042745c-a620-469d-9687-bdfef81dc1e9	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM3NzQxMSwiZXhwIjoxNzc3OTgyMjExfQ.JVYDeoVlaYEpBapSyv_7weLIoTlSbv0ObAt2Ckn5Rtw	2026-04-28 11:56:51.801093	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 13:56:51.796
623451f7-53d8-4fab-aa8f-a263e38e7848	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIyMTM1ZGIzLWExNWItNGI3Zi1hM2FhLTM5NTQ5ZWY1MzMzZiIsImlhdCI6MTc3NzM3NzQxNiwiZXhwIjoxNzc3OTgyMjE2fQ.Tk6IN2WjsJTj1u7XoQTw-W0UIEFcfAg6jzdzZNlTriw	2026-04-28 11:56:56.538188	22135db3-a15b-4b7f-a3aa-39549ef5333f	2026-05-05 13:56:56.533
09788c6f-89ee-4537-bd93-53ad5acf1cfa	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRmZmQ0NDE1LTk0NWQtNDhhMS1iNTU0LTY2MTEyMzk1NDQ4NCIsImlhdCI6MTc3NzM3NzQxNiwiZXhwIjoxNzc3OTgyMjE2fQ.tikOpuqsK2ASZjnocRbLZf5ZTqGmaTU58DWlG6fRS_w	2026-04-28 11:56:56.925489	dffd4415-945d-48a1-b554-661123954484	2026-05-05 13:56:56.92
c60bcedd-318c-4576-9337-dff8d4f114a4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1NmM0ZjNhLTc4MDMtNDFmNC04ZWQzLTAyZjc3ZjJmMzQ0NCIsImlhdCI6MTc3NzM3NzQxNywiZXhwIjoxNzc3OTgyMjE3fQ.9xXrWdouNEW6qOJDzN-llNnIC7Otsz2YZmRMqtbdhVE	2026-04-28 11:56:57.276936	856c4f3a-7803-41f4-8ed3-02f77f2f3444	2026-05-05 13:56:57.271
789db28c-2f87-4076-9f80-d782d7b8926d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI0ZGM4ZTY5LTAyNmYtNGI1NS04MDVmLTI1YWU4N2FkNjNhOCIsImlhdCI6MTc3NzM3NzQxNywiZXhwIjoxNzc3OTgyMjE3fQ.2KC9fz5DnMF14mTdYsP4OXpA6S_1aH4oT_Lziax2PsU	2026-04-28 11:56:57.623177	b4dc8e69-026f-4b55-805f-25ae87ad63a8	2026-05-05 13:56:57.617
b1b9f7f0-52bf-4f60-9617-10fdeea258ab	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM3MTA0OGUwLWJhZDEtNDJhYi04OTk2LTI3MTEzYjIyZmMwNCIsImlhdCI6MTc3NzM3NzQxNywiZXhwIjoxNzc3OTgyMjE3fQ.1OafIGoBstNGjZ2XeExSkcMN_uDBhMLo2fRUomrCuTo	2026-04-28 11:56:57.975873	371048e0-bad1-42ab-8996-27113b22fc04	2026-05-05 13:56:57.971
925ac3c3-ca8c-4cb4-9148-5728a5346dfa	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFmM2JiZTIzLWUwZTEtNGMxNC04MzYwLTQ1OWFjM2U5ZWMxNSIsImlhdCI6MTc3NzM3NzQxOCwiZXhwIjoxNzc3OTgyMjE4fQ.zozyX7j8nLTxp2mTPMAwvT0C1oVrgWjdiOfOg9kNuA0	2026-04-28 11:56:58.192314	1f3bbe23-e0e1-4c14-8360-459ac3e9ec15	2026-05-05 13:56:58.187
6d7a2b63-5350-40ee-ab26-926d5b4ab8ba	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhiNjVmYzEzLWQ4ZjYtNGIyZi1iNDZlLTg1MTBlYzJkMDdlNiIsImlhdCI6MTc3NzM3NzQxOCwiZXhwIjoxNzc3OTgyMjE4fQ.ghgOYq2VFHuqRI1se0Ybx0brphVIkwIJdhIUSzmbmWM	2026-04-28 11:56:58.541062	8b65fc13-d8f6-4b2f-b46e-8510ec2d07e6	2026-05-05 13:56:58.536
5831ded7-d4b0-41d8-b057-b32d012a6f02	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIzY2RiZmIyLTQ1N2ItNDcwOC05ODI0LWIzNjFhZjNmODJjZSIsImlhdCI6MTc3NzM3NzQxOCwiZXhwIjoxNzc3OTgyMjE4fQ.1XRmm7fiWlhv4FyKfSVxhhxDhNTLUWTcMsqj8aGNZg4	2026-04-28 11:56:58.892062	23cdbfb2-457b-4708-9824-b361af3f82ce	2026-05-05 13:56:58.886
dd595de6-89f7-4d58-ad1d-4884c348648d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ5M2FiYTI5LWUxZTQtNGU4ZC1iNDE0LWRmZTI4MjI2YmU4ZSIsImlhdCI6MTc3NzM3NzQxOSwiZXhwIjoxNzc3OTgyMjE5fQ.ucYrstbbJl4ASdRaeejP9AIc1_macglIp4f6VNz1Ehc	2026-04-28 11:56:59.232492	493aba29-e1e4-4e8d-b414-dfe28226be8e	2026-05-05 13:56:59.227
770cd051-aeeb-4dba-81ba-81b0e6fc9bad	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJiMDI2ZWQxLTgzNDgtNDY1ZC1hYjIxLTQ3ZmVmOWQzNjdlYSIsImlhdCI6MTc3NzM3NzQxOSwiZXhwIjoxNzc3OTgyMjE5fQ.TYhnhP_iEvQFUKeOBPjKYk7RDMgZwwe2zeX5orll-Z8	2026-04-28 11:56:59.590682	bb026ed1-8348-465d-ab21-47fef9d367ea	2026-05-05 13:56:59.585
562b72eb-7ccc-4871-8d8c-18bf163abcfd	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJhMmRjNjYzLWM1ZDMtNDEzMi1hMjM4LTg2M2I0MDc5YmY2NCIsImlhdCI6MTc3NzM3NzQxOSwiZXhwIjoxNzc3OTgyMjE5fQ.89iLFWBky9tULiVesRcA2HmEKguhCg_ZzM0ly4llRPo	2026-04-28 11:56:59.943751	2a2dc663-c5d3-4132-a238-863b4079bf64	2026-05-05 13:56:59.939
f8491e8b-8be8-42aa-9456-86acb804cda5	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhiMGMyZmVmLWI2ZTQtNDdlMS04ZDZiLWQ1MGEwODk2MTZlMiIsImlhdCI6MTc3NzM3NzQyMCwiZXhwIjoxNzc3OTgyMjIwfQ.Oc1eEdqWuH1H7N6Zvb7fR17PqRa1EKOK3NVrWc6er-0	2026-04-28 11:57:00.297271	8b0c2fef-b6e4-47e1-8d6b-d50a089616e2	2026-05-05 13:57:00.291
3448fb04-24a4-4c34-b644-0ccb0a6e7876	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM3NzUwNSwiZXhwIjoxNzc3OTgyMzA1fQ.F6lAjTo6zlxNbWDIifLXmNAqCZeU_XRuZpGUOhN9dnU	2026-04-28 11:58:25.906416	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 13:58:25.901
576b13c9-41c7-4e60-9cd5-6d0a6eef7632	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM3ODYzNiwiZXhwIjoxNzc3OTgzNDM2fQ.PGy7Wcns0mH7iTvEpPzhV_avfiJdTYO6LqO5eN_zk5I	2026-04-28 12:17:16.488603	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 14:17:16.483
6b29e5c9-fd78-49ca-89ce-6e39db7389aa	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY4ZDcxYWQyLWQ3YjMtNDUwYS1hMTNjLWI4ODljMGEwYmJkZCIsImlhdCI6MTc3NzM3ODYzNiwiZXhwIjoxNzc3OTgzNDM2fQ.DPeHTHIOh-7yXFgT8GOTXcHVKR0bRVY6ctsMpK-8Cw4	2026-04-28 12:17:16.712607	f8d71ad2-d7b3-450a-a13c-b889c0a0bbdd	2026-05-05 14:17:16.707
3645839f-45b3-4fbd-aa1f-fbd3c4233962	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNGU2ZWQyLTFjYTYtNDYzMy1iMDJhLTJhODA0ZTNiOGZhNiIsImlhdCI6MTc3NzM3ODYzNiwiZXhwIjoxNzc3OTgzNDM2fQ.hsoNY7XBozACt63UoVPzQ0z8ClAhtQbVdawF-7bfOQU	2026-04-28 12:17:16.956479	634e6ed2-1ca6-4633-b02a-2a804e3b8fa6	2026-05-05 14:17:16.951
de12f52b-9033-4b51-bf8c-699fc592bfb8	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjljOWQxOTM5LTg5YzUtNDQ3NC1hODA4LTMxNTJmMGM5YjliNiIsImlhdCI6MTc3NzM3ODYzNywiZXhwIjoxNzc3OTgzNDM3fQ.wDPPmtIvy9veJzC_kZgR4K85_MFrBL1Cf3I7x0lYhjQ	2026-04-28 12:17:17.197675	9c9d1939-89c5-4474-a808-3152f0c9b9b6	2026-05-05 14:17:17.192
0fcabd92-cdca-455a-a6ba-3db56107433d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODlhZmQ3LWFjNWQtNDk0YS1hNTAxLTg3MTcyYTI0NjRhNCIsImlhdCI6MTc3NzM3ODYzNywiZXhwIjoxNzc3OTgzNDM3fQ.HkPF3XS1aGFxgcW7r0EikZHNVkzQA1MBoPqwghqLnPg	2026-04-28 12:17:17.43936	6189afd7-ac5d-494a-a501-87172a2464a4	2026-05-05 14:17:17.434
dcf90c3a-7d62-4cd8-835f-ead478a8bdb6	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIxZjNmOWNiLTUzY2YtNDEwZS04NTEzLTI3NDcwZDg5ZWMxYiIsImlhdCI6MTc3NzM3ODYzNywiZXhwIjoxNzc3OTgzNDM3fQ.zwYaLymFbNLuedijg6lzwqGxd8ZDU6vhq3Bq2AwNubI	2026-04-28 12:17:17.684051	b1f3f9cb-53cf-410e-8513-27470d89ec1b	2026-05-05 14:17:17.678
b6d753cc-2d23-4a85-97a9-7b287965940f	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE0NjM3YzcyLTFlODEtNDZhMy05MjMyLTY2NDFkZmMzYzM1ZSIsImlhdCI6MTc3NzM3ODYzNywiZXhwIjoxNzc3OTgzNDM3fQ.ZESwhViYpgRf1uC_cUnkw0Dz2fNeSbnE6vy88vRBJ0c	2026-04-28 12:17:17.928401	a4637c72-1e81-46a3-9232-6641dfc3c35e	2026-05-05 14:17:17.924
2aee995f-dbdf-49f0-a2a2-83122dbb311a	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBhNjg3MGViLWNlNDUtNDU3NS05NzljLWMzMjc2ZGNmNjQ2YyIsImlhdCI6MTc3NzM3ODYzOCwiZXhwIjoxNzc3OTgzNDM4fQ.hxHh2ebJrhLsvwnFzX3uco069V96i1dUU8Uulag4bG0	2026-04-28 12:17:18.166737	0a6870eb-ce45-4575-979c-c3276dcf646c	2026-05-05 14:17:18.162
4e976c65-da84-49aa-a7e6-ca395bb89a53	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYzMDljMjBhLWE3NDctNDIyNS1hNWYwLWY2ZDY1MzE4YWFhMSIsImlhdCI6MTc3NzM3ODYzOCwiZXhwIjoxNzc3OTgzNDM4fQ.c-4zUc6Pk8Ie6wvCAQGSgckiPNRuyXaE62BpSlWgX3M	2026-04-28 12:17:18.410949	f309c20a-a747-4225-a5f0-f6d65318aaa1	2026-05-05 14:17:18.406
12e2ef7f-defb-42c2-afc7-02fe5c4bf2b9	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI4ZTM4MDExLTBmMzItNDVjMC1hMDUyLTg5NTk3ZjY4MDI1MiIsImlhdCI6MTc3NzM3ODYzOCwiZXhwIjoxNzc3OTgzNDM4fQ.T41oVJZxfDqfYpWN-ffW-BrbUGlro5DDbKMB1GiKpZM	2026-04-28 12:17:18.651461	b8e38011-0f32-45c0-a052-89597f680252	2026-05-05 14:17:18.646
ff6c7b3d-48ca-456d-a4c2-21590af5fedb	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM4MWIzYWI4LTQ4NWMtNDM0Mi1iNzNiLWIxODE5Yzc5NzhiNSIsImlhdCI6MTc3NzM3ODYzOCwiZXhwIjoxNzc3OTgzNDM4fQ.BPjMFc9GN5XrQ3ML5M5sBDcKv6wUBZg76HAKsWug0eA	2026-04-28 12:17:18.89168	381b3ab8-485c-4342-b73b-b1819c7978b5	2026-05-05 14:17:18.886
ebc356d3-2d70-4800-a9ac-b9a1d6c61d26	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM5M2Q1YjJkLTk3NDgtNGE1OS05YTAyLWQ4YTg3ZTAxOTZhMiIsImlhdCI6MTc3NzM3ODYzOSwiZXhwIjoxNzc3OTgzNDM5fQ.SSqvEO41MRcdGoIipuyYdtyiuCFeBOsaK0ToCNmOIG4	2026-04-28 12:17:19.138513	393d5b2d-9748-4a59-9a02-d8a87e0196a2	2026-05-05 14:17:19.133
27a0c94f-e49b-477c-b748-aa2251aae3fb	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc1OGVjNTE0LWY2MmItNDA0My05NTZkLTA1YzQzMWI3MjlmZiIsImlhdCI6MTc3NzM3ODYzOSwiZXhwIjoxNzc3OTgzNDM5fQ.82-QLC7O5U8lhouXS7JGwFPriuE4EAQCwuIXCRJdimY	2026-04-28 12:17:19.380484	758ec514-f62b-4043-956d-05c431b729ff	2026-05-05 14:17:19.375
e685d983-1638-4a38-8939-269e1127992b	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwNTA2MTFkLWRmMzItNDNlMC1hN2VkLTE0ZDA1OTc3MjFiNiIsImlhdCI6MTc3NzM3ODYzOSwiZXhwIjoxNzc3OTgzNDM5fQ.7XkZEiVPvh_6bmxaA3PQyWj66dyXK0UCINwvR-cAsDc	2026-04-28 12:17:19.618647	0050611d-df32-43e0-a7ed-14d0597721b6	2026-05-05 14:17:19.613
47751b1f-620f-491f-bd04-d3fdadb48d89	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgyOGRjMTMwLWQzMDAtNGY5MC05M2M4LWU5MDA1ODRjMDhlZSIsImlhdCI6MTc3NzM3ODYzOSwiZXhwIjoxNzc3OTgzNDM5fQ.PECw0Y3y8OEShvAZs5oxjNkakMyaQuRCskyjc6xrkGs	2026-04-28 12:17:19.858363	828dc130-d300-4f90-93c8-e900584c08ee	2026-05-05 14:17:19.854
4e47e15a-4e72-4c9e-9624-0e26a96ce819	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA3ZDhhMDcwLTVjZTYtNGFmOS1iODdmLWQ1OTUyYjU0ZDA4NyIsImlhdCI6MTc3NzM3ODY0MCwiZXhwIjoxNzc3OTgzNDQwfQ.dHHmBGIvq2G2WLJxNMALc-ZEQg67gVXd72ZJg-ZUSeY	2026-04-28 12:17:20.10028	07d8a070-5ce6-4af9-b87f-d5952b54d087	2026-05-05 14:17:20.095
8a07caf9-98b1-4dc3-8e28-b951c6221a28	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJlZmZhMDJmLWNjMjctNDYwYy04NDhmLTJlOTJjOTUxNWExZSIsImlhdCI6MTc3NzM3ODY0MCwiZXhwIjoxNzc3OTgzNDQwfQ.2vwLBHmrEj1XBCDqIOHo4vp49BKmd8tb-F4rfpmKXRk	2026-04-28 12:17:20.340323	2effa02f-cc27-460c-848f-2e92c9515a1e	2026-05-05 14:17:20.335
ebe643e0-a309-47b2-8cb9-1d68d4b8e763	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRmNWRmM2RlLTU3OTYtNDRkOC1iZWFhLWM5YWNlOTIwYmMxMyIsImlhdCI6MTc3NzM3ODY0MCwiZXhwIjoxNzc3OTgzNDQwfQ.ABZ1M9QNaSvPfEJgm31gl9EAEb1Xy1_WOWS3VDsqvow	2026-04-28 12:17:20.580636	4f5df3de-5796-44d8-beaa-c9ace920bc13	2026-05-05 14:17:20.576
1144d01d-a253-40c9-a535-f5b2b3ffe8ac	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkNmExNTMwLTkzNzktNGUyNi04ZGVhLTkxZWU2OWJjMTI4MSIsImlhdCI6MTc3NzM3ODY0MCwiZXhwIjoxNzc3OTgzNDQwfQ.7PSxps2pYwIeSg5k8GoNY-QKTjw6VXtmWFgSuDsS5JI	2026-04-28 12:17:20.833494	ad6a1530-9379-4e26-8dea-91ee69bc1281	2026-05-05 14:17:20.828
42ac816c-532c-4709-aa89-e08bbb592f7c	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjljMjgyNjFhLTU2ZjUtNDI0ZC04OGE1LWE3ZjllNmM0NjVhNSIsImlhdCI6MTc3NzM3ODY0MSwiZXhwIjoxNzc3OTgzNDQxfQ.ZXHUoAcJz_uRHhlFt3Ozu7Z9_3O7ksFtG2PpYeh_VlE	2026-04-28 12:17:21.078964	9c28261a-56f5-424d-88a5-a7f9e6c465a5	2026-05-05 14:17:21.074
6941a720-fbda-4e34-80f7-3f73f68e7ac4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNkNWViNzE4LTMwOTEtNDc4Zi1iYzEyLTEzMDkxYWYwMTdkYyIsImlhdCI6MTc3NzM3ODY0MSwiZXhwIjoxNzc3OTgzNDQxfQ.-ybJDcshoT3DLvkd5Jb3hffgx5X9oT7xpZmjrIV3Gs0	2026-04-28 12:17:21.321208	cd5eb718-3091-478f-bc12-13091af017dc	2026-05-05 14:17:21.316
aa830f53-c591-45be-bcf2-48ba7abe13bf	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg2MTE3ODYyLTUzNTUtNGJmZC1hOGIzLWUwNjgyNGY0YWYyNiIsImlhdCI6MTc3NzM3ODY0MSwiZXhwIjoxNzc3OTgzNDQxfQ.hZNPxhptQyEldeZFo6iz2mQptQWTGcr78nsu2kz2YtA	2026-04-28 12:17:21.561231	86117862-5355-4bfd-a8b3-e06824f4af26	2026-05-05 14:17:21.556
9609abec-9bd6-414b-a8d8-133236776d06	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA0MGRlYzBkLWNkZDEtNDNmZC1iYTM2LWZkZDlmOTczMWQ1YiIsImlhdCI6MTc3NzM3ODY0MSwiZXhwIjoxNzc3OTgzNDQxfQ.0U4CdAqdHfEmTFSOaEHdcmz9Q5Q8351k22nb8a0MCoc	2026-04-28 12:17:21.806282	040dec0d-cdd1-43fd-ba36-fdd9f9731d5b	2026-05-05 14:17:21.801
a1bf758f-77df-4b2a-b017-234df2f18d83	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNjU4MzJmLWJiZmQtNDcyNy1hM2M3LWIzZTdmZDlkOTJkZiIsImlhdCI6MTc3NzM3ODY0MiwiZXhwIjoxNzc3OTgzNDQyfQ.8WfRpbhCA07zbkO1b5LY3gVYXcZyHEU9rIAQ6mORUhg	2026-04-28 12:17:22.048385	6165832f-bbfd-4727-a3c7-b3e7fd9d92df	2026-05-05 14:17:22.042
a8613be6-cd04-42f0-8376-7bacd5b0a9f2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE3YWU2ZTg4LTZkMDAtNDVmZC1iOWI4LTdlMjk5MjNiZjY5NCIsImlhdCI6MTc3NzM3ODY0MiwiZXhwIjoxNzc3OTgzNDQyfQ.YMRCcbP_M7Z1iwwT_GinCIzYR7to1-3i-uY9iBFMqQw	2026-04-28 12:17:22.289081	a7ae6e88-6d00-45fd-b9b8-7e29923bf694	2026-05-05 14:17:22.283
8812c670-dd4a-4b98-ba48-37469eedb540	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFjOWZmZGYzLTRiMjYtNGQyNC04NGQzLTkxYmU3NjNmMDllZSIsImlhdCI6MTc3NzM3ODY0MiwiZXhwIjoxNzc3OTgzNDQyfQ.7fSB95Fd_i8REmd_PMuAh_ap_fhcjTPsCyhrHyGG2wQ	2026-04-28 12:17:22.537566	1c9ffdf3-4b26-4d24-84d3-91be763f09ee	2026-05-05 14:17:22.532
686d3827-6fc8-4581-9d35-20605988857d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZjYTM0MDZhLTIwYWEtNDY4NC1iMDY2LWNmZTc5MzYxZTk4YSIsImlhdCI6MTc3NzM3ODY0MiwiZXhwIjoxNzc3OTgzNDQyfQ.RhC9J0NGTVPIvXfHbteD6kQN8IhQ4XQh9MNmwPfM5V4	2026-04-28 12:17:22.778212	6ca3406a-20aa-4684-b066-cfe79361e98a	2026-05-05 14:17:22.773
ef2b6e63-bd2d-47b3-ae3e-8f6049d4de94	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVlMDEyY2M0LWU5YjctNGMxZi05MDc4LTcwNzgzZDg0MWQyOCIsImlhdCI6MTc3NzM3ODY0MywiZXhwIjoxNzc3OTgzNDQzfQ.yAsWYK7cmkmj56UyGODWzLOAJB29TqbwEV1CsnETQ2I	2026-04-28 12:17:23.029359	ee012cc4-e9b7-4c1f-9078-70783d841d28	2026-05-05 14:17:23.014
b2c30b73-fb7e-4db5-b077-37f6bdb55bdc	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNhNjRmOWM4LWNlY2QtNDkzZC1iNDQ4LTZkODI3MDkxMWJmNiIsImlhdCI6MTc3NzM3ODY0MywiZXhwIjoxNzc3OTgzNDQzfQ.GesbFZn_eC4VfL3pPp6FB9bGn_g4iMbZAXWc4m2gJlc	2026-04-28 12:17:23.282702	ca64f9c8-cecd-493d-b448-6d8270911bf6	2026-05-05 14:17:23.277
d6a0ef7e-3965-49d8-8fa6-3c3afaf7b7cb	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc3NzY5N2U0LWYyOGMtNDcyYy04ZDBiLThhMjY1MjlmOWI5NiIsImlhdCI6MTc3NzM3ODY0MywiZXhwIjoxNzc3OTgzNDQzfQ.JG7BxZyyB46ppJgvpxKiIlDf6wnghWj9LHNLWgK4Gfo	2026-04-28 12:17:23.526703	777697e4-f28c-472c-8d0b-8a26529f9b96	2026-05-05 14:17:23.521
3b84bfa5-2039-4d9c-9b61-5aa5b42bf563	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ4YTc1ODYwLWQyMWQtNDc0MS05ZTQ3LTAxZjNiZmNjZjQ1YiIsImlhdCI6MTc3NzM3ODY0MywiZXhwIjoxNzc3OTgzNDQzfQ.uld-gKV88bKDDAzLFO_Xuscr1l-_NHi4r5gXCwKf0oQ	2026-04-28 12:17:23.786429	d8a75860-d21d-4741-9e47-01f3bfccf45b	2026-05-05 14:17:23.781
0ca6e87d-974b-49e3-8b32-92a5305b1ca6	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3YWI4NTkxLTljNGUtNDI2Yy05MWEzLTI5M2Q0NjBiOGUzNyIsImlhdCI6MTc3NzM3ODY0NCwiZXhwIjoxNzc3OTgzNDQ0fQ.JHXuGSenbiEkfuV3BAG76XwJpHmucjmkgivVgRRfMCE	2026-04-28 12:17:24.029385	57ab8591-9c4e-426c-91a3-293d460b8e37	2026-05-05 14:17:24.024
42c3fdb5-e744-40fe-aee1-b52833939bd5	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImUxMjBmYWQwLTVhODAtNDRkNC05YmI3LTk3NjI0MjRkYjk4ZSIsImlhdCI6MTc3NzM3ODY0NCwiZXhwIjoxNzc3OTgzNDQ0fQ.a-ERt2Rbiy8iy5BpndpBMa8uPCPi3NyJloBh5J094rc	2026-04-28 12:17:24.273397	e120fad0-5a80-44d4-9bb7-9762424db98e	2026-05-05 14:17:24.269
c9a5e9c6-7137-4832-b508-497a9a0c3093	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNkNTVlMjIxLWYzZDYtNDcxZS05NjA3LWZjZWFhNmUyYTI0YiIsImlhdCI6MTc3NzM3ODY0NCwiZXhwIjoxNzc3OTgzNDQ0fQ.ErQcYWql6cZQT9Ii37T8wk6JhfdCT6ADZ2PcglmvHXQ	2026-04-28 12:17:24.513777	cd55e221-f3d6-471e-9607-fceaa6e2a24b	2026-05-05 14:17:24.508
21846f14-fb8f-49ce-85b5-b2c44ffa7db8	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRmYWRkZTJkLWY1OTctNGMwZS1iZjBiLWFiNjhlMDU5YTIwNSIsImlhdCI6MTc3NzM3ODY0NCwiZXhwIjoxNzc3OTgzNDQ0fQ.lgG0N5S1cO-gmdqA2Jj2NMb3iE0GtthNrGD4nuiHBQ4	2026-04-28 12:17:24.752827	4fadde2d-f597-4c0e-bf0b-ab68e059a205	2026-05-05 14:17:24.748
e596ccf3-bd70-4e68-8a3b-fc2757036fa3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNlNGNiNjA5LTM4YWItNDRmMC05ZTYzLWY1YzAwNzQwZDhlNCIsImlhdCI6MTc3NzM3ODY0NCwiZXhwIjoxNzc3OTgzNDQ0fQ.ESfrAmUxLA6xJ7cPpPMEfhtXpqFVzhgU3uSPiqPgUos	2026-04-28 12:17:24.996407	3e4cb609-38ab-44f0-9e63-f5c00740d8e4	2026-05-05 14:17:24.991
4d3625f5-2b4e-4c75-8ba6-385cfc4cc4f4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJmNTNhMTFlLWE4MDYtNGJlMy1iYTEzLTI1ZjU2ZGExZWYwNiIsImlhdCI6MTc3NzM3ODY0NSwiZXhwIjoxNzc3OTgzNDQ1fQ.tVSdP2KjUCUsAL6mZVgR8rDvqIhjm-9rCs4eJuHP6AA	2026-04-28 12:17:25.238414	2f53a11e-a806-4be3-ba13-25f56da1ef06	2026-05-05 14:17:25.233
e78422fb-05e8-4273-8dec-40a41523be50	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcxOThkN2U1LTFiN2MtNGI4NS1iNmY2LTNiZjBjYmRmZjEzMiIsImlhdCI6MTc3NzM3ODY0NSwiZXhwIjoxNzc3OTgzNDQ1fQ.rwituyRCUrXS_4vIkVvGuPzbEz92L6XbYxexcOHooNM	2026-04-28 12:17:25.481776	7198d7e5-1b7c-4b85-b6f6-3bf0cbdff132	2026-05-05 14:17:25.476
12140a3d-f570-4202-819c-6d39dc3a60b1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc4ZWE2NDM1LTdkOGEtNGY5Zi04Y2YzLTczMWQzM2Q1YzhkYiIsImlhdCI6MTc3NzM3ODY0NSwiZXhwIjoxNzc3OTgzNDQ1fQ.kH-TpjGj8MfPVbKwoAi-95R5xM09REeNpaKBagOurss	2026-04-28 12:17:25.72554	78ea6435-7d8a-4f9f-8cf3-731d33d5c8db	2026-05-05 14:17:25.72
9bfaff53-3263-4f7a-8c6f-b6f51bf09fbe	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIxZjA1Y2Q5LTViZjktNDliZS1hMzdiLWQzNGYzOGUwYzhlZiIsImlhdCI6MTc3NzM3ODY0NSwiZXhwIjoxNzc3OTgzNDQ1fQ.T_BfgLkoO4CHmhZej3S5dSXxS9pALsRkLE-6eJubq0k	2026-04-28 12:17:25.968151	b1f05cd9-5bf9-49be-a37b-d34f38e0c8ef	2026-05-05 14:17:25.963
f9265e98-dd35-4df7-bef9-bb97a4c81cb5	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJhYTA4YmNlLTQxMTQtNDg1MS1iMjFkLTIxNGRiMmI5NGY1MCIsImlhdCI6MTc3NzM3ODY0NiwiZXhwIjoxNzc3OTgzNDQ2fQ.HMk677unpscFyDq2r25y-CbQOCgiC1MUmaPg_VDLDRA	2026-04-28 12:17:26.208525	baa08bce-4114-4851-b21d-214db2b94f50	2026-05-05 14:17:26.203
19fa79ea-beef-49b6-916e-e36f6088e132	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM3ODk4MSwiZXhwIjoxNzc3OTgzNzgxfQ.CymBiB64JCEy9-a2Nzr8g1bzE9eJSDLao2ai7XrTmvw	2026-04-28 12:23:01.519176	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 14:23:01.512
959048b6-a4c2-4357-873f-e38292bc2b2c	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY4ZDcxYWQyLWQ3YjMtNDUwYS1hMTNjLWI4ODljMGEwYmJkZCIsImlhdCI6MTc3NzM3ODk4MSwiZXhwIjoxNzc3OTgzNzgxfQ.7CAc1xqnEdZbKzc6doZ_-hNvIb1FVMYlhon1KSH6Ucg	2026-04-28 12:23:01.667189	f8d71ad2-d7b3-450a-a13c-b889c0a0bbdd	2026-05-05 14:23:01.662
9b5bb2b3-038a-4dbf-b31b-07cff021eae1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNGU2ZWQyLTFjYTYtNDYzMy1iMDJhLTJhODA0ZTNiOGZhNiIsImlhdCI6MTc3NzM3ODk4MSwiZXhwIjoxNzc3OTgzNzgxfQ.2c5XlGt_eg1kNRRpZ8dMvNmm5FOEdczEsl08nUgHWbA	2026-04-28 12:23:01.834417	634e6ed2-1ca6-4633-b02a-2a804e3b8fa6	2026-05-05 14:23:01.829
e25d67c8-c51b-45b4-a8c0-74590559687a	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjljOWQxOTM5LTg5YzUtNDQ3NC1hODA4LTMxNTJmMGM5YjliNiIsImlhdCI6MTc3NzM3ODk4MSwiZXhwIjoxNzc3OTgzNzgxfQ.3aOpmlLy-LqtI7WSPXYTyG_QcYnKT9DQ7DhkylrPCtk	2026-04-28 12:23:01.997488	9c9d1939-89c5-4474-a808-3152f0c9b9b6	2026-05-05 14:23:01.992
8c0422d3-0cce-4056-8de9-42ae55fea7a3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxODlhZmQ3LWFjNWQtNDk0YS1hNTAxLTg3MTcyYTI0NjRhNCIsImlhdCI6MTc3NzM3ODk4MiwiZXhwIjoxNzc3OTgzNzgyfQ.A2ZaZt_3deZKB29V7WRMXUSSKx1GLWcjX1WIujESQ2g	2026-04-28 12:23:02.156769	6189afd7-ac5d-494a-a501-87172a2464a4	2026-05-05 14:23:02.151
a07a5c76-529e-4aeb-97cd-1f4f2eb59c6d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIxZjNmOWNiLTUzY2YtNDEwZS04NTEzLTI3NDcwZDg5ZWMxYiIsImlhdCI6MTc3NzM3ODk4MiwiZXhwIjoxNzc3OTgzNzgyfQ.LpEklGiD0h2aBaI54AGZsr5zz8zSZfAL-ch2rmB1bI4	2026-04-28 12:23:02.318121	b1f3f9cb-53cf-410e-8513-27470d89ec1b	2026-05-05 14:23:02.312
6def91e9-c47f-4e9a-b82d-5631d53861e9	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE0NjM3YzcyLTFlODEtNDZhMy05MjMyLTY2NDFkZmMzYzM1ZSIsImlhdCI6MTc3NzM3ODk4MiwiZXhwIjoxNzc3OTgzNzgyfQ.hDZ5YTxRO2Gw3a2UqBF_vbucn9KmgT_cDwhVIuUkoZ0	2026-04-28 12:23:02.479812	a4637c72-1e81-46a3-9232-6641dfc3c35e	2026-05-05 14:23:02.475
bcc9d109-c911-4656-bde3-1c41d13e5420	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBhNjg3MGViLWNlNDUtNDU3NS05NzljLWMzMjc2ZGNmNjQ2YyIsImlhdCI6MTc3NzM3ODk4MiwiZXhwIjoxNzc3OTgzNzgyfQ.3VT49UPWvxzG92mU3Oldt5qwLAFSle_TX-m1rcS65CY	2026-04-28 12:23:02.640088	0a6870eb-ce45-4575-979c-c3276dcf646c	2026-05-05 14:23:02.634
ce1b5e4f-67b6-41c6-a89f-004e079bed2e	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYzMDljMjBhLWE3NDctNDIyNS1hNWYwLWY2ZDY1MzE4YWFhMSIsImlhdCI6MTc3NzM3ODk4MiwiZXhwIjoxNzc3OTgzNzgyfQ.AbQB7pn3h6saz4kI9GqaTKy2HXxhwEciymrQD5osnFQ	2026-04-28 12:23:02.802123	f309c20a-a747-4225-a5f0-f6d65318aaa1	2026-05-05 14:23:02.797
c2b4519f-7679-4a08-86e1-b65a1e057d49	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI4ZTM4MDExLTBmMzItNDVjMC1hMDUyLTg5NTk3ZjY4MDI1MiIsImlhdCI6MTc3NzM3ODk4MiwiZXhwIjoxNzc3OTgzNzgyfQ.JiS4kSfWK9D2vF2OVNDPPxcl8cXfXxCirN7wseFE8y8	2026-04-28 12:23:02.96033	b8e38011-0f32-45c0-a052-89597f680252	2026-05-05 14:23:02.955
07b2033b-ceac-43e4-8a97-aa76dc5f2b06	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM4MWIzYWI4LTQ4NWMtNDM0Mi1iNzNiLWIxODE5Yzc5NzhiNSIsImlhdCI6MTc3NzM3ODk4MywiZXhwIjoxNzc3OTgzNzgzfQ.Sj2F4kbzRNkpyfqe3HSPOKWeWboq7HLY06zXder6KUk	2026-04-28 12:23:03.12003	381b3ab8-485c-4342-b73b-b1819c7978b5	2026-05-05 14:23:03.115
d1313ff7-3543-4c8a-9281-1b2e86bbaf7a	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM5M2Q1YjJkLTk3NDgtNGE1OS05YTAyLWQ4YTg3ZTAxOTZhMiIsImlhdCI6MTc3NzM3ODk4MywiZXhwIjoxNzc3OTgzNzgzfQ.ZSxU7vXyxZfdct1hVuPrIYeuvXQAeirQJPe4kbiJPQo	2026-04-28 12:23:03.281478	393d5b2d-9748-4a59-9a02-d8a87e0196a2	2026-05-05 14:23:03.276
f9324aa0-b328-4984-9884-2d9c9769940c	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc1OGVjNTE0LWY2MmItNDA0My05NTZkLTA1YzQzMWI3MjlmZiIsImlhdCI6MTc3NzM3ODk4MywiZXhwIjoxNzc3OTgzNzgzfQ.zv4Yn5ayPvYfk2J9UrCyvkvCLDqkulzXpH89vlzq5D4	2026-04-28 12:23:03.439158	758ec514-f62b-4043-956d-05c431b729ff	2026-05-05 14:23:03.434
27c406b1-d6e7-446d-b1d1-30098427eecf	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAwNTA2MTFkLWRmMzItNDNlMC1hN2VkLTE0ZDA1OTc3MjFiNiIsImlhdCI6MTc3NzM3ODk4MywiZXhwIjoxNzc3OTgzNzgzfQ.bCmfPgvZCwESSpgzZV4ExCqw2j4WfmunfkwweBSQa2w	2026-04-28 12:23:03.598545	0050611d-df32-43e0-a7ed-14d0597721b6	2026-05-05 14:23:03.593
07a5aff5-1ce8-4445-a332-e021feedba01	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgyOGRjMTMwLWQzMDAtNGY5MC05M2M4LWU5MDA1ODRjMDhlZSIsImlhdCI6MTc3NzM3ODk4MywiZXhwIjoxNzc3OTgzNzgzfQ.C12PNWUBOV7iX6enp_O6d0HUHIS8S8nPiivZqcObiVs	2026-04-28 12:23:03.757385	828dc130-d300-4f90-93c8-e900584c08ee	2026-05-05 14:23:03.752
f6c5dad1-95fc-4c50-b234-e03e1c28e723	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA3ZDhhMDcwLTVjZTYtNGFmOS1iODdmLWQ1OTUyYjU0ZDA4NyIsImlhdCI6MTc3NzM3ODk4MywiZXhwIjoxNzc3OTgzNzgzfQ.y_gbH81nzAju5T2-dsqb3pY6nxPb-rs2OTol6etjsvo	2026-04-28 12:23:03.915063	07d8a070-5ce6-4af9-b87f-d5952b54d087	2026-05-05 14:23:03.909
7b3b121e-0d38-4c2b-a800-6925058a71ba	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJlZmZhMDJmLWNjMjctNDYwYy04NDhmLTJlOTJjOTUxNWExZSIsImlhdCI6MTc3NzM3ODk4NCwiZXhwIjoxNzc3OTgzNzg0fQ.sOeaepjLE9lrL_8Z9zYv8Q5CqP8pd07fkpUHlkzOHaA	2026-04-28 12:23:04.077456	2effa02f-cc27-460c-848f-2e92c9515a1e	2026-05-05 14:23:04.072
ebb01de2-ade6-46e0-b694-efca178437aa	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRmNWRmM2RlLTU3OTYtNDRkOC1iZWFhLWM5YWNlOTIwYmMxMyIsImlhdCI6MTc3NzM3ODk4NCwiZXhwIjoxNzc3OTgzNzg0fQ.5IXUnn6Ott_KSih2mYqfY58cAGEv1M3270vI_B1LQAU	2026-04-28 12:23:04.23766	4f5df3de-5796-44d8-beaa-c9ace920bc13	2026-05-05 14:23:04.232
1e9e6823-eab2-4a54-966e-331f1cb1f1c1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkNmExNTMwLTkzNzktNGUyNi04ZGVhLTkxZWU2OWJjMTI4MSIsImlhdCI6MTc3NzM3ODk4NCwiZXhwIjoxNzc3OTgzNzg0fQ.OhtL7AtPSfSpCBtOe6QHdnNc5IoH4bpjcDIlbyOD6Eg	2026-04-28 12:23:04.398371	ad6a1530-9379-4e26-8dea-91ee69bc1281	2026-05-05 14:23:04.393
593a88b5-be32-462b-99ed-70a5811dd1a4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjljMjgyNjFhLTU2ZjUtNDI0ZC04OGE1LWE3ZjllNmM0NjVhNSIsImlhdCI6MTc3NzM3ODk4NCwiZXhwIjoxNzc3OTgzNzg0fQ.F3viG6hFhQecehAksYRJchl9kDWqsesWYdX7EB82dZ0	2026-04-28 12:23:04.557453	9c28261a-56f5-424d-88a5-a7f9e6c465a5	2026-05-05 14:23:04.553
7b38cf68-293d-413c-97b7-645546e397cb	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNkNWViNzE4LTMwOTEtNDc4Zi1iYzEyLTEzMDkxYWYwMTdkYyIsImlhdCI6MTc3NzM3ODk4NCwiZXhwIjoxNzc3OTgzNzg0fQ.COcnSHYvRv9GfPflA1-JjnFru2aGr3znYNLZIZYOo48	2026-04-28 12:23:04.716708	cd5eb718-3091-478f-bc12-13091af017dc	2026-05-05 14:23:04.712
02f566ca-5eda-416f-ad28-d8191f53ecd9	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg2MTE3ODYyLTUzNTUtNGJmZC1hOGIzLWUwNjgyNGY0YWYyNiIsImlhdCI6MTc3NzM3ODk4NCwiZXhwIjoxNzc3OTgzNzg0fQ.f7-XYabzwvKK-tvL7zZ3TY6vAVtzxh2f4XH26mopEsI	2026-04-28 12:23:04.877567	86117862-5355-4bfd-a8b3-e06824f4af26	2026-05-05 14:23:04.872
88e82585-4169-4e29-85de-8388410b45e5	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA0MGRlYzBkLWNkZDEtNDNmZC1iYTM2LWZkZDlmOTczMWQ1YiIsImlhdCI6MTc3NzM3ODk4NSwiZXhwIjoxNzc3OTgzNzg1fQ.N6MlqcwQQNzPqRxVCfLnc8d9vZj6E3Uwo4W8-WzuSgc	2026-04-28 12:23:05.036773	040dec0d-cdd1-43fd-ba36-fdd9f9731d5b	2026-05-05 14:23:05.031
1e65a3ec-6a86-4ba1-8584-49f07bac1849	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNjU4MzJmLWJiZmQtNDcyNy1hM2M3LWIzZTdmZDlkOTJkZiIsImlhdCI6MTc3NzM3ODk4NSwiZXhwIjoxNzc3OTgzNzg1fQ.1N68rohs_RvvqxvcPNsnQUpx724z5EN8m1VcCnz4C2U	2026-04-28 12:23:05.19612	6165832f-bbfd-4727-a3c7-b3e7fd9d92df	2026-05-05 14:23:05.19
736c06c5-5396-4ed0-b274-03ee32cee4f2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE3YWU2ZTg4LTZkMDAtNDVmZC1iOWI4LTdlMjk5MjNiZjY5NCIsImlhdCI6MTc3NzM3ODk4NSwiZXhwIjoxNzc3OTgzNzg1fQ.4r8K4UIWXSDQUNZksUx4Z0K9RxgH8_pV1GYCNwgGKjk	2026-04-28 12:23:05.35783	a7ae6e88-6d00-45fd-b9b8-7e29923bf694	2026-05-05 14:23:05.352
d0c8dc41-712e-4d7d-9056-ada9024031b4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFjOWZmZGYzLTRiMjYtNGQyNC04NGQzLTkxYmU3NjNmMDllZSIsImlhdCI6MTc3NzM3ODk4NSwiZXhwIjoxNzc3OTgzNzg1fQ.wGxnAw8YbKhIiTsJtK0js8ZYAkwNJBxdrcqgddWIsUE	2026-04-28 12:23:05.515666	1c9ffdf3-4b26-4d24-84d3-91be763f09ee	2026-05-05 14:23:05.51
33a5142d-1511-420d-bae0-a247a9680a3b	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZjYTM0MDZhLTIwYWEtNDY4NC1iMDY2LWNmZTc5MzYxZTk4YSIsImlhdCI6MTc3NzM3ODk4NSwiZXhwIjoxNzc3OTgzNzg1fQ.v52XqC_uullYHVCyfBKswOgY8TWu-ow6kA7LH2jnfW8	2026-04-28 12:23:05.688004	6ca3406a-20aa-4684-b066-cfe79361e98a	2026-05-05 14:23:05.682
cbaf0bf3-c19f-4cfb-a877-89967e2440fb	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVlMDEyY2M0LWU5YjctNGMxZi05MDc4LTcwNzgzZDg0MWQyOCIsImlhdCI6MTc3NzM3ODk4NSwiZXhwIjoxNzc3OTgzNzg1fQ.2iK37OIYvhtuvd5A52w3f2PwT5V8sXrzg7CkfLWIsEo	2026-04-28 12:23:05.84934	ee012cc4-e9b7-4c1f-9078-70783d841d28	2026-05-05 14:23:05.844
60283e7d-e1a3-4c68-a2ac-38d739a02453	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNhNjRmOWM4LWNlY2QtNDkzZC1iNDQ4LTZkODI3MDkxMWJmNiIsImlhdCI6MTc3NzM3ODk4NiwiZXhwIjoxNzc3OTgzNzg2fQ.8e0TMYf7-gAMwgFyyEZ_tW_AXu9meja5_J7A5NzWorI	2026-04-28 12:23:06.008516	ca64f9c8-cecd-493d-b448-6d8270911bf6	2026-05-05 14:23:06.003
83d24e4d-2bfb-4e40-a282-516c59c1ecf3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc3NzY5N2U0LWYyOGMtNDcyYy04ZDBiLThhMjY1MjlmOWI5NiIsImlhdCI6MTc3NzM3ODk4NiwiZXhwIjoxNzc3OTgzNzg2fQ.gqKdFKYbvEfM1o-WiosdTRUqdmC2NpjCasKGIBZhxgs	2026-04-28 12:23:06.166929	777697e4-f28c-472c-8d0b-8a26529f9b96	2026-05-05 14:23:06.161
43a856d8-2baa-4d11-912f-ff4109e9d75a	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ4YTc1ODYwLWQyMWQtNDc0MS05ZTQ3LTAxZjNiZmNjZjQ1YiIsImlhdCI6MTc3NzM3ODk4NiwiZXhwIjoxNzc3OTgzNzg2fQ.poDkPh2tzsdM-JoiqCpYMFhQnoT8fAax4OAZx7EZTT4	2026-04-28 12:23:06.327837	d8a75860-d21d-4741-9e47-01f3bfccf45b	2026-05-05 14:23:06.322
73d931ea-0237-43cd-8639-0c460887f4cb	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU3YWI4NTkxLTljNGUtNDI2Yy05MWEzLTI5M2Q0NjBiOGUzNyIsImlhdCI6MTc3NzM3ODk4NiwiZXhwIjoxNzc3OTgzNzg2fQ.uYiqZrjPqwsjQZV20NAEoH5bxVoEFsZ8IyHBY2kdcW0	2026-04-28 12:23:06.487212	57ab8591-9c4e-426c-91a3-293d460b8e37	2026-05-05 14:23:06.482
cf768a42-e263-42ba-b6d2-b9a38253b884	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImUxMjBmYWQwLTVhODAtNDRkNC05YmI3LTk3NjI0MjRkYjk4ZSIsImlhdCI6MTc3NzM3ODk4NiwiZXhwIjoxNzc3OTgzNzg2fQ.LQ6YFp6_YCSzA5_z1Jo5PlilH6TPfreo7zTLHPeBkBk	2026-04-28 12:23:06.649148	e120fad0-5a80-44d4-9bb7-9762424db98e	2026-05-05 14:23:06.644
427cd13b-600e-4c09-a8cb-ff6e787bb7ce	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNkNTVlMjIxLWYzZDYtNDcxZS05NjA3LWZjZWFhNmUyYTI0YiIsImlhdCI6MTc3NzM3ODk4NiwiZXhwIjoxNzc3OTgzNzg2fQ.afbqSRi1pHqnSB_-eGePuCZxH7yiTYx0fOAGm8CIT6c	2026-04-28 12:23:06.807391	cd55e221-f3d6-471e-9607-fceaa6e2a24b	2026-05-05 14:23:06.802
69e04d49-ecad-42c2-9670-e1234242cb1a	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRmYWRkZTJkLWY1OTctNGMwZS1iZjBiLWFiNjhlMDU5YTIwNSIsImlhdCI6MTc3NzM3ODk4NiwiZXhwIjoxNzc3OTgzNzg2fQ.RlIBeIDTnO8sjXaZjvXcaPN-eE1Ikql4H4gYZMRPkGM	2026-04-28 12:23:06.968298	4fadde2d-f597-4c0e-bf0b-ab68e059a205	2026-05-05 14:23:06.963
eb4e3566-629a-46a2-b7a3-504afdbf986f	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNlNGNiNjA5LTM4YWItNDRmMC05ZTYzLWY1YzAwNzQwZDhlNCIsImlhdCI6MTc3NzM3ODk4NywiZXhwIjoxNzc3OTgzNzg3fQ.6LPZhvp6G3mmk7k3a3Nv3AfLiVsPiOnr0lUYBXBgV4w	2026-04-28 12:23:07.12698	3e4cb609-38ab-44f0-9e63-f5c00740d8e4	2026-05-05 14:23:07.121
5c25f1b8-261d-409a-b6d3-36faddb705e9	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjJmNTNhMTFlLWE4MDYtNGJlMy1iYTEzLTI1ZjU2ZGExZWYwNiIsImlhdCI6MTc3NzM3ODk4NywiZXhwIjoxNzc3OTgzNzg3fQ.UM3J8gIFlUw7DQeQRmZpV8N_1JpdY6AnJo4MmfTDKHo	2026-04-28 12:23:07.286197	2f53a11e-a806-4be3-ba13-25f56da1ef06	2026-05-05 14:23:07.281
ae8b4017-00ca-422d-8540-f1ed1e558645	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcxOThkN2U1LTFiN2MtNGI4NS1iNmY2LTNiZjBjYmRmZjEzMiIsImlhdCI6MTc3NzM3ODk4NywiZXhwIjoxNzc3OTgzNzg3fQ.lU_oHReUypbBV7RN4JHl2KRVBKL63T93ZC4eIMcyP2A	2026-04-28 12:23:07.44697	7198d7e5-1b7c-4b85-b6f6-3bf0cbdff132	2026-05-05 14:23:07.442
5d785f2e-2f11-4a4b-b436-39949922cdee	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc4ZWE2NDM1LTdkOGEtNGY5Zi04Y2YzLTczMWQzM2Q1YzhkYiIsImlhdCI6MTc3NzM3ODk4NywiZXhwIjoxNzc3OTgzNzg3fQ.xBC2IXXXoJtMQe-5eS5rXVV_CEGBAGM7_ApF3NduD4A	2026-04-28 12:23:07.605963	78ea6435-7d8a-4f9f-8cf3-731d33d5c8db	2026-05-05 14:23:07.601
f02667e7-c487-409b-b2ee-b65e8c8421e0	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIxZjA1Y2Q5LTViZjktNDliZS1hMzdiLWQzNGYzOGUwYzhlZiIsImlhdCI6MTc3NzM3ODk4NywiZXhwIjoxNzc3OTgzNzg3fQ.H2g7gtxUmtey0ybh98yH6gyDSDJqeBEDPgRfJ-BWLXA	2026-04-28 12:23:07.772025	b1f05cd9-5bf9-49be-a37b-d34f38e0c8ef	2026-05-05 14:23:07.766
6e1763c3-1b9f-4ecf-b3bf-4c4c35d620fa	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJhYTA4YmNlLTQxMTQtNDg1MS1iMjFkLTIxNGRiMmI5NGY1MCIsImlhdCI6MTc3NzM3ODk4NywiZXhwIjoxNzc3OTgzNzg3fQ.AVnx6THdpEnyWNoDsWwUanm0YMoBULdJVl9B34YpZiU	2026-04-28 12:23:07.936534	baa08bce-4114-4851-b21d-214db2b94f50	2026-05-05 14:23:07.931
e925081c-8b4f-4a44-a7ec-57188cadf05e	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM3OTg0NCwiZXhwIjoxNzc3OTg0NjQ0fQ.gaLxLccwJSJb6u2nx9Kzz1DbXlM0wzYfn4yG6Rj66_0	2026-04-28 12:37:24.370702	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 14:37:24.365
c03b0c04-51a4-4506-8545-3e4f0d32ae1d	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM3OTk0NCwiZXhwIjoxNzc3OTg0NzQ0fQ.xjs3nVRActPerQDd_Zjgi6AdY8UnGU19egEq0hyV0ms	2026-04-28 12:39:04.35995	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 14:39:04.355
84971040-e725-4faa-afc2-09fe821c15b7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM3OTk1NiwiZXhwIjoxNzc3OTg0NzU2fQ.b6MS2Mf9qloTSUdJqBedUcKLEbCLCn4vC1K0ua8qOlA	2026-04-28 12:39:16.099144	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 14:39:16.094
4a105501-1070-4011-bb5b-3af3270c8e53	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM4MDc3NywiZXhwIjoxNzc3OTg1NTc3fQ.FyQLhpIdZPc1t0OCmsXR2oZYf-aQNZIaJ9w-JmikGYs	2026-04-28 12:52:57.45787	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 14:52:57.452
100e8b65-22fd-4ddd-b819-b7a97266f862	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM4MTkxOCwiZXhwIjoxNzc3OTg2NzE4fQ.JFEXaPTK2wqAvL64bJu4z40JsrUlnHRe61N2aM08VTI	2026-04-28 13:11:58.409234	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 15:11:58.404
e7b1420a-bc1f-4714-8921-c4306a3e53f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM4MjQ1NywiZXhwIjoxNzc3OTg3MjU3fQ.T5ULU2chPdZNuhdCpguVZCxegU_4kg49eFkdgXeGPSY	2026-04-28 13:20:57.732468	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 13:20:57.724
a1d00e61-58fc-48cf-a9c8-725033ca6781	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM4NDMyMCwiZXhwIjoxNzc3OTg5MTIwfQ.JtbhK0dqAbPZaRa6Gf5vpW8PUWWIia4sXZR4FEkn5Es	2026-04-28 13:52:00.310108	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 13:52:00.305
6186608b-6a5d-4f43-b340-7fc119121f26	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM4NDMyMCwiZXhwIjoxNzc3OTg5MTIwfQ.JtbhK0dqAbPZaRa6Gf5vpW8PUWWIia4sXZR4FEkn5Es	2026-04-28 13:52:00.31032	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 13:52:00.306
29975eeb-0698-4e72-b55b-67a973b1797b	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM4NDMyMCwiZXhwIjoxNzc3OTg5MTIwfQ.JtbhK0dqAbPZaRa6Gf5vpW8PUWWIia4sXZR4FEkn5Es	2026-04-28 13:52:00.310123	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 13:52:00.305
42546be5-5adb-4321-9898-7bb8af09bd8f	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM4NjAyNCwiZXhwIjoxNzc3OTkwODI0fQ.U7DpRHQXo9ogLZ-q6Fiskl3yEuhc5v99vq4HWHIa4Yo	2026-04-28 14:20:24.870762	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 14:20:24.866
0bfc6128-3622-4dd6-92c5-37f3ac6cccf0	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM4NjAyNCwiZXhwIjoxNzc3OTkwODI0fQ.U7DpRHQXo9ogLZ-q6Fiskl3yEuhc5v99vq4HWHIa4Yo	2026-04-28 14:20:24.871073	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 14:20:24.866
3e1ae151-3882-4f9d-b752-24f82c5c9333	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM4NjQyMiwiZXhwIjoxNzc3OTkxMjIyfQ.yoJauFyufCWXA7uwxdKP6rPlfIh_osUxb_g4sBzKjb0	2026-04-28 14:27:02.66848	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 14:27:02.664
4dc91d14-97ab-4030-8401-9cf395841826	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM4NjQyMiwiZXhwIjoxNzc3OTkxMjIyfQ.yoJauFyufCWXA7uwxdKP6rPlfIh_osUxb_g4sBzKjb0	2026-04-28 14:27:02.668243	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 14:27:02.663
b856515c-6ee0-424d-a362-ef949abf2005	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM4Njc5OSwiZXhwIjoxNzc3OTkxNTk5fQ.tmFUDNgUmspyyNJkOpilDxgjchhql7FTRPg8cPFIsjA	2026-04-28 14:33:19.057063	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 14:33:19.051
1186d256-1125-4dd5-bf55-05db179503ac	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM4Njc5OSwiZXhwIjoxNzc3OTkxNTk5fQ.tmFUDNgUmspyyNJkOpilDxgjchhql7FTRPg8cPFIsjA	2026-04-28 14:33:19.06164	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 14:33:19.056
51775dee-ae29-4763-9cb7-56114f596ab8	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM4Njc5OSwiZXhwIjoxNzc3OTkxNTk5fQ.tmFUDNgUmspyyNJkOpilDxgjchhql7FTRPg8cPFIsjA	2026-04-28 14:33:19.061688	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 14:33:19.057
9e530159-d0d3-4b4c-a9e5-fe48518dedea	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM4Njc5OSwiZXhwIjoxNzc3OTkxNTk5fQ.tmFUDNgUmspyyNJkOpilDxgjchhql7FTRPg8cPFIsjA	2026-04-28 14:33:19.063335	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 14:33:19.058
d3a0be7e-805e-4043-be68-cc46019e4a04	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM4Njk5OSwiZXhwIjoxNzc3OTkxNzk5fQ.p4DOLY7AWHo7ejNRMahT20lSIEWjoUx5Xc8KdzMjjyg	2026-04-28 14:36:39.220932	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 14:36:39.215
ad5b2481-f8b2-46f3-812a-ca14eda4df8b	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM4Nzc5NSwiZXhwIjoxNzc3OTkyNTk1fQ.jq-968YyT5HLLZRPI-4NfUgv1Rc1KBDE8xddRN4Cszc	2026-04-28 14:49:55.758914	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 14:49:55.753
cc90f9ae-f1b0-44ab-b96f-063df10aed42	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM4Nzg5NiwiZXhwIjoxNzc3OTkyNjk2fQ.j0rvIGlcI5qPO6S4Q3pjVdtp_Ca9T7MUro8wlaG-Ko8	2026-04-28 14:51:36.868128	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 14:51:36.862
88ad3ce6-e49a-4a49-9040-aefffde64079	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM4Nzg5NiwiZXhwIjoxNzc3OTkyNjk2fQ.j0rvIGlcI5qPO6S4Q3pjVdtp_Ca9T7MUro8wlaG-Ko8	2026-04-28 14:51:36.869345	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 14:51:36.865
093d680d-3d2a-444e-b404-3d28e9f47d43	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM4Nzg5NiwiZXhwIjoxNzc3OTkyNjk2fQ.j0rvIGlcI5qPO6S4Q3pjVdtp_Ca9T7MUro8wlaG-Ko8	2026-04-28 14:51:36.871028	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 14:51:36.865
29ba33b8-f7e7-4174-b7f4-d732b138d3b9	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzM4Nzg5NiwiZXhwIjoxNzc3OTkyNjk2fQ.j0rvIGlcI5qPO6S4Q3pjVdtp_Ca9T7MUro8wlaG-Ko8	2026-04-28 14:51:36.876731	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-05 14:51:36.871
a3083f07-8d9c-4b09-b09d-4e96f9640c27	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzQ1MjI0NCwiZXhwIjoxNzc4MDU3MDQ0fQ.VTjH_aUvsWWXorfvRuecmNULKdaOm2Sjznf8NuzR4bI	2026-04-29 08:44:04.041551	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-06 08:44:04.037
8c1d66e6-3133-4f88-9d4c-ce66660b3e16	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzQ1MjI0NiwiZXhwIjoxNzc4MDU3MDQ2fQ.xX58ushOWsccvOuVWDzuXlmYNx93kF9vKFx9hXZykwI	2026-04-29 08:44:06.005034	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-06 08:44:06
08339f39-8528-4cbc-8c7e-b83ef798ec19	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzQ1MjI1NywiZXhwIjoxNzc4MDU3MDU3fQ.4vA0wq1XYqwBaRDK9ciMzVmt3g9qZ-sne1QpH4yetVs	2026-04-29 08:44:17.046573	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-06 08:44:17.042
c601afe6-d22d-4a37-ba1e-7ba078fff9a2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzQ1MjMzMywiZXhwIjoxNzc4MDU3MTMzfQ.RDmj5N2alnmVp2lofgDDClM9UGb0kn7ZqpdNzwu2fd8	2026-04-29 08:45:33.183763	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-06 08:45:33.177
54e36fd0-205e-4195-bf53-e1341e7b79f4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1MThkNGNkLTA4YmMtNDNmYS1iZmViLWNiYTNlMjZkMTg2ZCIsImlhdCI6MTc3NzQ1MjMzMywiZXhwIjoxNzc4MDU3MTMzfQ.RDmj5N2alnmVp2lofgDDClM9UGb0kn7ZqpdNzwu2fd8	2026-04-29 08:45:33.182266	8518d4cd-08bc-43fa-bfeb-cba3e26d186d	2026-05-06 08:45:33.176
\.


--
-- Data for Name: room; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.room (id, name, description, capacity, "isMaintenance", "createdAt", "updatedAt", "deletedAt", "isHandicapAccessible", projection_type_id) FROM stdin;
1	Salle 1	Salle standard confortable	20	f	2026-04-28 09:51:02.664031	2026-04-28 09:51:02.664031	\N	f	1
2	Salle 2	Expérience immersive 3D	25	f	2026-04-28 09:52:26.994721	2026-04-28 09:52:26.994721	\N	f	2
3	Salle 3	Écran géant IMAX	30	t	2026-04-28 09:52:38.187883	2026-04-28 09:52:38.187883	\N	f	3
4	Salle 4	Petite salle intimiste	15	f	2026-04-28 09:52:43.591774	2026-04-28 09:52:43.591774	\N	f	1
5	Salle 5	Visionnage haute définition	22	f	2026-04-28 09:52:51.060386	2026-04-28 09:52:51.060386	\N	f	1
6	Salle 6	Salle 3D Premium	28	f	2026-04-28 09:52:57.463304	2026-04-28 09:52:57.463304	\N	f	2
7	Salle 7	Maintenance technique	18	t	2026-04-28 09:53:03.59706	2026-04-28 09:53:03.59706	\N	f	1
8	Salle 8	Grand confort IMAX	30	f	2026-04-28 09:53:09.271215	2026-04-28 09:53:09.271215	\N	f	3
9	Salle 9	Salle classique	24	f	2026-04-28 09:53:14.536742	2026-04-28 09:53:14.536742	\N	f	1
10	Salle 10	Session 3D nocturne	16	f	2026-04-28 09:53:20.079687	2026-04-28 09:53:20.079687	\N	f	2
11	Salle 11	Zone VIP	15	f	2026-04-28 09:53:25.750213	2026-04-28 09:53:25.750213	\N	f	3
12	Salle 12	Salle en rénovation	26	t	2026-04-28 09:53:30.870535	2026-04-28 09:53:30.870535	\N	f	1
\.


--
-- Data for Name: room-image; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."room-image" (id, "imageUrl", "displayOrder", room_id, "createdAt", "updatedAt", "deletedAt") FROM stdin;
1	rooms/1/1777370577473-pathe-palace-opera.png	1	1	2026-04-28 10:02:57.586187	2026-04-28 10:02:57.586187	\N
2	rooms/2/1777370584974-pathe-palace-opera.png	1	2	2026-04-28 10:03:06.069393	2026-04-28 10:03:06.069393	\N
3	rooms/3/1777370588751-pathe-palace-opera.png	1	3	2026-04-28 10:03:08.827356	2026-04-28 10:03:08.827356	\N
4	rooms/4/1777370596263-pathe-palace-opera.png	1	4	2026-04-28 10:03:16.367123	2026-04-28 10:03:16.367123	\N
5	rooms/5/1777370599470-pathe-palace-opera.png	1	5	2026-04-28 10:03:19.568532	2026-04-28 10:03:19.568532	\N
6	rooms/6/1777370602154-pathe-palace-opera.png	1	6	2026-04-28 10:03:22.222151	2026-04-28 10:03:22.222151	\N
7	rooms/7/1777370604815-pathe-palace-opera.png	1	7	2026-04-28 10:03:24.889236	2026-04-28 10:03:24.889236	\N
8	rooms/8/1777370608409-pathe-palace-opera.png	1	8	2026-04-28 10:03:28.48602	2026-04-28 10:03:28.48602	\N
9	rooms/9/1777370611357-pathe-palace-opera.png	1	9	2026-04-28 10:03:31.43547	2026-04-28 10:03:31.43547	\N
10	rooms/10/1777370614548-pathe-palace-opera.png	1	10	2026-04-28 10:03:34.635656	2026-04-28 10:03:34.635656	\N
11	rooms/11/1777370617317-pathe-palace-opera.png	1	11	2026-04-28 10:03:37.398031	2026-04-28 10:03:37.398031	\N
12	rooms/12/1777370620415-pathe-palace-opera.png	1	12	2026-04-28 10:03:40.495979	2026-04-28 10:03:40.495979	\N
15	rooms/1/1777370648934-salle.png	1	1	2026-04-28 10:04:09.096787	2026-04-28 10:04:09.096787	\N
16	rooms/2/1777370652747-salle.png	1	2	2026-04-28 10:04:12.795268	2026-04-28 10:04:12.795268	\N
17	rooms/3/1777370655230-salle.png	1	3	2026-04-28 10:04:15.277512	2026-04-28 10:04:15.277512	\N
18	rooms/4/1777370657597-salle.png	1	4	2026-04-28 10:04:17.644841	2026-04-28 10:04:17.644841	\N
\.


--
-- Data for Name: screening; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.screening (id, "startTime", "endTime", "createdAt", "updatedAt", "deletedAt", movie_id, room_id) FROM stdin;
1	2026-05-01 14:30:00	2026-05-01 17:04:00	2026-04-28 11:56:54.426252	2026-04-28 11:56:54.426252	\N	12	8
2	2026-05-01 12:45:00	2026-05-01 16:04:00	2026-04-28 11:56:54.519876	2026-04-28 11:56:54.519876	\N	2	5
3	2026-05-01 15:15:00	2026-05-01 18:07:00	2026-04-28 11:56:54.610223	2026-04-28 11:56:54.610223	\N	6	6
4	2026-05-04 12:45:00	2026-05-04 15:37:00	2026-04-28 11:56:55.26403	2026-04-28 11:56:55.26403	\N	5	8
5	2026-05-04 13:00:00	2026-05-04 15:56:00	2026-04-28 11:56:55.357334	2026-04-28 11:56:55.357334	\N	13	4
6	2026-05-04 13:30:00	2026-05-04 16:23:00	2026-04-28 11:56:55.491195	2026-04-28 11:56:55.491195	\N	10	2
7	2026-05-05 13:30:00	2026-05-05 16:41:00	2026-04-28 11:56:55.706604	2026-04-28 11:56:55.706604	\N	7	8
8	2026-05-05 15:00:00	2026-05-05 18:22:00	2026-04-28 11:56:55.796855	2026-04-28 11:56:55.796855	\N	9	2
9	2026-05-06 13:45:00	2026-05-06 16:52:00	2026-04-28 11:56:55.88627	2026-04-28 11:56:55.88627	\N	4	1
10	2026-05-06 14:30:00	2026-05-06 17:22:00	2026-04-28 11:56:55.97817	2026-04-28 11:56:55.97817	\N	6	6
11	2026-05-06 17:00:00	2026-05-06 19:52:00	2026-04-28 11:56:56.067243	2026-04-28 11:56:56.067243	\N	5	5
12	2026-05-07 13:45:00	2026-05-07 16:33:00	2026-04-28 11:56:56.253326	2026-04-28 11:56:56.253326	\N	14	4
\.


--
-- Data for Name: ticket_price; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ticket_price (id, price, start_activity, end_activity, created_at, updated_at, deleted_at, projection_type_id) FROM stdin;
1	10.5	2026-04-01 02:00:00	2027-01-01 00:59:59	2026-04-28 11:56:54.250996	2026-04-28 11:56:54.250996	\N	1
2	13	2026-04-01 02:00:00	2027-01-01 00:59:59	2026-04-28 11:56:54.293107	2026-04-28 11:56:54.293107	\N	2
3	16.5	2026-04-01 02:00:00	2027-01-01 00:59:59	2026-04-28 11:56:54.332011	2026-04-28 11:56:54.332011	\N	3
\.


--
-- Data for Name: ticket_usage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ticket_usage (id, used_at, created_at, updated_at, deleted_at, ticket_id, screening_id) FROM stdin;
1	2026-04-28 14:23:08.23	2026-04-28 12:23:08.167637	2026-04-28 12:23:08.167637	\N	38	3
2	2026-04-28 14:23:08.465	2026-04-28 12:23:08.40567	2026-04-28 12:23:08.40567	\N	39	3
3	2026-04-28 14:23:08.696	2026-04-28 12:23:08.635933	2026-04-28 12:23:08.635933	\N	40	3
4	2026-04-28 14:23:08.93	2026-04-28 12:23:08.868222	2026-04-28 12:23:08.868222	\N	41	3
5	2026-04-28 14:23:09.153	2026-04-28 12:23:09.094789	2026-04-28 12:23:09.094789	\N	42	3
6	2026-04-28 14:23:09.381	2026-04-28 12:23:09.322237	2026-04-28 12:23:09.322237	\N	43	3
7	2026-04-28 14:23:09.608	2026-04-28 12:23:09.547713	2026-04-28 12:23:09.547713	\N	44	3
8	2026-04-28 14:23:09.843	2026-04-28 12:23:09.781956	2026-04-28 12:23:09.781956	\N	45	3
9	2026-04-28 14:23:10.078	2026-04-28 12:23:10.015475	2026-04-28 12:23:10.015475	\N	46	3
10	2026-04-28 14:23:10.303	2026-04-28 12:23:10.243674	2026-04-28 12:23:10.243674	\N	47	3
11	2026-04-28 14:23:10.531	2026-04-28 12:23:10.471056	2026-04-28 12:23:10.471056	\N	48	3
12	2026-04-28 14:23:10.756	2026-04-28 12:23:10.69565	2026-04-28 12:23:10.69565	\N	49	3
13	2026-04-28 14:23:10.98	2026-04-28 12:23:10.920603	2026-04-28 12:23:10.920603	\N	50	3
14	2026-04-28 14:23:11.206	2026-04-28 12:23:11.146373	2026-04-28 12:23:11.146373	\N	51	3
15	2026-04-28 14:23:11.432	2026-04-28 12:23:11.371495	2026-04-28 12:23:11.371495	\N	52	3
16	2026-04-28 14:23:11.657	2026-04-28 12:23:11.598719	2026-04-28 12:23:11.598719	\N	53	3
17	2026-04-28 14:23:11.887	2026-04-28 12:23:11.826664	2026-04-28 12:23:11.826664	\N	54	3
18	2026-04-28 14:23:12.12	2026-04-28 12:23:12.058236	2026-04-28 12:23:12.058236	\N	55	3
19	2026-04-28 14:23:12.354	2026-04-28 12:23:12.283382	2026-04-28 12:23:12.283382	\N	56	3
20	2026-04-28 14:23:12.589	2026-04-28 12:23:12.528168	2026-04-28 12:23:12.528168	\N	57	3
21	2026-04-28 14:23:12.819	2026-04-28 12:23:12.759511	2026-04-28 12:23:12.759511	\N	58	3
22	2026-04-28 14:23:13.046	2026-04-28 12:23:12.986576	2026-04-28 12:23:12.986576	\N	59	3
23	2026-04-28 14:23:13.275	2026-04-28 12:23:13.214605	2026-04-28 12:23:13.214605	\N	60	3
24	2026-04-28 14:23:13.504	2026-04-28 12:23:13.444601	2026-04-28 12:23:13.444601	\N	61	3
25	2026-04-28 14:23:13.732	2026-04-28 12:23:13.671703	2026-04-28 12:23:13.671703	\N	62	3
26	2026-04-28 14:23:13.96	2026-04-28 12:23:13.898446	2026-04-28 12:23:13.898446	\N	63	3
27	2026-04-28 14:23:14.189	2026-04-28 12:23:14.128963	2026-04-28 12:23:14.128963	\N	64	3
28	2026-04-28 14:23:14.417	2026-04-28 12:23:14.357118	2026-04-28 12:23:14.357118	\N	65	3
29	2026-04-28 14:23:16.672	2026-04-28 12:23:16.612704	2026-04-28 12:23:16.612704	\N	78	7
30	2026-04-28 14:23:16.906	2026-04-28 12:23:16.841887	2026-04-28 12:23:16.841887	\N	79	1
31	2026-04-28 14:23:17.139	2026-04-28 12:23:17.080268	2026-04-28 12:23:17.080268	\N	80	12
32	2026-04-28 14:23:17.366	2026-04-28 12:23:17.305872	2026-04-28 12:23:17.305872	\N	81	11
33	2026-04-28 14:23:17.593	2026-04-28 12:23:17.532695	2026-04-28 12:23:17.532695	\N	82	12
34	2026-04-28 14:23:17.827	2026-04-28 12:23:17.764803	2026-04-28 12:23:17.764803	\N	83	6
35	2026-04-28 14:23:18.054	2026-04-28 12:23:17.994636	2026-04-28 12:23:17.994636	\N	84	4
36	2026-04-28 14:23:18.278	2026-04-28 12:23:18.218217	2026-04-28 12:23:18.218217	\N	85	6
37	2026-04-28 14:23:18.506	2026-04-28 12:23:18.446702	2026-04-28 12:23:18.446702	\N	86	6
38	2026-04-28 14:23:18.732	2026-04-28 12:23:18.672124	2026-04-28 12:23:18.672124	\N	87	6
39	2026-04-28 14:23:18.96	2026-04-28 12:23:18.901022	2026-04-28 12:23:18.901022	\N	88	4
40	2026-04-28 14:23:19.187	2026-04-28 12:23:19.129142	2026-04-28 12:23:19.129142	\N	89	8
41	2026-04-28 14:23:19.41	2026-04-28 12:23:19.351335	2026-04-28 12:23:19.351335	\N	90	1
42	2026-04-28 14:23:19.636	2026-04-28 12:23:19.576096	2026-04-28 12:23:19.576096	\N	91	11
43	2026-04-28 14:23:19.86	2026-04-28 12:23:19.799415	2026-04-28 12:23:19.799415	\N	92	7
44	2026-04-28 14:23:20.087	2026-04-28 12:23:20.026171	2026-04-28 12:23:20.026171	\N	93	10
45	2026-04-28 14:23:20.313	2026-04-28 12:23:20.252307	2026-04-28 12:23:20.252307	\N	94	9
46	2026-04-28 14:23:20.536	2026-04-28 12:23:20.476358	2026-04-28 12:23:20.476358	\N	95	11
47	2026-04-28 14:23:20.758	2026-04-28 12:23:20.699634	2026-04-28 12:23:20.699634	\N	96	4
48	2026-04-28 14:23:20.987	2026-04-28 12:23:20.926783	2026-04-28 12:23:20.926783	\N	97	8
49	2026-04-28 14:23:21.213	2026-04-28 12:23:21.152763	2026-04-28 12:23:21.152763	\N	98	12
50	2026-04-28 14:23:21.438	2026-04-28 12:23:21.378369	2026-04-28 12:23:21.378369	\N	99	9
51	2026-04-28 14:23:21.661	2026-04-28 12:23:21.601791	2026-04-28 12:23:21.601791	\N	100	6
52	2026-04-28 14:23:21.888	2026-04-28 12:23:21.826841	2026-04-28 12:23:21.826841	\N	101	9
53	2026-04-28 14:23:22.116	2026-04-28 12:23:22.057512	2026-04-28 12:23:22.057512	\N	102	4
54	2026-04-28 14:23:22.34	2026-04-28 12:23:22.281525	2026-04-28 12:23:22.281525	\N	103	12
55	2026-04-28 14:23:22.565	2026-04-28 12:23:22.505654	2026-04-28 12:23:22.505654	\N	104	9
56	2026-04-28 14:23:22.789	2026-04-28 12:23:22.730314	2026-04-28 12:23:22.730314	\N	105	12
57	2026-04-28 14:23:23.017	2026-04-28 12:23:22.956649	2026-04-28 12:23:22.956649	\N	106	8
58	2026-04-28 14:23:23.243	2026-04-28 12:23:23.182569	2026-04-28 12:23:23.182569	\N	107	2
59	2026-04-28 14:23:23.469	2026-04-28 12:23:23.408769	2026-04-28 12:23:23.408769	\N	108	10
60	2026-04-28 14:23:23.695	2026-04-28 12:23:23.634013	2026-04-28 12:23:23.634013	\N	109	11
61	2026-04-28 14:23:23.921	2026-04-28 12:23:23.861359	2026-04-28 12:23:23.861359	\N	110	9
62	2026-04-28 14:23:24.145	2026-04-28 12:23:24.085176	2026-04-28 12:23:24.085176	\N	111	1
63	2026-04-28 14:23:24.37	2026-04-28 12:23:24.310974	2026-04-28 12:23:24.310974	\N	112	10
64	2026-04-28 14:23:24.599	2026-04-28 12:23:24.539942	2026-04-28 12:23:24.539942	\N	113	4
65	2026-04-28 14:23:24.826	2026-04-28 12:23:24.766902	2026-04-28 12:23:24.766902	\N	114	12
66	2026-04-28 14:23:25.053	2026-04-28 12:23:24.992846	2026-04-28 12:23:24.992846	\N	115	9
67	2026-04-28 14:23:25.279	2026-04-28 12:23:25.219178	2026-04-28 12:23:25.219178	\N	116	8
68	2026-04-28 14:23:25.503	2026-04-28 12:23:25.44383	2026-04-28 12:23:25.44383	\N	117	12
69	2026-04-28 15:13:08.093	2026-04-28 13:13:08.033681	2026-04-28 13:13:08.033681	\N	121	7
70	2026-04-28 15:13:22.735	2026-04-28 13:13:22.672389	2026-04-28 13:13:22.672389	\N	121	8
71	2026-04-28 15:13:26.708	2026-04-28 13:13:26.647257	2026-04-28 13:13:26.647257	\N	121	2
72	2026-04-28 13:39:57.575	2026-04-28 13:39:57.5112	2026-04-28 13:39:57.5112	\N	123	7
73	2026-04-28 13:47:40.389	2026-04-28 13:47:40.322026	2026-04-28 13:47:40.322026	\N	122	8
74	2026-04-28 14:17:23.565	2026-04-28 14:17:23.500503	2026-04-28 14:17:23.500503	\N	128	7
75	2026-04-28 14:48:22.525	2026-04-28 14:48:22.461728	2026-04-28 14:48:22.461728	\N	129	7
\.


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tickets (id, ticket_type, created_at, updated_at, deleted_at, user_id) FROM stdin;
1	solo	2026-04-28 11:56:56.651141	2026-04-28 11:56:56.651141	\N	22135db3-a15b-4b7f-a3aa-39549ef5333f
2	solo	2026-04-28 11:56:57.035545	2026-04-28 11:56:57.035545	\N	dffd4415-945d-48a1-b554-661123954484
3	solo	2026-04-28 11:56:57.386671	2026-04-28 11:56:57.386671	\N	856c4f3a-7803-41f4-8ed3-02f77f2f3444
4	solo	2026-04-28 11:56:57.731627	2026-04-28 11:56:57.731627	\N	b4dc8e69-026f-4b55-805f-25ae87ad63a8
5	solo	2026-04-28 11:56:58.301864	2026-04-28 11:56:58.301864	\N	1f3bbe23-e0e1-4c14-8360-459ac3e9ec15
6	solo	2026-04-28 11:56:58.650514	2026-04-28 11:56:58.650514	\N	8b65fc13-d8f6-4b2f-b46e-8510ec2d07e6
7	solo	2026-04-28 11:56:59.00087	2026-04-28 11:56:59.00087	\N	23cdbfb2-457b-4708-9824-b361af3f82ce
8	solo	2026-04-28 11:56:59.341654	2026-04-28 11:56:59.341654	\N	493aba29-e1e4-4e8d-b414-dfe28226be8e
9	solo	2026-04-28 11:56:59.704061	2026-04-28 11:56:59.704061	\N	bb026ed1-8348-465d-ab21-47fef9d367ea
10	solo	2026-04-28 11:57:00.054175	2026-04-28 11:57:00.054175	\N	2a2dc663-c5d3-4132-a238-863b4079bf64
11	solo	2026-04-28 11:57:00.404377	2026-04-28 11:57:00.404377	\N	8b0c2fef-b6e4-47e1-8d6b-d50a089616e2
12	solo	2026-04-28 12:17:26.31505	2026-04-28 12:17:26.31505	\N	f8d71ad2-d7b3-450a-a13c-b889c0a0bbdd
13	solo	2026-04-28 12:17:26.480874	2026-04-28 12:17:26.480874	\N	634e6ed2-1ca6-4633-b02a-2a804e3b8fa6
14	solo	2026-04-28 12:17:26.639239	2026-04-28 12:17:26.639239	\N	9c9d1939-89c5-4474-a808-3152f0c9b9b6
15	solo	2026-04-28 12:17:26.797249	2026-04-28 12:17:26.797249	\N	6189afd7-ac5d-494a-a501-87172a2464a4
16	solo	2026-04-28 12:17:26.959991	2026-04-28 12:17:26.959991	\N	b1f3f9cb-53cf-410e-8513-27470d89ec1b
17	solo	2026-04-28 12:17:27.119823	2026-04-28 12:17:27.119823	\N	a4637c72-1e81-46a3-9232-6641dfc3c35e
18	solo	2026-04-28 12:17:27.278813	2026-04-28 12:17:27.278813	\N	0a6870eb-ce45-4575-979c-c3276dcf646c
19	solo	2026-04-28 12:17:27.440011	2026-04-28 12:17:27.440011	\N	f309c20a-a747-4225-a5f0-f6d65318aaa1
20	solo	2026-04-28 12:17:27.598216	2026-04-28 12:17:27.598216	\N	b8e38011-0f32-45c0-a052-89597f680252
21	solo	2026-04-28 12:17:27.757611	2026-04-28 12:17:27.757611	\N	381b3ab8-485c-4342-b73b-b1819c7978b5
22	solo	2026-04-28 12:17:27.92312	2026-04-28 12:17:27.92312	\N	393d5b2d-9748-4a59-9a02-d8a87e0196a2
23	solo	2026-04-28 12:17:28.079169	2026-04-28 12:17:28.079169	\N	758ec514-f62b-4043-956d-05c431b729ff
24	solo	2026-04-28 12:17:28.237788	2026-04-28 12:17:28.237788	\N	0050611d-df32-43e0-a7ed-14d0597721b6
25	solo	2026-04-28 12:17:28.390208	2026-04-28 12:17:28.390208	\N	828dc130-d300-4f90-93c8-e900584c08ee
26	solo	2026-04-28 12:17:28.545824	2026-04-28 12:17:28.545824	\N	07d8a070-5ce6-4af9-b87f-d5952b54d087
27	solo	2026-04-28 12:17:28.70711	2026-04-28 12:17:28.70711	\N	2effa02f-cc27-460c-848f-2e92c9515a1e
28	solo	2026-04-28 12:17:28.862242	2026-04-28 12:17:28.862242	\N	4f5df3de-5796-44d8-beaa-c9ace920bc13
29	solo	2026-04-28 12:17:29.023919	2026-04-28 12:17:29.023919	\N	ad6a1530-9379-4e26-8dea-91ee69bc1281
30	solo	2026-04-28 12:17:29.183027	2026-04-28 12:17:29.183027	\N	9c28261a-56f5-424d-88a5-a7f9e6c465a5
31	solo	2026-04-28 12:17:29.340718	2026-04-28 12:17:29.340718	\N	cd5eb718-3091-478f-bc12-13091af017dc
32	solo	2026-04-28 12:17:29.499233	2026-04-28 12:17:29.499233	\N	86117862-5355-4bfd-a8b3-e06824f4af26
33	solo	2026-04-28 12:17:29.661912	2026-04-28 12:17:29.661912	\N	040dec0d-cdd1-43fd-ba36-fdd9f9731d5b
34	solo	2026-04-28 12:17:29.821241	2026-04-28 12:17:29.821241	\N	6165832f-bbfd-4727-a3c7-b3e7fd9d92df
35	solo	2026-04-28 12:17:29.980798	2026-04-28 12:17:29.980798	\N	6165832f-bbfd-4727-a3c7-b3e7fd9d92df
36	solo	2026-04-28 12:17:30.137085	2026-04-28 12:17:30.137085	\N	6165832f-bbfd-4727-a3c7-b3e7fd9d92df
37	solo	2026-04-28 12:17:30.300354	2026-04-28 12:17:30.300354	\N	a7ae6e88-6d00-45fd-b9b8-7e29923bf694
38	solo	2026-04-28 12:23:08.042699	2026-04-28 12:23:08.042699	\N	f8d71ad2-d7b3-450a-a13c-b889c0a0bbdd
39	solo	2026-04-28 12:23:08.280568	2026-04-28 12:23:08.280568	\N	634e6ed2-1ca6-4633-b02a-2a804e3b8fa6
40	solo	2026-04-28 12:23:08.512805	2026-04-28 12:23:08.512805	\N	9c9d1939-89c5-4474-a808-3152f0c9b9b6
41	solo	2026-04-28 12:23:08.744602	2026-04-28 12:23:08.744602	\N	6189afd7-ac5d-494a-a501-87172a2464a4
42	solo	2026-04-28 12:23:08.976819	2026-04-28 12:23:08.976819	\N	b1f3f9cb-53cf-410e-8513-27470d89ec1b
43	solo	2026-04-28 12:23:09.20169	2026-04-28 12:23:09.20169	\N	a4637c72-1e81-46a3-9232-6641dfc3c35e
44	solo	2026-04-28 12:23:09.427951	2026-04-28 12:23:09.427951	\N	0a6870eb-ce45-4575-979c-c3276dcf646c
45	solo	2026-04-28 12:23:09.661772	2026-04-28 12:23:09.661772	\N	f309c20a-a747-4225-a5f0-f6d65318aaa1
46	solo	2026-04-28 12:23:09.895064	2026-04-28 12:23:09.895064	\N	b8e38011-0f32-45c0-a052-89597f680252
47	solo	2026-04-28 12:23:10.124922	2026-04-28 12:23:10.124922	\N	381b3ab8-485c-4342-b73b-b1819c7978b5
48	solo	2026-04-28 12:23:10.351724	2026-04-28 12:23:10.351724	\N	393d5b2d-9748-4a59-9a02-d8a87e0196a2
49	solo	2026-04-28 12:23:10.577726	2026-04-28 12:23:10.577726	\N	758ec514-f62b-4043-956d-05c431b729ff
50	solo	2026-04-28 12:23:10.803378	2026-04-28 12:23:10.803378	\N	0050611d-df32-43e0-a7ed-14d0597721b6
51	solo	2026-04-28 12:23:11.027146	2026-04-28 12:23:11.027146	\N	828dc130-d300-4f90-93c8-e900584c08ee
52	solo	2026-04-28 12:23:11.252651	2026-04-28 12:23:11.252651	\N	07d8a070-5ce6-4af9-b87f-d5952b54d087
53	solo	2026-04-28 12:23:11.481428	2026-04-28 12:23:11.481428	\N	2effa02f-cc27-460c-848f-2e92c9515a1e
54	solo	2026-04-28 12:23:11.703392	2026-04-28 12:23:11.703392	\N	4f5df3de-5796-44d8-beaa-c9ace920bc13
55	solo	2026-04-28 12:23:11.935824	2026-04-28 12:23:11.935824	\N	ad6a1530-9379-4e26-8dea-91ee69bc1281
56	solo	2026-04-28 12:23:12.167837	2026-04-28 12:23:12.167837	\N	9c28261a-56f5-424d-88a5-a7f9e6c465a5
57	solo	2026-04-28 12:23:12.404167	2026-04-28 12:23:12.404167	\N	cd5eb718-3091-478f-bc12-13091af017dc
58	solo	2026-04-28 12:23:12.637976	2026-04-28 12:23:12.637976	\N	86117862-5355-4bfd-a8b3-e06824f4af26
59	solo	2026-04-28 12:23:12.869956	2026-04-28 12:23:12.869956	\N	040dec0d-cdd1-43fd-ba36-fdd9f9731d5b
60	solo	2026-04-28 12:23:13.095538	2026-04-28 12:23:13.095538	\N	6165832f-bbfd-4727-a3c7-b3e7fd9d92df
61	solo	2026-04-28 12:23:13.323761	2026-04-28 12:23:13.323761	\N	a7ae6e88-6d00-45fd-b9b8-7e29923bf694
62	solo	2026-04-28 12:23:13.551722	2026-04-28 12:23:13.551722	\N	1c9ffdf3-4b26-4d24-84d3-91be763f09ee
63	solo	2026-04-28 12:23:13.779521	2026-04-28 12:23:13.779521	\N	6ca3406a-20aa-4684-b066-cfe79361e98a
64	solo	2026-04-28 12:23:14.00771	2026-04-28 12:23:14.00771	\N	ee012cc4-e9b7-4c1f-9078-70783d841d28
65	solo	2026-04-28 12:23:14.236838	2026-04-28 12:23:14.236838	\N	ca64f9c8-cecd-493d-b448-6d8270911bf6
66	solo	2026-04-28 12:23:14.470537	2026-04-28 12:23:14.470537	\N	777697e4-f28c-472c-8d0b-8a26529f9b96
67	solo	2026-04-28 12:23:14.639945	2026-04-28 12:23:14.639945	\N	d8a75860-d21d-4741-9e47-01f3bfccf45b
68	solo	2026-04-28 12:23:14.811506	2026-04-28 12:23:14.811506	\N	57ab8591-9c4e-426c-91a3-293d460b8e37
69	solo	2026-04-28 12:23:14.979555	2026-04-28 12:23:14.979555	\N	e120fad0-5a80-44d4-9bb7-9762424db98e
70	solo	2026-04-28 12:23:15.145597	2026-04-28 12:23:15.145597	\N	cd55e221-f3d6-471e-9607-fceaa6e2a24b
71	solo	2026-04-28 12:23:15.307838	2026-04-28 12:23:15.307838	\N	4fadde2d-f597-4c0e-bf0b-ab68e059a205
72	solo	2026-04-28 12:23:15.472586	2026-04-28 12:23:15.472586	\N	3e4cb609-38ab-44f0-9e63-f5c00740d8e4
73	solo	2026-04-28 12:23:15.652553	2026-04-28 12:23:15.652553	\N	2f53a11e-a806-4be3-ba13-25f56da1ef06
74	solo	2026-04-28 12:23:15.822287	2026-04-28 12:23:15.822287	\N	7198d7e5-1b7c-4b85-b6f6-3bf0cbdff132
75	solo	2026-04-28 12:23:15.989082	2026-04-28 12:23:15.989082	\N	78ea6435-7d8a-4f9f-8cf3-731d33d5c8db
76	solo	2026-04-28 12:23:16.15552	2026-04-28 12:23:16.15552	\N	b1f05cd9-5bf9-49be-a37b-d34f38e0c8ef
77	solo	2026-04-28 12:23:16.321012	2026-04-28 12:23:16.321012	\N	baa08bce-4114-4851-b21d-214db2b94f50
78	solo	2026-04-28 12:23:16.4939	2026-04-28 12:23:16.4939	\N	f8d71ad2-d7b3-450a-a13c-b889c0a0bbdd
79	solo	2026-04-28 12:23:16.719427	2026-04-28 12:23:16.719427	\N	634e6ed2-1ca6-4633-b02a-2a804e3b8fa6
80	solo	2026-04-28 12:23:16.956539	2026-04-28 12:23:16.956539	\N	9c9d1939-89c5-4474-a808-3152f0c9b9b6
81	solo	2026-04-28 12:23:17.184907	2026-04-28 12:23:17.184907	\N	6189afd7-ac5d-494a-a501-87172a2464a4
82	solo	2026-04-28 12:23:17.413931	2026-04-28 12:23:17.413931	\N	b1f3f9cb-53cf-410e-8513-27470d89ec1b
83	solo	2026-04-28 12:23:17.641112	2026-04-28 12:23:17.641112	\N	a4637c72-1e81-46a3-9232-6641dfc3c35e
84	solo	2026-04-28 12:23:17.875135	2026-04-28 12:23:17.875135	\N	0a6870eb-ce45-4575-979c-c3276dcf646c
85	solo	2026-04-28 12:23:18.10068	2026-04-28 12:23:18.10068	\N	f309c20a-a747-4225-a5f0-f6d65318aaa1
86	solo	2026-04-28 12:23:18.326587	2026-04-28 12:23:18.326587	\N	b8e38011-0f32-45c0-a052-89597f680252
87	solo	2026-04-28 12:23:18.552564	2026-04-28 12:23:18.552564	\N	381b3ab8-485c-4342-b73b-b1819c7978b5
88	solo	2026-04-28 12:23:18.778727	2026-04-28 12:23:18.778727	\N	393d5b2d-9748-4a59-9a02-d8a87e0196a2
89	solo	2026-04-28 12:23:19.008651	2026-04-28 12:23:19.008651	\N	758ec514-f62b-4043-956d-05c431b729ff
90	solo	2026-04-28 12:23:19.234226	2026-04-28 12:23:19.234226	\N	0050611d-df32-43e0-a7ed-14d0597721b6
91	solo	2026-04-28 12:23:19.457781	2026-04-28 12:23:19.457781	\N	828dc130-d300-4f90-93c8-e900584c08ee
92	solo	2026-04-28 12:23:19.682254	2026-04-28 12:23:19.682254	\N	07d8a070-5ce6-4af9-b87f-d5952b54d087
93	solo	2026-04-28 12:23:19.907776	2026-04-28 12:23:19.907776	\N	2effa02f-cc27-460c-848f-2e92c9515a1e
94	solo	2026-04-28 12:23:20.134279	2026-04-28 12:23:20.134279	\N	4f5df3de-5796-44d8-beaa-c9ace920bc13
95	solo	2026-04-28 12:23:20.359568	2026-04-28 12:23:20.359568	\N	ad6a1530-9379-4e26-8dea-91ee69bc1281
96	solo	2026-04-28 12:23:20.584782	2026-04-28 12:23:20.584782	\N	9c28261a-56f5-424d-88a5-a7f9e6c465a5
97	solo	2026-04-28 12:23:20.80575	2026-04-28 12:23:20.80575	\N	cd5eb718-3091-478f-bc12-13091af017dc
98	solo	2026-04-28 12:23:21.033658	2026-04-28 12:23:21.033658	\N	86117862-5355-4bfd-a8b3-e06824f4af26
99	solo	2026-04-28 12:23:21.258298	2026-04-28 12:23:21.258298	\N	040dec0d-cdd1-43fd-ba36-fdd9f9731d5b
100	solo	2026-04-28 12:23:21.484305	2026-04-28 12:23:21.484305	\N	6165832f-bbfd-4727-a3c7-b3e7fd9d92df
101	solo	2026-04-28 12:23:21.708568	2026-04-28 12:23:21.708568	\N	a7ae6e88-6d00-45fd-b9b8-7e29923bf694
102	solo	2026-04-28 12:23:21.935798	2026-04-28 12:23:21.935798	\N	1c9ffdf3-4b26-4d24-84d3-91be763f09ee
103	solo	2026-04-28 12:23:22.163683	2026-04-28 12:23:22.163683	\N	6ca3406a-20aa-4684-b066-cfe79361e98a
104	solo	2026-04-28 12:23:22.38702	2026-04-28 12:23:22.38702	\N	ee012cc4-e9b7-4c1f-9078-70783d841d28
105	solo	2026-04-28 12:23:22.61254	2026-04-28 12:23:22.61254	\N	ca64f9c8-cecd-493d-b448-6d8270911bf6
106	solo	2026-04-28 12:23:22.835675	2026-04-28 12:23:22.835675	\N	777697e4-f28c-472c-8d0b-8a26529f9b96
107	solo	2026-04-28 12:23:23.063986	2026-04-28 12:23:23.063986	\N	d8a75860-d21d-4741-9e47-01f3bfccf45b
108	solo	2026-04-28 12:23:23.289825	2026-04-28 12:23:23.289825	\N	57ab8591-9c4e-426c-91a3-293d460b8e37
109	solo	2026-04-28 12:23:23.515364	2026-04-28 12:23:23.515364	\N	e120fad0-5a80-44d4-9bb7-9762424db98e
110	solo	2026-04-28 12:23:23.742491	2026-04-28 12:23:23.742491	\N	cd55e221-f3d6-471e-9607-fceaa6e2a24b
111	solo	2026-04-28 12:23:23.968096	2026-04-28 12:23:23.968096	\N	4fadde2d-f597-4c0e-bf0b-ab68e059a205
112	solo	2026-04-28 12:23:24.191759	2026-04-28 12:23:24.191759	\N	3e4cb609-38ab-44f0-9e63-f5c00740d8e4
113	solo	2026-04-28 12:23:24.417205	2026-04-28 12:23:24.417205	\N	2f53a11e-a806-4be3-ba13-25f56da1ef06
114	solo	2026-04-28 12:23:24.646873	2026-04-28 12:23:24.646873	\N	7198d7e5-1b7c-4b85-b6f6-3bf0cbdff132
115	solo	2026-04-28 12:23:24.875815	2026-04-28 12:23:24.875815	\N	78ea6435-7d8a-4f9f-8cf3-731d33d5c8db
116	solo	2026-04-28 12:23:25.100548	2026-04-28 12:23:25.100548	\N	b1f05cd9-5bf9-49be-a37b-d34f38e0c8ef
117	solo	2026-04-28 12:23:25.326547	2026-04-28 12:23:25.326547	\N	baa08bce-4114-4851-b21d-214db2b94f50
118	solo	2026-04-28 12:56:41.050604	2026-04-28 12:56:41.050604	\N	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
119	solo	2026-04-28 12:56:44.934892	2026-04-28 12:56:44.934892	\N	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
120	solo	2026-04-28 12:58:52.047223	2026-04-28 12:58:52.047223	\N	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
121	ten	2026-04-28 13:13:01.21989	2026-04-28 13:13:01.21989	\N	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
122	solo	2026-04-28 13:39:51.055711	2026-04-28 13:39:51.055711	\N	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
123	solo	2026-04-28 13:39:51.23062	2026-04-28 13:39:51.23062	\N	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
124	ten	2026-04-28 13:49:01.457071	2026-04-28 13:49:01.457071	\N	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
125	solo	2026-04-28 13:49:03.842475	2026-04-28 13:49:03.842475	\N	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
126	solo	2026-04-28 13:49:08.594429	2026-04-28 13:49:08.594429	\N	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
127	ten	2026-04-28 13:57:39.562237	2026-04-28 13:57:39.562237	\N	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
128	ten	2026-04-28 13:57:43.217848	2026-04-28 13:57:43.217848	\N	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
129	ten	2026-04-28 14:17:35.710087	2026-04-28 14:17:35.710087	\N	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.transactions (id, type, amount, "createdAt", "userId") FROM stdin;
9b703a32-0e00-4579-81d5-ab970dae0097	deposit	200	2026-04-28 11:56:56.618736	22135db3-a15b-4b7f-a3aa-39549ef5333f
d7796ac3-b33e-4701-a90c-f82612f9fb84	ticket_purchase	-10	2026-04-28 11:56:56.651141	22135db3-a15b-4b7f-a3aa-39549ef5333f
a9fd43a9-c03f-4a2c-bf7b-6ea043578bbe	deposit	50	2026-04-28 11:56:57.004891	dffd4415-945d-48a1-b554-661123954484
2f588ea2-edb6-4f25-ba2f-f99f67512b36	ticket_purchase	-10	2026-04-28 11:56:57.035545	dffd4415-945d-48a1-b554-661123954484
c8eefd2d-466b-404d-a6a4-800d32c2cdce	deposit	150	2026-04-28 11:56:57.356799	856c4f3a-7803-41f4-8ed3-02f77f2f3444
7b7ffd3d-2745-402c-83e7-ecbbb229ed21	ticket_purchase	-10	2026-04-28 11:56:57.386671	856c4f3a-7803-41f4-8ed3-02f77f2f3444
2b8fde83-48c1-4273-840a-a17efd498bf2	deposit	200	2026-04-28 11:56:57.701735	b4dc8e69-026f-4b55-805f-25ae87ad63a8
6e08b5c2-4d9f-48cf-a8c6-f96e6b82a4ad	ticket_purchase	-10	2026-04-28 11:56:57.731627	b4dc8e69-026f-4b55-805f-25ae87ad63a8
bc822507-a0a5-422a-a99a-6552064d51cf	deposit	50	2026-04-28 11:56:58.056498	371048e0-bad1-42ab-8996-27113b22fc04
e842e94b-2bdd-4058-8ddf-ab4c089191f6	deposit	100	2026-04-28 11:56:58.272138	1f3bbe23-e0e1-4c14-8360-459ac3e9ec15
01f50f17-50e0-45e7-857e-b71dc9d8fb33	ticket_purchase	-10	2026-04-28 11:56:58.301864	1f3bbe23-e0e1-4c14-8360-459ac3e9ec15
3389a9a8-ab50-419c-b7c7-cf89387004e7	deposit	200	2026-04-28 11:56:58.619798	8b65fc13-d8f6-4b2f-b46e-8510ec2d07e6
e6f07676-5aa4-4416-9280-42f485f56ffe	ticket_purchase	-10	2026-04-28 11:56:58.650514	8b65fc13-d8f6-4b2f-b46e-8510ec2d07e6
a9a92d6c-7597-464f-99ed-a4d9c1510491	deposit	150	2026-04-28 11:56:58.971157	23cdbfb2-457b-4708-9824-b361af3f82ce
627a2d2d-07e7-4a4e-8aa3-cf263b7281d3	ticket_purchase	-10	2026-04-28 11:56:59.00087	23cdbfb2-457b-4708-9824-b361af3f82ce
6a02c87c-f211-4b48-a608-280bf451c631	deposit	200	2026-04-28 11:56:59.311943	493aba29-e1e4-4e8d-b414-dfe28226be8e
e9bf6dcc-5b18-4b6f-b744-3d54d31f8be1	ticket_purchase	-10	2026-04-28 11:56:59.341654	493aba29-e1e4-4e8d-b414-dfe28226be8e
55253f61-732c-4aa4-9090-826c53f75208	deposit	50	2026-04-28 11:56:59.672697	bb026ed1-8348-465d-ab21-47fef9d367ea
cb2fa6e4-69c2-40ba-8df0-ccb6ee53f154	ticket_purchase	-10	2026-04-28 11:56:59.704061	bb026ed1-8348-465d-ab21-47fef9d367ea
23b0118d-b569-48b3-9b6e-e8633bb4cfe6	deposit	100	2026-04-28 11:57:00.024318	2a2dc663-c5d3-4132-a238-863b4079bf64
7b84dbcd-0838-4cbc-87a2-7412ac2dbd5d	ticket_purchase	-10	2026-04-28 11:57:00.054175	2a2dc663-c5d3-4132-a238-863b4079bf64
7e7d18b1-f2ed-4f53-ad54-c63103bc40fb	deposit	100	2026-04-28 11:57:00.374495	8b0c2fef-b6e4-47e1-8d6b-d50a089616e2
5b1ed916-1738-4cba-a1e0-bbf69d45415f	ticket_purchase	-10	2026-04-28 11:57:00.404377	8b0c2fef-b6e4-47e1-8d6b-d50a089616e2
5c119f12-1423-4be2-8928-b33ab78567ad	deposit	200	2026-04-28 12:17:16.787843	f8d71ad2-d7b3-450a-a13c-b889c0a0bbdd
9eb4ed02-92e2-4ed7-8948-04ac6ba770d5	deposit	200	2026-04-28 12:17:17.034232	634e6ed2-1ca6-4633-b02a-2a804e3b8fa6
b6c979b6-0d6f-4c15-941a-8e3b1b267d00	deposit	200	2026-04-28 12:17:17.273742	9c9d1939-89c5-4474-a808-3152f0c9b9b6
9720f9aa-d491-492a-ad58-1ffc72eb3fe5	deposit	200	2026-04-28 12:17:17.518901	6189afd7-ac5d-494a-a501-87172a2464a4
58269583-d811-4ed1-867d-f994bbd51eb3	deposit	200	2026-04-28 12:17:17.761776	b1f3f9cb-53cf-410e-8513-27470d89ec1b
429d882b-c137-487b-b224-7bcbf553ecb4	deposit	200	2026-04-28 12:17:18.003728	a4637c72-1e81-46a3-9232-6641dfc3c35e
9c5dcb81-aa5e-47fe-b55e-32e27e34872d	deposit	200	2026-04-28 12:17:18.246382	0a6870eb-ce45-4575-979c-c3276dcf646c
de0be707-7f84-49b2-b775-d52c8c091c3b	deposit	200	2026-04-28 12:17:18.487389	f309c20a-a747-4225-a5f0-f6d65318aaa1
4121fdae-ffe5-4a70-b2f1-d6f90f77539e	deposit	200	2026-04-28 12:17:18.72705	b8e38011-0f32-45c0-a052-89597f680252
5abdf099-53be-4032-823b-432e4a310c03	deposit	200	2026-04-28 12:17:18.971997	381b3ab8-485c-4342-b73b-b1819c7978b5
99850018-c134-4ffd-b188-39c03f23891c	deposit	200	2026-04-28 12:17:19.215506	393d5b2d-9748-4a59-9a02-d8a87e0196a2
b6a2e5af-1b0b-4906-80e4-d2fcb029addd	deposit	200	2026-04-28 12:17:19.45625	758ec514-f62b-4043-956d-05c431b729ff
e6e6a161-6f2f-492e-b8ed-d2f2d62f34d3	deposit	200	2026-04-28 12:17:19.694235	0050611d-df32-43e0-a7ed-14d0597721b6
7100a9be-ee16-418f-888c-5983fc033a9f	deposit	200	2026-04-28 12:17:19.935191	828dc130-d300-4f90-93c8-e900584c08ee
30cfa8e3-85eb-4834-b329-a6c8342a5d17	deposit	200	2026-04-28 12:17:20.176826	07d8a070-5ce6-4af9-b87f-d5952b54d087
9a6af26e-eeba-4cfd-bc90-5b413986862e	deposit	200	2026-04-28 12:17:20.415731	2effa02f-cc27-460c-848f-2e92c9515a1e
2fa9ebb9-9600-458e-873d-cd69c6cf5b2b	deposit	200	2026-04-28 12:17:20.660009	4f5df3de-5796-44d8-beaa-c9ace920bc13
90c3d0f8-0b0d-44d2-af35-e0ae21583089	deposit	200	2026-04-28 12:17:20.913588	ad6a1530-9379-4e26-8dea-91ee69bc1281
fe5c2461-0708-4e51-93b6-32459c415b79	deposit	200	2026-04-28 12:17:21.156203	9c28261a-56f5-424d-88a5-a7f9e6c465a5
cc228646-4b60-4c17-a391-769b00b065ee	deposit	200	2026-04-28 12:17:21.396286	cd5eb718-3091-478f-bc12-13091af017dc
277de4b6-5f41-41be-86d5-ead95d6cc80c	deposit	200	2026-04-28 12:17:21.639611	86117862-5355-4bfd-a8b3-e06824f4af26
dfd5df49-615c-4a06-8e5e-2b62d773029b	deposit	200	2026-04-28 12:17:21.882124	040dec0d-cdd1-43fd-ba36-fdd9f9731d5b
49a6d6cb-464c-45b2-9b2c-bc11ffbeb63f	deposit	200	2026-04-28 12:17:22.124178	6165832f-bbfd-4727-a3c7-b3e7fd9d92df
38a799b7-df89-42bf-9de0-6a7f2bb37728	deposit	200	2026-04-28 12:17:22.369853	a7ae6e88-6d00-45fd-b9b8-7e29923bf694
1808bbe8-6190-4799-8e81-39147fb21303	deposit	200	2026-04-28 12:17:22.613238	1c9ffdf3-4b26-4d24-84d3-91be763f09ee
75871ada-2034-45b9-a80f-312552829438	deposit	200	2026-04-28 12:17:22.854229	6ca3406a-20aa-4684-b066-cfe79361e98a
ce53643e-edd1-4f7c-9c1b-b4659081fc39	deposit	200	2026-04-28 12:17:23.118717	ee012cc4-e9b7-4c1f-9078-70783d841d28
e3b00c94-50a5-4676-a9cd-64452c099d3b	deposit	200	2026-04-28 12:17:23.360971	ca64f9c8-cecd-493d-b448-6d8270911bf6
6d34eebf-e063-4da0-9c36-d8fc0e71dd72	deposit	200	2026-04-28 12:17:23.603412	777697e4-f28c-472c-8d0b-8a26529f9b96
531a9b4e-eb51-42a9-94f3-5f6734cad7f9	deposit	200	2026-04-28 12:17:23.863307	d8a75860-d21d-4741-9e47-01f3bfccf45b
10ee3bea-3448-4f31-84af-9b8f962e82f2	deposit	200	2026-04-28 12:17:24.108065	57ab8591-9c4e-426c-91a3-293d460b8e37
7dbd91b1-5a93-4e6f-8bd8-0be7a066bea1	deposit	200	2026-04-28 12:17:24.348099	e120fad0-5a80-44d4-9bb7-9762424db98e
284d7cf4-c79e-4022-869f-f67e5569fa49	deposit	200	2026-04-28 12:17:24.588261	cd55e221-f3d6-471e-9607-fceaa6e2a24b
dbe8e68a-c98f-413a-b588-1b81444b84d0	deposit	200	2026-04-28 12:17:24.830281	4fadde2d-f597-4c0e-bf0b-ab68e059a205
e1684fae-9cfd-41e8-85b2-e23bc0619f50	deposit	200	2026-04-28 12:17:25.073617	3e4cb609-38ab-44f0-9e63-f5c00740d8e4
ea4a35a9-55f8-48cb-b168-4faa7300fcc3	deposit	200	2026-04-28 12:17:25.31656	2f53a11e-a806-4be3-ba13-25f56da1ef06
181c77d4-ef02-4c48-a193-c4bba182fe5c	deposit	200	2026-04-28 12:17:25.559765	7198d7e5-1b7c-4b85-b6f6-3bf0cbdff132
c1b62485-f51d-44d8-b929-33ccbfcdbf6e	deposit	200	2026-04-28 12:17:25.80141	78ea6435-7d8a-4f9f-8cf3-731d33d5c8db
bf35fef7-6acc-4e5d-ac0c-c05a93e05b52	deposit	200	2026-04-28 12:17:26.043339	b1f05cd9-5bf9-49be-a37b-d34f38e0c8ef
5e881b29-6300-4dde-b0fe-dba6b235dbe8	deposit	200	2026-04-28 12:17:26.285449	baa08bce-4114-4851-b21d-214db2b94f50
513ac91f-482c-449e-a717-59519812b473	ticket_purchase	-10	2026-04-28 12:17:26.31505	f8d71ad2-d7b3-450a-a13c-b889c0a0bbdd
c66ccb25-6467-4297-9652-ed9e6f7da719	ticket_purchase	-10	2026-04-28 12:17:26.480874	634e6ed2-1ca6-4633-b02a-2a804e3b8fa6
ee2eb17c-0646-4f68-b3c9-783ed4c610e0	ticket_purchase	-10	2026-04-28 12:17:26.639239	9c9d1939-89c5-4474-a808-3152f0c9b9b6
1cc1aa84-9acb-4448-af9a-39f2cbc45d81	ticket_purchase	-10	2026-04-28 12:17:26.797249	6189afd7-ac5d-494a-a501-87172a2464a4
79e9c49e-f733-48ec-beb7-b6ddd05247d5	ticket_purchase	-10	2026-04-28 12:17:26.959991	b1f3f9cb-53cf-410e-8513-27470d89ec1b
187d0156-2b17-49be-a413-f432b0159b68	ticket_purchase	-10	2026-04-28 12:17:27.119823	a4637c72-1e81-46a3-9232-6641dfc3c35e
33e6ee41-84d4-4e57-891b-a70f4ee4ce00	ticket_purchase	-10	2026-04-28 12:17:27.278813	0a6870eb-ce45-4575-979c-c3276dcf646c
38e62f76-297f-4cb8-b4c9-efa26690a6b2	ticket_purchase	-10	2026-04-28 12:17:27.440011	f309c20a-a747-4225-a5f0-f6d65318aaa1
c2dee25e-b3bf-4f7b-8e5e-3515671b6eb0	ticket_purchase	-10	2026-04-28 12:17:27.598216	b8e38011-0f32-45c0-a052-89597f680252
0df203ae-b021-4730-8bec-c449252c7f20	ticket_purchase	-10	2026-04-28 12:17:27.757611	381b3ab8-485c-4342-b73b-b1819c7978b5
ae91268c-33dc-435e-95c3-cd9ac5c3f1b7	ticket_purchase	-10	2026-04-28 12:17:27.92312	393d5b2d-9748-4a59-9a02-d8a87e0196a2
2bcdd5f7-fd19-4a16-a4d2-340bd38a4075	ticket_purchase	-10	2026-04-28 12:17:28.079169	758ec514-f62b-4043-956d-05c431b729ff
507d5701-7fa9-4d5e-be72-1e354b365fcb	ticket_purchase	-10	2026-04-28 12:17:28.237788	0050611d-df32-43e0-a7ed-14d0597721b6
29e0aaf7-9fce-4f40-88e6-e0d42ada6d77	ticket_purchase	-10	2026-04-28 12:17:28.390208	828dc130-d300-4f90-93c8-e900584c08ee
bd1ee976-e891-47ad-ae69-bae6af488a08	ticket_purchase	-10	2026-04-28 12:17:28.545824	07d8a070-5ce6-4af9-b87f-d5952b54d087
5f9396b1-d93a-46e9-adb3-0970bf25df7b	ticket_purchase	-10	2026-04-28 12:17:28.70711	2effa02f-cc27-460c-848f-2e92c9515a1e
d8a3deba-faea-49e0-bb2d-72f443f55200	ticket_purchase	-10	2026-04-28 12:17:28.862242	4f5df3de-5796-44d8-beaa-c9ace920bc13
db99f1a3-fc9c-40a5-9be4-adbcf6294280	ticket_purchase	-10	2026-04-28 12:17:29.023919	ad6a1530-9379-4e26-8dea-91ee69bc1281
49704b89-cedb-4874-ac77-340283f25a4f	ticket_purchase	-10	2026-04-28 12:17:29.183027	9c28261a-56f5-424d-88a5-a7f9e6c465a5
2555f5f6-6a36-45b5-95ae-e65d2c44126e	ticket_purchase	-10	2026-04-28 12:17:29.340718	cd5eb718-3091-478f-bc12-13091af017dc
3425131b-5681-44de-af90-a0e7aea11118	ticket_purchase	-10	2026-04-28 12:17:29.499233	86117862-5355-4bfd-a8b3-e06824f4af26
5f9f2b78-0b56-4f6f-a04b-b5ba3888be2d	ticket_purchase	-10	2026-04-28 12:17:29.661912	040dec0d-cdd1-43fd-ba36-fdd9f9731d5b
b30bbe7f-6489-40f9-b1be-bdb5539e5c1d	ticket_purchase	-10	2026-04-28 12:17:29.821241	6165832f-bbfd-4727-a3c7-b3e7fd9d92df
7dc5213f-6568-4b1e-9d17-b23472b2a567	ticket_purchase	-10	2026-04-28 12:17:29.980798	6165832f-bbfd-4727-a3c7-b3e7fd9d92df
eab5c69b-c366-4053-adf9-08ad5a38e8c7	ticket_purchase	-10	2026-04-28 12:17:30.137085	6165832f-bbfd-4727-a3c7-b3e7fd9d92df
af762ef8-ad85-4d88-81f4-1e7c4d776cde	ticket_purchase	-10	2026-04-28 12:17:30.300354	a7ae6e88-6d00-45fd-b9b8-7e29923bf694
5c20142d-54aa-4463-bea3-786c15d2aeee	deposit	50	2026-04-28 12:23:01.748886	f8d71ad2-d7b3-450a-a13c-b889c0a0bbdd
7123713a-d44e-468b-8d97-3e8d05439242	deposit	50	2026-04-28 12:23:01.913773	634e6ed2-1ca6-4633-b02a-2a804e3b8fa6
3d180d43-99ba-4163-bf28-af38e034bc9c	deposit	50	2026-04-28 12:23:02.073399	9c9d1939-89c5-4474-a808-3152f0c9b9b6
c9aaf3f4-514f-4cb8-bcb6-fd2c0ee42ef6	deposit	50	2026-04-28 12:23:02.234329	6189afd7-ac5d-494a-a501-87172a2464a4
9c48af56-1245-4a7e-8871-7dfffea0e164	deposit	50	2026-04-28 12:23:02.39667	b1f3f9cb-53cf-410e-8513-27470d89ec1b
342ebb95-176f-4107-9b11-00a4f5225579	deposit	50	2026-04-28 12:23:02.55528	a4637c72-1e81-46a3-9232-6641dfc3c35e
39efd393-4dca-4225-a8e4-7a0ba1327759	deposit	50	2026-04-28 12:23:02.719314	0a6870eb-ce45-4575-979c-c3276dcf646c
6e786bc9-fc01-4fe9-b672-9bc59c2f5ae6	deposit	50	2026-04-28 12:23:02.876734	f309c20a-a747-4225-a5f0-f6d65318aaa1
c0b5b70f-cbcf-4471-8255-157c236b0c07	deposit	50	2026-04-28 12:23:03.037441	b8e38011-0f32-45c0-a052-89597f680252
e0ac5bc9-d24a-4bc6-bf5f-fe6df158f1c0	deposit	50	2026-04-28 12:23:03.196989	381b3ab8-485c-4342-b73b-b1819c7978b5
208023bb-4906-4ce2-a39f-97694edf925c	deposit	50	2026-04-28 12:23:03.356957	393d5b2d-9748-4a59-9a02-d8a87e0196a2
ce3972c0-1e42-4409-b041-e6c1af5f45ee	deposit	50	2026-04-28 12:23:03.516233	758ec514-f62b-4043-956d-05c431b729ff
27223328-5f6f-46a0-b448-9378bb582d87	deposit	50	2026-04-28 12:23:03.674583	0050611d-df32-43e0-a7ed-14d0597721b6
ddda1f8e-2662-49f4-949e-ce4c735fde1c	deposit	50	2026-04-28 12:23:03.832337	828dc130-d300-4f90-93c8-e900584c08ee
19873a7e-4322-48a5-98a5-13f38b1c62d8	deposit	50	2026-04-28 12:23:03.99328	07d8a070-5ce6-4af9-b87f-d5952b54d087
9aa2c804-5f3c-4f50-b7fc-4b57690c0029	deposit	50	2026-04-28 12:23:04.155077	2effa02f-cc27-460c-848f-2e92c9515a1e
911e26ae-81de-46d4-9173-4ba76f0a1e1a	deposit	50	2026-04-28 12:23:04.314322	4f5df3de-5796-44d8-beaa-c9ace920bc13
4ca2c653-8326-4aa2-b3a1-06db6351a015	deposit	50	2026-04-28 12:23:04.476283	ad6a1530-9379-4e26-8dea-91ee69bc1281
f1958310-8d92-46ec-a96e-266c80afb262	deposit	50	2026-04-28 12:23:04.633482	9c28261a-56f5-424d-88a5-a7f9e6c465a5
2d5c231f-98fb-438f-97ce-e14de645e780	deposit	50	2026-04-28 12:23:04.793474	cd5eb718-3091-478f-bc12-13091af017dc
ea9ca5ff-f336-447a-9fe7-ea19a24cd844	deposit	50	2026-04-28 12:23:04.953114	86117862-5355-4bfd-a8b3-e06824f4af26
97be8db6-23b3-4171-bf09-4e9b25a75612	deposit	50	2026-04-28 12:23:05.114119	040dec0d-cdd1-43fd-ba36-fdd9f9731d5b
fa9cb08f-4712-4c82-9f20-d97fbfc16959	deposit	50	2026-04-28 12:23:05.274778	6165832f-bbfd-4727-a3c7-b3e7fd9d92df
83c6a088-607b-49f1-ac26-e8462b199713	deposit	50	2026-04-28 12:23:05.433452	a7ae6e88-6d00-45fd-b9b8-7e29923bf694
d0e73bf7-6cb4-495d-96be-7d771e82de3c	deposit	50	2026-04-28 12:23:05.602617	1c9ffdf3-4b26-4d24-84d3-91be763f09ee
75d55d7d-ba89-45ad-9c87-c05cee5a7be7	deposit	50	2026-04-28 12:23:05.765816	6ca3406a-20aa-4684-b066-cfe79361e98a
01942aa0-b34e-48de-8644-5fc806870577	deposit	50	2026-04-28 12:23:05.9262	ee012cc4-e9b7-4c1f-9078-70783d841d28
d8088e45-f8c9-402b-8188-34a765606739	deposit	50	2026-04-28 12:23:06.084302	ca64f9c8-cecd-493d-b448-6d8270911bf6
2d8f7343-3cb8-4572-849b-280a7fe66b63	deposit	50	2026-04-28 12:23:06.243529	777697e4-f28c-472c-8d0b-8a26529f9b96
00f921c3-9df4-4aec-8289-ddced96ff357	deposit	50	2026-04-28 12:23:06.404252	d8a75860-d21d-4741-9e47-01f3bfccf45b
c5a59f8b-72de-4527-9d2c-70874a267c31	deposit	50	2026-04-28 12:23:06.565324	57ab8591-9c4e-426c-91a3-293d460b8e37
e4a522b8-b0b7-4a1b-bdf4-de7beac8034a	deposit	50	2026-04-28 12:23:06.725094	e120fad0-5a80-44d4-9bb7-9762424db98e
cd0215ad-94ca-4740-8690-1ec81e80419d	deposit	50	2026-04-28 12:23:06.88587	cd55e221-f3d6-471e-9607-fceaa6e2a24b
039d554b-5761-4b20-accb-bfe72031d822	deposit	50	2026-04-28 12:23:07.044547	4fadde2d-f597-4c0e-bf0b-ab68e059a205
357621ac-1804-4f29-b72b-98fd0625ca03	deposit	50	2026-04-28 12:23:07.202643	3e4cb609-38ab-44f0-9e63-f5c00740d8e4
98aa3cde-d10a-4549-8aba-cf2f7f74022b	deposit	50	2026-04-28 12:23:07.364359	2f53a11e-a806-4be3-ba13-25f56da1ef06
b1d67101-1ca2-4b60-84f1-0d3ec072ba56	deposit	50	2026-04-28 12:23:07.523456	7198d7e5-1b7c-4b85-b6f6-3bf0cbdff132
6785779a-e6c5-4c47-bdde-c6f104579ab6	deposit	50	2026-04-28 12:23:07.68735	78ea6435-7d8a-4f9f-8cf3-731d33d5c8db
e11973f4-ef8f-4bf5-85ab-fe137f9bafd6	deposit	50	2026-04-28 12:23:07.853636	b1f05cd9-5bf9-49be-a37b-d34f38e0c8ef
72ffed58-6371-41a6-980f-fa29af99ac3e	deposit	50	2026-04-28 12:23:08.013063	baa08bce-4114-4851-b21d-214db2b94f50
90b28a4b-2c49-4c1a-a217-33d30138d0a4	ticket_purchase	-10	2026-04-28 12:23:08.042699	f8d71ad2-d7b3-450a-a13c-b889c0a0bbdd
07d771c5-96b8-4f20-a773-496f6a4b76bf	ticket_purchase	-10	2026-04-28 12:23:08.280568	634e6ed2-1ca6-4633-b02a-2a804e3b8fa6
778170a5-4f57-4eb1-9cde-0d0dec1a7e0a	ticket_purchase	-10	2026-04-28 12:23:08.512805	9c9d1939-89c5-4474-a808-3152f0c9b9b6
daf6d013-cec4-4222-804e-6b36629baec2	ticket_purchase	-10	2026-04-28 12:23:08.744602	6189afd7-ac5d-494a-a501-87172a2464a4
da3a5716-1202-4415-874f-b1668183b216	ticket_purchase	-10	2026-04-28 12:23:08.976819	b1f3f9cb-53cf-410e-8513-27470d89ec1b
1254615e-ca95-498c-a47b-d4fdc81c4517	ticket_purchase	-10	2026-04-28 12:23:09.20169	a4637c72-1e81-46a3-9232-6641dfc3c35e
002bea60-8239-49eb-b822-ecaaefd015ed	ticket_purchase	-10	2026-04-28 12:23:09.427951	0a6870eb-ce45-4575-979c-c3276dcf646c
ff563c6a-3f22-4ae3-b71e-551fa497898e	ticket_purchase	-10	2026-04-28 12:23:09.661772	f309c20a-a747-4225-a5f0-f6d65318aaa1
378fe48b-dd51-48d9-b6c1-2b81a83db8a8	ticket_purchase	-10	2026-04-28 12:23:09.895064	b8e38011-0f32-45c0-a052-89597f680252
bbd1fd9d-20a5-4f80-97e7-0373e8966c06	ticket_purchase	-10	2026-04-28 12:23:10.124922	381b3ab8-485c-4342-b73b-b1819c7978b5
e584bb2e-b53d-40e0-a9e3-5a799c8111d6	ticket_purchase	-10	2026-04-28 12:23:10.351724	393d5b2d-9748-4a59-9a02-d8a87e0196a2
ee4eff48-6c8f-4458-940b-a91f8031cef7	ticket_purchase	-10	2026-04-28 12:23:10.577726	758ec514-f62b-4043-956d-05c431b729ff
af8d45d2-9026-4369-849e-0078c961cd3a	ticket_purchase	-10	2026-04-28 12:23:10.803378	0050611d-df32-43e0-a7ed-14d0597721b6
58a9299c-7870-4e38-a093-d16f0c859f30	ticket_purchase	-10	2026-04-28 12:23:11.027146	828dc130-d300-4f90-93c8-e900584c08ee
f2ffa54a-abd3-433e-b672-fa22f76d0cec	ticket_purchase	-10	2026-04-28 12:23:11.252651	07d8a070-5ce6-4af9-b87f-d5952b54d087
fbc80131-af83-4118-8e36-266f5c87cbb9	ticket_purchase	-10	2026-04-28 12:23:11.481428	2effa02f-cc27-460c-848f-2e92c9515a1e
43fb3231-e630-44b2-a728-b8d270635801	ticket_purchase	-10	2026-04-28 12:23:11.703392	4f5df3de-5796-44d8-beaa-c9ace920bc13
3b7dbebf-e38f-4b24-a6ff-1532523fae24	ticket_purchase	-10	2026-04-28 12:23:11.935824	ad6a1530-9379-4e26-8dea-91ee69bc1281
d8aacb6e-eec0-411c-a0db-f9f50e35d359	ticket_purchase	-10	2026-04-28 12:23:12.167837	9c28261a-56f5-424d-88a5-a7f9e6c465a5
3298505b-90c4-4a16-8c6b-e92ef583e0a5	ticket_purchase	-10	2026-04-28 12:23:12.404167	cd5eb718-3091-478f-bc12-13091af017dc
a42ff128-e909-4eb3-a324-d0b729ce7c09	ticket_purchase	-10	2026-04-28 12:23:12.637976	86117862-5355-4bfd-a8b3-e06824f4af26
b9426029-9e00-4710-bce1-d448d33b50fc	ticket_purchase	-10	2026-04-28 12:23:12.869956	040dec0d-cdd1-43fd-ba36-fdd9f9731d5b
bd3136d9-7fc7-4b9e-9a33-61852bb16666	ticket_purchase	-10	2026-04-28 12:23:13.095538	6165832f-bbfd-4727-a3c7-b3e7fd9d92df
ff8a8142-45e8-4d3a-87c3-fa4b090f1f93	ticket_purchase	-10	2026-04-28 12:23:13.323761	a7ae6e88-6d00-45fd-b9b8-7e29923bf694
dafc14d7-e9f3-438c-b89d-2881935d899c	ticket_purchase	-10	2026-04-28 12:23:13.551722	1c9ffdf3-4b26-4d24-84d3-91be763f09ee
0d7ae66a-50d8-420d-b93b-75bf9ee05aea	ticket_purchase	-10	2026-04-28 12:23:13.779521	6ca3406a-20aa-4684-b066-cfe79361e98a
e52e5c02-eb45-4d19-8834-651ffdcb6b5d	ticket_purchase	-10	2026-04-28 12:23:14.00771	ee012cc4-e9b7-4c1f-9078-70783d841d28
4cea370c-1a2e-4874-b134-fde5ed842a61	ticket_purchase	-10	2026-04-28 12:23:14.236838	ca64f9c8-cecd-493d-b448-6d8270911bf6
54fe73a9-278a-40ce-9686-8bb8e3955bff	ticket_purchase	-10	2026-04-28 12:23:14.470537	777697e4-f28c-472c-8d0b-8a26529f9b96
830a1014-26bb-403d-8026-2217517b52ed	ticket_purchase	-10	2026-04-28 12:23:14.639945	d8a75860-d21d-4741-9e47-01f3bfccf45b
7294493f-922b-4d95-9e2c-60355cb30491	ticket_purchase	-10	2026-04-28 12:23:14.811506	57ab8591-9c4e-426c-91a3-293d460b8e37
34a42568-062c-4398-aa55-ffed808830de	ticket_purchase	-10	2026-04-28 12:23:14.979555	e120fad0-5a80-44d4-9bb7-9762424db98e
7e559335-7137-4c85-a2d3-00c3e2a7a7b3	ticket_purchase	-10	2026-04-28 12:23:15.145597	cd55e221-f3d6-471e-9607-fceaa6e2a24b
aa7b8a83-dd7e-443b-b721-84cf06cf1e17	ticket_purchase	-10	2026-04-28 12:23:15.307838	4fadde2d-f597-4c0e-bf0b-ab68e059a205
910bddc0-8166-4311-baa9-f92e9224cbeb	ticket_purchase	-10	2026-04-28 12:23:15.472586	3e4cb609-38ab-44f0-9e63-f5c00740d8e4
5541af5d-aa56-4998-9fbc-ce4a9a824177	ticket_purchase	-10	2026-04-28 12:23:15.652553	2f53a11e-a806-4be3-ba13-25f56da1ef06
f5de97cb-68fb-4784-b385-f94c5bb9e49c	ticket_purchase	-10	2026-04-28 12:23:15.822287	7198d7e5-1b7c-4b85-b6f6-3bf0cbdff132
47f436da-63d4-4a98-a83b-ec0b6792b301	ticket_purchase	-10	2026-04-28 12:23:15.989082	78ea6435-7d8a-4f9f-8cf3-731d33d5c8db
7c334bb0-bdcd-4afb-9d73-54708c255708	ticket_purchase	-10	2026-04-28 12:23:16.15552	b1f05cd9-5bf9-49be-a37b-d34f38e0c8ef
ecbc497a-01f1-45a4-a5b3-da1fe35c7e82	ticket_purchase	-10	2026-04-28 12:23:16.321012	baa08bce-4114-4851-b21d-214db2b94f50
733756f0-91d1-4866-b834-791123fbf225	ticket_purchase	-10	2026-04-28 12:23:16.4939	f8d71ad2-d7b3-450a-a13c-b889c0a0bbdd
41bab895-66aa-4e18-8fad-d80aca264a54	ticket_purchase	-10	2026-04-28 12:23:16.719427	634e6ed2-1ca6-4633-b02a-2a804e3b8fa6
c2ca1940-c2ab-4187-8b3e-22f664b33eb2	ticket_purchase	-10	2026-04-28 12:23:16.956539	9c9d1939-89c5-4474-a808-3152f0c9b9b6
0aec0ab6-fb0d-45c5-8ec2-2e29b649dc39	ticket_purchase	-10	2026-04-28 12:23:17.184907	6189afd7-ac5d-494a-a501-87172a2464a4
344e7b5a-c53e-4dea-a2cb-633382104c3d	ticket_purchase	-10	2026-04-28 12:23:17.413931	b1f3f9cb-53cf-410e-8513-27470d89ec1b
17f0da45-9fd1-400f-994e-64e0989df544	ticket_purchase	-10	2026-04-28 12:23:17.641112	a4637c72-1e81-46a3-9232-6641dfc3c35e
9544fb55-734d-4b49-b7ac-9eb6e843b724	ticket_purchase	-10	2026-04-28 12:23:17.875135	0a6870eb-ce45-4575-979c-c3276dcf646c
07fa30dd-5447-4da8-9d70-af5811e3f232	ticket_purchase	-10	2026-04-28 12:23:18.10068	f309c20a-a747-4225-a5f0-f6d65318aaa1
5c45e8d2-c897-4747-b8d0-ed4ec882ceae	ticket_purchase	-10	2026-04-28 12:23:18.326587	b8e38011-0f32-45c0-a052-89597f680252
860c7775-2a04-466e-8ea5-a45825188e32	ticket_purchase	-10	2026-04-28 12:23:18.552564	381b3ab8-485c-4342-b73b-b1819c7978b5
11d8fda2-70f7-40fa-8627-63a06a09779c	ticket_purchase	-10	2026-04-28 12:23:18.778727	393d5b2d-9748-4a59-9a02-d8a87e0196a2
76638152-32fa-4fe5-84fa-87020fb89a89	ticket_purchase	-10	2026-04-28 12:23:19.008651	758ec514-f62b-4043-956d-05c431b729ff
fa4742bd-fdfb-4c71-8306-a752ab57cbb8	ticket_purchase	-10	2026-04-28 12:23:19.234226	0050611d-df32-43e0-a7ed-14d0597721b6
3e061d12-a503-4c18-82c3-1f8140fcf16c	ticket_purchase	-10	2026-04-28 12:23:19.457781	828dc130-d300-4f90-93c8-e900584c08ee
f27cf0ce-f728-4d6b-ad0d-b5998db746df	ticket_purchase	-10	2026-04-28 12:23:19.682254	07d8a070-5ce6-4af9-b87f-d5952b54d087
864a6f8b-fdc7-4e62-b88c-45c6b3926d15	ticket_purchase	-10	2026-04-28 12:23:19.907776	2effa02f-cc27-460c-848f-2e92c9515a1e
595bd3c1-912b-4e07-9d7b-faf69071373a	ticket_purchase	-10	2026-04-28 12:23:20.134279	4f5df3de-5796-44d8-beaa-c9ace920bc13
75bbabf2-e4e4-43d0-b3b4-3aca62181310	ticket_purchase	-10	2026-04-28 12:23:20.359568	ad6a1530-9379-4e26-8dea-91ee69bc1281
adcb114a-d3b3-46e3-9d22-4ccfca4200e9	ticket_purchase	-10	2026-04-28 12:23:20.584782	9c28261a-56f5-424d-88a5-a7f9e6c465a5
82c62f22-60dc-4d2c-8da3-3c22a7fbc473	ticket_purchase	-10	2026-04-28 12:23:20.80575	cd5eb718-3091-478f-bc12-13091af017dc
40a3f5ed-f172-484f-8989-7aa3080c6601	ticket_purchase	-10	2026-04-28 12:23:21.033658	86117862-5355-4bfd-a8b3-e06824f4af26
b1ab91b6-48c8-4358-afd3-857538325b08	ticket_purchase	-10	2026-04-28 12:23:21.258298	040dec0d-cdd1-43fd-ba36-fdd9f9731d5b
971f2896-48e3-4941-993a-5b47d6d9c45c	ticket_purchase	-10	2026-04-28 12:23:21.484305	6165832f-bbfd-4727-a3c7-b3e7fd9d92df
9cec7eb7-207f-4db8-a674-8e3c77102364	ticket_purchase	-10	2026-04-28 12:23:21.708568	a7ae6e88-6d00-45fd-b9b8-7e29923bf694
71187648-db87-44f4-8fbd-180ce941b3f1	ticket_purchase	-10	2026-04-28 12:23:21.935798	1c9ffdf3-4b26-4d24-84d3-91be763f09ee
9361a663-6ed5-4e6b-a331-a4afce0ebdc6	ticket_purchase	-10	2026-04-28 12:23:22.163683	6ca3406a-20aa-4684-b066-cfe79361e98a
34428572-c8dc-4933-a6a2-827c43522604	ticket_purchase	-10	2026-04-28 12:23:22.38702	ee012cc4-e9b7-4c1f-9078-70783d841d28
5c69baac-caf7-4d9f-ac9b-89d753e2bfaa	ticket_purchase	-10	2026-04-28 12:23:22.61254	ca64f9c8-cecd-493d-b448-6d8270911bf6
f257fd3c-e71f-4198-9006-18c182f03dd1	ticket_purchase	-10	2026-04-28 12:23:22.835675	777697e4-f28c-472c-8d0b-8a26529f9b96
6ecbe5af-c748-4382-a1ae-da3be952920f	ticket_purchase	-10	2026-04-28 12:23:23.063986	d8a75860-d21d-4741-9e47-01f3bfccf45b
28cb2121-5a16-4577-838c-9fc10fffaa0d	ticket_purchase	-10	2026-04-28 12:23:23.289825	57ab8591-9c4e-426c-91a3-293d460b8e37
b8e185a7-3f18-4fd7-b1b9-454c1061538d	ticket_purchase	-10	2026-04-28 12:23:23.515364	e120fad0-5a80-44d4-9bb7-9762424db98e
127d1528-2f14-40e1-afdd-dfec7464612d	ticket_purchase	-10	2026-04-28 12:23:23.742491	cd55e221-f3d6-471e-9607-fceaa6e2a24b
f0b8d50f-b6b0-4294-a03b-90ac65a2594b	ticket_purchase	-10	2026-04-28 12:23:23.968096	4fadde2d-f597-4c0e-bf0b-ab68e059a205
3014b387-e993-4ed3-b3d5-51492a815e3e	ticket_purchase	-10	2026-04-28 12:23:24.191759	3e4cb609-38ab-44f0-9e63-f5c00740d8e4
9b4a861a-a79c-43a5-ada6-055d15e1833c	ticket_purchase	-10	2026-04-28 12:23:24.417205	2f53a11e-a806-4be3-ba13-25f56da1ef06
29f92c2f-8775-4d82-9058-cffac90859d3	ticket_purchase	-10	2026-04-28 12:23:24.646873	7198d7e5-1b7c-4b85-b6f6-3bf0cbdff132
b1835f10-9208-4e4d-a96e-fb68daba572a	ticket_purchase	-10	2026-04-28 12:23:24.875815	78ea6435-7d8a-4f9f-8cf3-731d33d5c8db
1ce4f13b-68d1-4156-b605-9ae108a7cb6e	ticket_purchase	-10	2026-04-28 12:23:25.100548	b1f05cd9-5bf9-49be-a37b-d34f38e0c8ef
fe51ac32-2899-4b34-b27d-e4cc491fdd3a	ticket_purchase	-10	2026-04-28 12:23:25.326547	baa08bce-4114-4851-b21d-214db2b94f50
75511af4-4e5e-4aef-866d-bfad02ce5e6f	deposit	15	2026-04-28 12:54:18.284537	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
e2e69937-026f-44da-967d-c50b1cf5db87	deposit	12	2026-04-28 12:54:22.043671	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
d77539bb-575f-4d9c-8742-be9cb63aed5f	ticket_purchase	-10	2026-04-28 12:56:41.050604	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
595a612c-c50b-4bf4-8131-657477abdce4	ticket_purchase	-10	2026-04-28 12:56:44.934892	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
a772f6da-3cf3-41d3-83fa-60f6b8ce4846	deposit	500	2026-04-28 12:58:48.97077	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
f7b90c2c-3499-48a6-9fce-f7b979dc4597	ticket_purchase	-10	2026-04-28 12:58:52.047223	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
056417ab-654f-4275-9d96-58ee43348049	withdrawal	-150	2026-04-28 13:11:58.493201	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
3aedd475-54aa-4a7f-a892-acfea524f591	ticket_purchase	-80	2026-04-28 13:13:01.21989	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
70406bf5-2a60-44e7-8052-ca675f81e657	deposit	15	2026-04-28 13:36:47.951624	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
d504869d-9d9e-432c-a0bb-9fda7e471b1a	deposit	6360	2026-04-28 13:37:05.971987	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
9a5dc6c1-c4e0-4b13-83fc-6bb8a1e231d0	deposit	125	2026-04-28 13:37:13.627999	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
23078810-e62f-4595-b7e3-4696adb4a997	ticket_purchase	-10	2026-04-28 13:39:51.055711	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
cc1c9e71-5703-4f4f-ae0e-5540a1fae281	ticket_purchase	-10	2026-04-28 13:39:51.23062	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
4aead77c-ac57-4bc5-8ba9-b881bef28f39	ticket_purchase	-80	2026-04-28 13:49:01.457071	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
d9dd76a6-3c34-4815-a9a8-3cfff5cec71d	ticket_purchase	-10	2026-04-28 13:49:03.842475	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
3862df6f-6986-4a09-a9e6-f3cc12497248	ticket_purchase	-10	2026-04-28 13:49:08.594429	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
225e14f3-9ac9-4258-85ff-045d53987df3	deposit	76.67	2026-04-28 13:52:10.605138	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
371edb66-0ce3-4b12-9d0e-857e0221470b	deposit	44	2026-04-28 13:55:20.259091	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
7fff523a-3dbe-4ca8-9aa7-bef19b227ce2	ticket_purchase	-80	2026-04-28 13:57:39.562237	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
acdc3571-f672-4547-8ba7-2c50aabd5192	ticket_purchase	-80	2026-04-28 13:57:43.217848	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
f7727144-4c32-4cac-891a-f470d8665c71	ticket_purchase	-80	2026-04-28 14:17:35.710087	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
cdd26794-55c2-4788-9b4b-00b86d57b630	deposit	160	2026-04-28 14:19:34.508529	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
3464c822-bff3-4ff2-bd4d-2780d5c430f3	deposit	80	2026-04-28 14:20:19.396801	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
6375dee0-3d31-4305-96e1-d8b9d55604ee	withdrawal	-6767	2026-04-28 14:27:08.305811	8518d4cd-08bc-43fa-bfeb-cba3e26d186d
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password, firstname, lastname, role, balance, "createdAt", "updatedAt", "deletedAt") FROM stdin;
8518d4cd-08bc-43fa-bfeb-cba3e26d186d	r.thibaut@myskolae.fr	$2b$10$auhi5iftThz5Dhgzyh1F..QBFNvEkQolBrzFWPjaCGYjfFtbthBIi	Rémy	THIBAUT	super_admin	0.6700000000000728	2026-04-26 08:14:20.538677	2026-04-28 14:27:08.274392	\N
01802cb8-fb77-4374-9644-1fa9bafbd650	sarah.david@email.com	$2b$10$KlRFd7P5744BdcMMKG35G.yhF9O7XYf2wOHYaN6TI8osc9lwE6Hqa	Sarah	David	employee	0	2026-04-28 11:56:53.090241	2026-04-28 11:56:53.147304	\N
9d35dc06-22db-496c-9a63-2ba83c2788f4	nathan.garcia@email.com	$2b$10$EFTMmSaJ9ZYZUhsUFGa0m.3lJBEHRRB5ztk/XCHmuHCcv7lJ4VY9C	Nathan	Garcia	employee	0	2026-04-28 11:56:53.005821	2026-04-28 11:56:53.200239	\N
0f14bafe-bcd3-4a3c-ade3-d345a92d95c8	camille.michel@email.com	$2b$10$To5zXW4E6RlQzHVrfnoar.zrhifTkjRWqN8FWaXYL/2Rfw.UlTcxa	Camille	Michel	employee	0	2026-04-28 11:56:52.923652	2026-04-28 11:56:53.25206	\N
07d8a070-5ce6-4af9-b87f-d5952b54d087	spectateur.vip15@email.com	$2b$10$17A8Q8aN6K73.Bpo6jgQI.YHnWum/r6WuznGMI2kKupGmGtCWNHxi	Spectateur	VIP15	user	220	2026-04-28 12:17:20.017692	2026-04-28 12:23:19.682254	\N
22135db3-a15b-4b7f-a3aa-39549ef5333f	arthur.simon@email.com	$2b$10$blqe0DQAjts4z5L2hkMgy.DpYXu7zgqIt7YGy6NM7cBgyHw2EcBse	Arthur	Simon	user	190	2026-04-28 11:56:52.839045	2026-04-28 11:56:56.651141	\N
8b0c2fef-b6e4-47e1-8d6b-d50a089616e2	alice.dupont@email.com	$2b$10$gWrdkcV6Dq.5XFmzsHwaceaSRT87hoie6A4UlewXe.g0Z8rHSnlC6	Alice	Dupont	user	90	2026-04-28 11:56:51.891742	2026-04-28 11:57:00.404377	\N
dffd4415-945d-48a1-b554-661123954484	julie.laurent@email.com	$2b$10$ATmH5XbEt.yS1461AY9GyeZYsxD4l42xMbnOYQxA9O.wXleDxbQTi	Julie	Laurent	user	40	2026-04-28 11:56:52.753131	2026-04-28 11:56:57.035545	\N
856c4f3a-7803-41f4-8ed3-02f77f2f3444	louis.moreau@email.com	$2b$10$HQ8kENudpZD.Sv/zn5wydOWm60z72P4niJdMCPaoyFlblbC1r7j8a	Louis	Moreau	user	140	2026-04-28 11:56:52.662494	2026-04-28 11:56:57.386671	\N
b1f3f9cb-53cf-410e-8513-27470d89ec1b	spectateur.vip5@email.com	$2b$10$q8Pg05lVv26awcqwePzcjecktjG5aplocrphEA.k5EzRFCQGgslSm	Spectateur	VIP5	user	220	2026-04-28 12:17:17.600557	2026-04-28 12:23:17.413931	\N
b4dc8e69-026f-4b55-805f-25ae87ad63a8	chloe.durand@email.com	$2b$10$.icQJ9Ox6FYWN8jZwunrQ.u81uH./m.S7NoYCwpBfYhAxj51dIjvi	Chloé	Durand	user	190	2026-04-28 11:56:52.566632	2026-04-28 11:56:57.731627	\N
371048e0-bad1-42ab-8996-27113b22fc04	gabriel.richard@email.com	$2b$10$XEZSMF8LiGq./p9352zV0er8Yk3KgoJyA65Mbe.vLF27arL5sEisi	Gabriel	Richard	user	50	2026-04-28 11:56:52.482159	2026-04-28 11:56:58.026823	\N
1f3bbe23-e0e1-4c14-8360-459ac3e9ec15	lea.robert@email.com	$2b$10$8NzuxeXGrvmGktSzoq9uq.lT85ay0oSs0o4KajIdemPNfwNDVQ3RC	Léa	Robert	user	90	2026-04-28 11:56:52.39812	2026-04-28 11:56:58.301864	\N
a4637c72-1e81-46a3-9232-6641dfc3c35e	spectateur.vip6@email.com	$2b$10$ocmAMX6YQaOFiWE/asW5OOvsy5L9lEyvkghYeh4jxU8OTL3hUnu7.	Spectateur	VIP6	user	220	2026-04-28 12:17:17.844296	2026-04-28 12:23:17.641112	\N
8b65fc13-d8f6-4b2f-b46e-8510ec2d07e6	hugo.petit@email.com	$2b$10$vCDSQrgr0A8G6MQuj4JnCuJRL9C5jaOOUl3dXln4dTZoic1isicpi	Hugo	Petit	user	190	2026-04-28 11:56:52.314096	2026-04-28 11:56:58.650514	\N
23cdbfb2-457b-4708-9824-b361af3f82ce	emma.thomas@email.com	$2b$10$dZehnvuSEwovzlbzj2YUquHYyC8NlqFbzmM4f7HvgcZoe3M9mlBOu	Emma	Thomas	user	140	2026-04-28 11:56:52.229659	2026-04-28 11:56:59.00087	\N
0a6870eb-ce45-4575-979c-c3276dcf646c	spectateur.vip7@email.com	$2b$10$GDQA4wdjiScd/8dyo62IquFnP5jdy8PiVSPMX2WvzEsehm/pUV88a	Spectateur	VIP7	user	220	2026-04-28 12:17:18.084833	2026-04-28 12:23:17.875135	\N
493aba29-e1e4-4e8d-b414-dfe28226be8e	lucas.bernard@email.com	$2b$10$4zSK0uXqWF/Arrgz//KjEuQaB5Rkr9EbNWZBl9eA/rVWvGwwG5MSy	Lucas	Bernard	user	190	2026-04-28 11:56:52.144601	2026-04-28 11:56:59.341654	\N
bb026ed1-8348-465d-ab21-47fef9d367ea	sophie.martin@email.com	$2b$10$YngK9CGqbdxKo5uDedlubemQP.U8Fapne3z2Hn0.1TBftyTrVMMH6	Sophie	Martin	user	40	2026-04-28 11:56:52.060832	2026-04-28 11:56:59.704061	\N
2a2dc663-c5d3-4132-a238-863b4079bf64	martin.luther@email.com	$2b$10$m1g.w3.boSizVVvYsdwAdeyvpOr6u2fsZLy4dPX/E4E8ZDTuJxnU6	Martin	Luther	user	90	2026-04-28 11:56:51.976861	2026-04-28 11:57:00.054175	\N
f309c20a-a747-4225-a5f0-f6d65318aaa1	spectateur.vip8@email.com	$2b$10$GcXHbwceQ7hqv5ehiuhPre3RIPCtJzEreds2yPjccxXIhibf8xfxW	Spectateur	VIP8	user	220	2026-04-28 12:17:18.328895	2026-04-28 12:23:18.10068	\N
b8e38011-0f32-45c0-a052-89597f680252	spectateur.vip9@email.com	$2b$10$PFCBJMtzKR4lPefqeMkCku49y.G0jdLf.73iO8EfzOPdHiXAMnJzm	Spectateur	VIP9	user	220	2026-04-28 12:17:18.569487	2026-04-28 12:23:18.326587	\N
381b3ab8-485c-4342-b73b-b1819c7978b5	spectateur.vip10@email.com	$2b$10$4mJmc7sesWe4eNfrrND/Ne/3y93btXQGXO/vEUv4AgbcOzvM3Itsq	Spectateur	VIP10	user	220	2026-04-28 12:17:18.809281	2026-04-28 12:23:18.552564	\N
393d5b2d-9748-4a59-9a02-d8a87e0196a2	spectateur.vip11@email.com	$2b$10$vPTA2CV7xPtyzXkOxXsOBuUyAOcdIAMcM3lyz3x6IewG9DePlX1ta	Spectateur	VIP11	user	220	2026-04-28 12:17:19.054737	2026-04-28 12:23:18.778727	\N
758ec514-f62b-4043-956d-05c431b729ff	spectateur.vip12@email.com	$2b$10$KzexWh83qDrqrWwsbxzIp.3Xw97J65sy.vmxDkDbSFmJq3Rq/THui	Spectateur	VIP12	user	220	2026-04-28 12:17:19.298542	2026-04-28 12:23:19.008651	\N
0050611d-df32-43e0-a7ed-14d0597721b6	spectateur.vip13@email.com	$2b$10$GoaocSAypvcg9OYmWt3NiOLfs682tlkdd3tv0K7QPoVuCFB1H/k8W	Spectateur	VIP13	user	220	2026-04-28 12:17:19.53723	2026-04-28 12:23:19.234226	\N
828dc130-d300-4f90-93c8-e900584c08ee	spectateur.vip14@email.com	$2b$10$M2ux3gGaBPXF8g/ywc76QeSbJ16.VZwKFQ4NVB.owbLLNA5TU6Zci	Spectateur	VIP14	user	220	2026-04-28 12:17:19.777096	2026-04-28 12:23:19.457781	\N
2effa02f-cc27-460c-848f-2e92c9515a1e	spectateur.vip16@email.com	$2b$10$GNCgNUDiFpCpLs2YQiNn5.h9fk.ANsQQ7S4KOP8KeTUp9vK5l9MBK	Spectateur	VIP16	user	220	2026-04-28 12:17:20.258047	2026-04-28 12:23:19.907776	\N
4f5df3de-5796-44d8-beaa-c9ace920bc13	spectateur.vip17@email.com	$2b$10$cErEupAZm3/6FAFLLSPV5OsKJd8cnKqPC0KmgZ9IJjvQb.IXbkDBi	Spectateur	VIP17	user	220	2026-04-28 12:17:20.499419	2026-04-28 12:23:20.134279	\N
ad6a1530-9379-4e26-8dea-91ee69bc1281	spectateur.vip18@email.com	$2b$10$qBMvxvB.SMnhEEx13VvznO2EJ.34n8EP2ACL04s3vKTMCDfDhKnwa	Spectateur	VIP18	user	220	2026-04-28 12:17:20.742056	2026-04-28 12:23:20.359568	\N
9c28261a-56f5-424d-88a5-a7f9e6c465a5	spectateur.vip19@email.com	$2b$10$2iXQTR6kU./wwG0piM5O8eAtpKkdGOLlw.CrP48LelJJx15L/9L1e	Spectateur	VIP19	user	220	2026-04-28 12:17:20.996547	2026-04-28 12:23:20.584782	\N
cd5eb718-3091-478f-bc12-13091af017dc	spectateur.vip20@email.com	$2b$10$pPonEa.i/jnVfD9g7Rm3JOJSDY7bd.MThL6KLgSGqer0oTr1TfN6u	Spectateur	VIP20	user	220	2026-04-28 12:17:21.239443	2026-04-28 12:23:20.80575	\N
86117862-5355-4bfd-a8b3-e06824f4af26	spectateur.vip21@email.com	$2b$10$03XC9opDNxLQyLYpi19yHOEiPSMmy.Jgu9Mc2P/b7t7VudAXZ3fs6	Spectateur	VIP21	user	220	2026-04-28 12:17:21.47856	2026-04-28 12:23:21.033658	\N
040dec0d-cdd1-43fd-ba36-fdd9f9731d5b	spectateur.vip22@email.com	$2b$10$KWpM9eJ93wyyBYeDVsmgrezv/lu.UgmSB.S4RkNPruSwwTBXRhwUC	Spectateur	VIP22	user	220	2026-04-28 12:17:21.722402	2026-04-28 12:23:21.258298	\N
6165832f-bbfd-4727-a3c7-b3e7fd9d92df	spectateur.vip23@email.com	$2b$10$TaAWc5eWNgQrLzJ2ngqpw.aBHMnA2aZZy9AkD8SPDULkz1uEjQEsO	Spectateur	VIP23	user	200	2026-04-28 12:17:21.965457	2026-04-28 12:23:21.484305	\N
a7ae6e88-6d00-45fd-b9b8-7e29923bf694	spectateur.vip24@email.com	$2b$10$FkpsFqUmdT841nw6ARo.hu9TQC/VVU747b5iHfeuQMikOe3/HniQ.	Spectateur	VIP24	user	220	2026-04-28 12:17:22.206546	2026-04-28 12:23:21.708568	\N
1c9ffdf3-4b26-4d24-84d3-91be763f09ee	spectateur.vip25@email.com	$2b$10$V2tvHGYhAZjwBjCYYdugIep.3NVZkCqOMAeXBD4QrifOQaz4Jdbta	Spectateur	VIP25	user	230	2026-04-28 12:17:22.454187	2026-04-28 12:23:21.935798	\N
6ca3406a-20aa-4684-b066-cfe79361e98a	spectateur.vip26@email.com	$2b$10$SnIVEz8xvbWRep/cSDo2J.JMjFqFIgqXQFdBEuYMZljjtcq0DE5Sy	Spectateur	VIP26	user	230	2026-04-28 12:17:22.694676	2026-04-28 12:23:22.163683	\N
9c9d1939-89c5-4474-a808-3152f0c9b9b6	spectateur.vip3@email.com	$2b$10$eFxZd5BW4OlcPictW9jtoe7T9WnsxiPYrLfQuLS5pjAzfobM8zkBG	Spectateur	VIP3	user	220	2026-04-28 12:17:17.114732	2026-04-28 12:23:16.956539	\N
f8d71ad2-d7b3-450a-a13c-b889c0a0bbdd	spectateur.vip1@email.com	$2b$10$Fqf59X0BtM.Ob93zjejGMuBxFlGdmxKo0YSeBcccty5LwTRp6CEv.	Spectateur	VIP1	user	220	2026-04-28 12:17:16.628216	2026-04-28 12:23:16.4939	\N
634e6ed2-1ca6-4633-b02a-2a804e3b8fa6	spectateur.vip2@email.com	$2b$10$5C/xgchRXTpnC2c2hko7LeMVEr6RyCYgfU97xphF2Em8qg4HZUuF2	Spectateur	VIP2	user	220	2026-04-28 12:17:16.870748	2026-04-28 12:23:16.719427	\N
6189afd7-ac5d-494a-a501-87172a2464a4	spectateur.vip4@email.com	$2b$10$ry/j/eMQKHbir8dvEVNPO.7/DtCt7w37J.mmKRBsMksQfX4rkPVk6	Spectateur	VIP4	user	220	2026-04-28 12:17:17.356292	2026-04-28 12:23:17.184907	\N
7198d7e5-1b7c-4b85-b6f6-3bf0cbdff132	spectateur.vip37@email.com	$2b$10$Gj6X0W6UaftCYTF1MAHWAuls6xDqy83FnYLxXUg4xpRSVSCi1MjcC	Spectateur	VIP37	user	230	2026-04-28 12:17:25.399904	2026-04-28 12:23:24.646873	\N
78ea6435-7d8a-4f9f-8cf3-731d33d5c8db	spectateur.vip38@email.com	$2b$10$KYdXSSIYaeASqMqX8KbIMe6fdgr9H3Q8lUM2oO/gqy2IIJdYGYiw.	Spectateur	VIP38	user	230	2026-04-28 12:17:25.640658	2026-04-28 12:23:24.875815	\N
b1f05cd9-5bf9-49be-a37b-d34f38e0c8ef	spectateur.vip39@email.com	$2b$10$pRy3b5SPC9/iDzL8n50IR.C98pisuca1XVJ5uqXOB.FM5vFXF.MUi	Spectateur	VIP39	user	230	2026-04-28 12:17:25.883922	2026-04-28 12:23:25.100548	\N
baa08bce-4114-4851-b21d-214db2b94f50	spectateur.vip40@email.com	$2b$10$OHZh46n/K14vCudBKDT62eG060WZqVAn5CqihgM/UexVAsUjqVCem	Spectateur	VIP40	user	230	2026-04-28 12:17:26.12626	2026-04-28 12:23:25.326547	\N
ee012cc4-e9b7-4c1f-9078-70783d841d28	spectateur.vip27@email.com	$2b$10$I23s8eMJZ2c7jWkCCA4F.OLV4Tp.bX3HoDOZhB4ANNZ4FIl9pA5H2	Spectateur	VIP27	user	230	2026-04-28 12:17:22.936719	2026-04-28 12:23:22.38702	\N
ca64f9c8-cecd-493d-b448-6d8270911bf6	spectateur.vip28@email.com	$2b$10$0JoA2MoNbZTDJWBKFI71p.beIBh3KSQNCSEaNQPcfI/GT/GRAhUrC	Spectateur	VIP28	user	230	2026-04-28 12:17:23.200551	2026-04-28 12:23:22.61254	\N
777697e4-f28c-472c-8d0b-8a26529f9b96	spectateur.vip29@email.com	$2b$10$9ybqiAzuhPnfHnrmKRmiDeY57psXSadp/YTjwZ7x7AkGsse/TL3l6	Spectateur	VIP29	user	230	2026-04-28 12:17:23.443535	2026-04-28 12:23:22.835675	\N
d8a75860-d21d-4741-9e47-01f3bfccf45b	spectateur.vip30@email.com	$2b$10$emw2e4vZxRnypwKcblPFTOAeA3T55yu1gBfuAxEtWHwci9beiO5l6	Spectateur	VIP30	user	230	2026-04-28 12:17:23.700698	2026-04-28 12:23:23.063986	\N
57ab8591-9c4e-426c-91a3-293d460b8e37	spectateur.vip31@email.com	$2b$10$p4FiEiFi17v7Wqyr4XM8SOG4cwt7136OVlgWGeJaUNbCa0V1l1eGa	Spectateur	VIP31	user	230	2026-04-28 12:17:23.944902	2026-04-28 12:23:23.289825	\N
e120fad0-5a80-44d4-9bb7-9762424db98e	spectateur.vip32@email.com	$2b$10$WKWMBYXE72VCM9X8XhO0vuEZyMjSGyrZLrhIDqZu/xX3o2egyQ4ze	Spectateur	VIP32	user	230	2026-04-28 12:17:24.191396	2026-04-28 12:23:23.515364	\N
cd55e221-f3d6-471e-9607-fceaa6e2a24b	spectateur.vip33@email.com	$2b$10$/hpj/tVYRBLORYluNu9oxe2bZn5rs/nRANL0ux43EQajn40xQy7Bq	Spectateur	VIP33	user	230	2026-04-28 12:17:24.430541	2026-04-28 12:23:23.742491	\N
4fadde2d-f597-4c0e-bf0b-ab68e059a205	spectateur.vip34@email.com	$2b$10$rS3mzIGBGbitnosaekyyB.wQXg05EpBehfE.S9ckf/L1PLbkH0h3K	Spectateur	VIP34	user	230	2026-04-28 12:17:24.6707	2026-04-28 12:23:23.968096	\N
3e4cb609-38ab-44f0-9e63-f5c00740d8e4	spectateur.vip35@email.com	$2b$10$0mtHeRijT2SQ6KsfAiHFc.N6AhgCwRZruPvfTOELTnao5S7QwsMEe	Spectateur	VIP35	user	230	2026-04-28 12:17:24.914146	2026-04-28 12:23:24.191759	\N
2f53a11e-a806-4be3-ba13-25f56da1ef06	spectateur.vip36@email.com	$2b$10$Vy47D4c8B.cfwyviaNBJ1.TRa0iHfS4WCJw8K7kYrgk3GKlWK09gy	Spectateur	VIP36	user	230	2026-04-28 12:17:25.155645	2026-04-28 12:23:24.417205	\N
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.migrations_id_seq', 17, true);


--
-- Name: movie-genre_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."movie-genre_id_seq"', 12, true);


--
-- Name: movie_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.movie_id_seq', 15, true);


--
-- Name: projection-type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."projection-type_id_seq"', 3, true);


--
-- Name: room-image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."room-image_id_seq"', 18, true);


--
-- Name: room_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.room_id_seq', 16, true);


--
-- Name: screening_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.screening_id_seq', 12, true);


--
-- Name: ticket_price_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ticket_price_id_seq', 3, true);


--
-- Name: ticket_usage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ticket_usage_id_seq', 75, true);


--
-- Name: tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tickets_id_seq', 129, true);


--
-- Name: ticket_usage PK_0c8d23445b4deff5526c8d9ee25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_usage
    ADD CONSTRAINT "PK_0c8d23445b4deff5526c8d9ee25" PRIMARY KEY (id);


--
-- Name: movie-genre PK_22c4f5669764285a03b48cca1e2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."movie-genre"
    ADD CONSTRAINT "PK_22c4f5669764285a03b48cca1e2" PRIMARY KEY (id);


--
-- Name: tickets PK_343bc942ae261cf7a1377f48fd0; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT "PK_343bc942ae261cf7a1377f48fd0" PRIMARY KEY (id);


--
-- Name: refresh-tokens PK_8c3ca3e3f1ad4fb45ec6b793aa0; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."refresh-tokens"
    ADD CONSTRAINT "PK_8c3ca3e3f1ad4fb45ec6b793aa0" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: transactions PK_a219afd8dd77ed80f5a862f1db9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: employees PK_b9535a98350d5b26e7eb0c26af4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY (id);


--
-- Name: screening PK_c2d7b033d46f627df8378d5ac27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screening
    ADD CONSTRAINT "PK_c2d7b033d46f627df8378d5ac27" PRIMARY KEY (id);


--
-- Name: room PK_c6d46db005d623e691b2fbcba23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY (id);


--
-- Name: movie PK_cb3bb4d61cf764dc035cbedd422; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movie
    ADD CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY (id);


--
-- Name: employees_schedules PK_edca5e0a599bc6300be102ff35e; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees_schedules
    ADD CONSTRAINT "PK_edca5e0a599bc6300be102ff35e" PRIMARY KEY (id);


--
-- Name: room-image PK_fb1ce6dc4a7089645df5e912826; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."room-image"
    ADD CONSTRAINT "PK_fb1ce6dc4a7089645df5e912826" PRIMARY KEY (id);


--
-- Name: ticket_price PK_fd298dee3debbf2183a91a28eb9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_price
    ADD CONSTRAINT "PK_fd298dee3debbf2183a91a28eb9" PRIMARY KEY (id);


--
-- Name: projection-type PK_projection_type; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."projection-type"
    ADD CONSTRAINT "PK_projection_type" PRIMARY KEY (id);


--
-- Name: employees REL_2d83c53c3e553a48dadb9722e3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "REL_2d83c53c3e553a48dadb9722e3" UNIQUE (user_id);


--
-- Name: IDX_a38c7ff599d54b3e4137ad15f0; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "IDX_a38c7ff599d54b3e4137ad15f0" ON public.ticket_usage USING btree (ticket_id, screening_id);


--
-- Name: movie FK_2d145b3164d0e5a4bf03eddf15d; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.movie
    ADD CONSTRAINT "FK_2d145b3164d0e5a4bf03eddf15d" FOREIGN KEY (genre_id) REFERENCES public."movie-genre"(id);


--
-- Name: ticket_price FK_2d5438e6a0752e6508e94a8b1c4; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_price
    ADD CONSTRAINT "FK_2d5438e6a0752e6508e94a8b1c4" FOREIGN KEY (projection_type_id) REFERENCES public."projection-type"(id);


--
-- Name: employees FK_2d83c53c3e553a48dadb9722e38; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "FK_2d83c53c3e553a48dadb9722e38" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: tickets FK_2e445270177206a97921e461710; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT "FK_2e445270177206a97921e461710" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: refresh-tokens FK_36f06086d2187ca909a4cf79030; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."refresh-tokens"
    ADD CONSTRAINT "FK_36f06086d2187ca909a4cf79030" FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: employees_schedules FK_66dd6ed1015a2ec6032d6ae1eb9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.employees_schedules
    ADD CONSTRAINT "FK_66dd6ed1015a2ec6032d6ae1eb9" FOREIGN KEY (employee_id) REFERENCES public.employees(id);


--
-- Name: transactions FK_6bb58f2b6e30cb51a6504599f41; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: ticket_usage FK_8c7f6bfc2816a86e444c351f831; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_usage
    ADD CONSTRAINT "FK_8c7f6bfc2816a86e444c351f831" FOREIGN KEY (ticket_id) REFERENCES public.tickets(id);


--
-- Name: ticket_usage FK_a6bef4048b006713fe363a047a5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_usage
    ADD CONSTRAINT "FK_a6bef4048b006713fe363a047a5" FOREIGN KEY (screening_id) REFERENCES public.screening(id);


--
-- Name: screening FK_d0edf6ec9af6f344e5aeb463a0c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screening
    ADD CONSTRAINT "FK_d0edf6ec9af6f344e5aeb463a0c" FOREIGN KEY (room_id) REFERENCES public.room(id);


--
-- Name: room FK_d783db96fde79406c45fe280a54; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT "FK_d783db96fde79406c45fe280a54" FOREIGN KEY (projection_type_id) REFERENCES public."projection-type"(id);


--
-- Name: room-image FK_d7dc3b92a187eaae3d05f924875; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."room-image"
    ADD CONSTRAINT "FK_d7dc3b92a187eaae3d05f924875" FOREIGN KEY (room_id) REFERENCES public.room(id);


--
-- Name: screening FK_f6541a70adcd0716eef90407526; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.screening
    ADD CONSTRAINT "FK_f6541a70adcd0716eef90407526" FOREIGN KEY (movie_id) REFERENCES public.movie(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 7ycejSctziqh2aY3YEoZWxA4UDy8VoXhCrpXGtrsunhBO5djrWqFxRQPJWTz3Cc

