import { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ArrowDownRight,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ArrowUp,
  BriefcaseBusiness,
  Check,
  CircleHelp,
  Code2,
  ExternalLink,
  Eye,
  FileText,
  Globe2,
  GraduationCap,
  LayoutDashboard,
  Link2,
  LoaderCircle,
  LogOut,
  Plus,
  Settings2,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import "./App.css";

type Profile = {
  email: string;
  fullName: string | null;
  headline: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  location: string | null;
  phone: string | null;
};
type Skill = { id: number; name: string; category: string | null };
type Project = {
  id: number;
  name: string;
  shortDescription: string | null;
  description: string | null;
  imageUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  technologies: string[];
  displayOrder: number;
};
type Portfolio = {
  title: string;
  slug: string;
  template: string;
  published: boolean;
  publishedAt: string | null;
};
type PublicData = {
  portfolio: Portfolio;
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  education: ResumeItem[];
  experience: ResumeItem[];
  socialLinks: { id: number; platform: string; url: string }[];
};
type PreviewOverrides = {
  portfolio?: Partial<Portfolio>;
  profile?: Partial<Profile>;
  skills?: Skill[];
  projects?: Project[];
  education?: ResumeItem[];
  experience?: ResumeItem[];
  socialLinks?: { id: number; platform: string; url: string }[];
};
const queryClient = new QueryClient();
const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
const profileSchema = z.object({
  fullName: z.string().max(120),
  headline: z.string().max(160),
  bio: z.string().max(3000),
  location: z.string().max(120),
  phone: z.string().max(40),
});
const projectSchema = z.object({
  name: z.string().trim().min(1, "Give your project a name").max(120),
  shortDescription: z.string().max(300),
  description: z.string().max(4000),
  imageUrl: z.string(),
  githubUrl: z.string(),
  liveUrl: z.string(),
  technologies: z.string(),
});
const authSchema = z.object({
  email: z.string().email("Enter a valid email address").max(254),
  password: z.string().min(8, "Use at least 8 characters").max(72),
});
type AuthFields = z.infer<typeof authSchema>;

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("apb-token");
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || "Something went wrong. Please try again.");
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}
function useData<T>(key: string, path: string) {
  return useQuery({
    queryKey: [key],
    queryFn: () => api<T>(path),
    enabled: !!localStorage.getItem("apb-token"),
  });
}
function tabFromPath(path: string) {
  const part = path.split("/").filter(Boolean).at(-1);
  return (
    (
      {
        profile: "Profile",
        projects: "Projects",
        skills: "Skills",
        experience: "Experience",
        education: "Education",
        "social-links": "Social links",
        github: "GitHub",
        ai: "AI assistant",
        templates: "Appearance",
        preview: "Preview",
        settings: "Appearance",
      } as Record<string, string>
    )[part || ""] || "Overview"
  );
}
function pathFromTab(tab: string) {
  return (
    (
      {
        Overview: "/dashboard",
        Profile: "/dashboard/profile",
        Projects: "/dashboard/projects",
        Skills: "/dashboard/skills",
        Experience: "/dashboard/experience",
        Education: "/dashboard/education",
        "Social links": "/dashboard/social-links",
        GitHub: "/dashboard/github",
        "AI assistant": "/dashboard/ai",
        Appearance: "/dashboard/templates",
        Preview: "/dashboard/preview",
      } as Record<string, string>
    )[tab] || "/dashboard"
  );
}
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage register />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/portfolio/:slug" element={<PublicPortfolio />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function Home() {
  const token = localStorage.getItem("apb-token");
  return (
    <main className="landing">
      <nav className="landing-nav">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <Code2 size={19} />
          </span>
          folio<span className="brand-light">craft</span>
        </Link>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
        </div>
        <div className="nav-actions">
          {token ? (
            <Link className="button button-dark" to="/dashboard">
              Open dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link className="login-link" to="/login">
                Log in
              </Link>
              <Link className="button button-dark" to="/register">
                Start building <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>
      </nav>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="pulse-dot" /> YOUR WORK, BEAUTIFULLY PRESENTED
          </div>
          <h1>
            A portfolio that
            <br />
            does <em>you</em> justice.
          </h1>
          <p className="hero-sub">
            Bring your projects, story, and skills together in a portfolio that
            feels like you. No design skills required.
          </p>
          <div className="hero-cta">
            <Link
              className="button button-primary"
              to={token ? "/dashboard" : "/register"}
            >
              Build your portfolio <ArrowRight size={16} />
            </Link>
            <a className="subtle-link" href="#how">
              <span className="play-icon">▶</span> See how it works
            </a>
          </div>
          <div className="proof-row">
            <div className="avatar-stack">
              <span>J</span>
              <span>M</span>
              <span>A</span>
              <span>+</span>
            </div>
            <span>Made for people who build things</span>
          </div>
        </div>
        <div className="hero-art">
          <div className="art-glow" />
          <div className="float-card float-top">
            <span className="float-icon violet">
              <Sparkles size={16} />
            </span>
            <div>
              <b>AI, in your corner</b>
              <small>Find the words for your work</small>
            </div>
          </div>
          <div className="portfolio-mock">
            <div className="mock-bar">
              <span />
              <span />
              <span />
              <small>yourname.dev</small>
              <ExternalLink size={13} />
            </div>
            <div className="mock-cover">
              <span className="mock-tag">AVAILABLE FOR OPPORTUNITIES</span>
              <div className="mock-name">
                Alex Morgan<span>.</span>
              </div>
              <div className="mock-role">
                Product designer &amp; creative developer
              </div>
              <div className="mock-links">
                <i />
                <i />
                <i />
              </div>
            </div>
            <div className="mock-work">
              <div className="mock-heading">
                Selected work <span>2024 — 2026</span>
              </div>
              <div className="mock-projects">
                <div className="mock-project project-lilac">
                  <div className="mini-orbit">✳</div>
                  <b>Forma Studio</b>
                  <small>Brand · Digital</small>
                </div>
                <div className="mock-project project-peach">
                  <div className="mini-grid">▦</div>
                  <b>Common Ground</b>
                  <small>Product · Strategy</small>
                </div>
              </div>
            </div>
            <div className="mock-footer">
              <span>Designed with folio craft</span>
              <span>↗</span>
            </div>
          </div>
          <div className="float-card float-bottom">
            <div className="tiny-check">
              <Check size={14} />
            </div>
            <div>
              <b>Looking good, Alex</b>
              <small>Portfolio published</small>
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="feature-strip">
        <div>
          <WandSparkles size={18} />
          <span>AI-assisted writing</span>
        </div>
        <div>
          <LayoutDashboard size={18} />
          <span>Three thoughtful templates</span>
        </div>
        <div>
          <Eye size={18} />
          <span>Live preview as you edit</span>
        </div>
        <div>
          <Globe2 size={18} />
          <span>One link, ready to share</span>
        </div>
      </section>
      <section className="below-fold" id="how">
        <div className="section-kicker">A better way to show your work</div>
        <h2>
          From scattered links
          <br />
          to a story worth sharing.
        </h2>
        <p>
          Build a clear, confident portfolio from the things you've already
          made.
        </p>
        <div className="steps">
          <article>
            <span>01</span>
            <h3>Tell your story</h3>
            <p>Add your background, skills, and the work you're proud of.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Make it yours</h3>
            <p>Choose a visual style and see every change come to life.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Put it out there</h3>
            <p>
              Publish a clean, shareable page under your own portfolio link.
            </p>
          </article>
        </div>
      </section>
      <footer className="landing-footer">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <Code2 size={17} />
          </span>
          folio<span className="brand-light">craft</span>
        </Link>
        <span>Make room for your work.</span>
        <span>© 2026 foliocraft</span>
      </footer>
    </main>
  );
}

function AuthPage({ register = false }: { register?: boolean }) {
  const navigate = useNavigate();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFields>({ resolver: zodResolver(authSchema) });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(values: AuthFields) {
    setError("");
    setBusy(true);
    try {
      const data = await api<{ token: string }>(
        "/api/auth/" + (register ? "register" : "login"),
        { method: "POST", body: JSON.stringify(values) },
      );
      localStorage.setItem("apb-token", data.token);
      window.dispatchEvent(new Event("auth-change"));
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-shell">
      <Link to="/" className="brand">
        <span className="brand-mark">
          <Code2 size={18} />
        </span>
        folio<span className="brand-light">craft</span>
      </Link>
      <div className="auth-card">
        <div className="auth-icon">
          <Sparkles size={20} />
        </div>
        <p className="section-kicker">
          {register ? "YOUR NEXT CHAPTER" : "WELCOME BACK"}
        </p>
        <h1>{register ? "Make it yours." : "Good to see you."}</h1>
        <p className="auth-caption">
          {register
            ? "Build a portfolio that puts your work in the right light."
            : "Pick up where you left off."}
        </p>
        <form onSubmit={handleSubmit(submit)} className="stack-form">
          <label>
            Email address
            <input
              {...registerField("email")}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && (
              <small className="field-error">{errors.email.message}</small>
            )}
          </label>
          <label>
            Password
            <input
              {...registerField("password")}
              type="password"
              placeholder="At least 8 characters"
              autoComplete={register ? "new-password" : "current-password"}
            />
            {errors.password && (
              <small className="field-error">{errors.password.message}</small>
            )}
          </label>
          {error && <div className="form-error">{error}</div>}
          <button className="button button-primary full" disabled={busy}>
            {busy ? (
              <LoaderCircle className="spin" size={17} />
            ) : register ? (
              "Create your account"
            ) : (
              "Log in"
            )}
            {!busy && <ArrowRight size={16} />}
          </button>
        </form>
        <p className="auth-switch">
          {register ? "Already have an account?" : "New to foliocraft?"}{" "}
          <Link to={register ? "/login" : "/register"}>
            {register ? "Log in" : "Create an account"}
          </Link>
        </p>
      </div>
      <p className="auth-legal">
        By continuing, you agree to keep it kind and keep it yours.
      </p>
    </main>
  );
}

function Dashboard() {
  const token = localStorage.getItem("apb-token");
  const navigate = useNavigate();
  const location = useLocation();
  const query = useQueryClient();
  const [tab, setTab] = useState(() => tabFromPath(location.pathname));
  const [toast, setToast] = useState("");
  const profile = useData<Profile>("profile", "/api/profile");
  const skills = useData<Skill[]>("skills", "/api/skills");
  const projects = useData<Project[]>("projects", "/api/projects");
  const education = useData<ResumeItem[]>("resume-education", "/api/education");
  const experience = useData<ResumeItem[]>("resume-experience", "/api/experience");
  const socialLinks = useData<{ id: number; platform: string; url: string }[]>("resume-social", "/api/social-links");
  const portfolio = useData<Portfolio>("portfolio", "/api/portfolio");
  const [previewOverrides, setPreviewOverrides] = useState<PreviewOverrides>({});
  useEffect(() => {
    if (!token) navigate("/login");
    else setTab(tabFromPath(location.pathname));
  }, [token, navigate, location.pathname]);
  const navigateTab = (next: string) => {
    setTab(next);
    navigate(pathFromTab(next));
  };
  const refresh = () => {
    setPreviewOverrides({});
    return query.invalidateQueries();
  };
  const previewData: PublicData = {
    portfolio: { title: "Your portfolio", slug: "your-name", template: "minimal", published: false, publishedAt: null, ...portfolio.data, ...previewOverrides.portfolio },
    profile: { email: "", fullName: null, headline: null, bio: null, profileImageUrl: null, location: null, phone: null, ...profile.data, ...previewOverrides.profile },
    skills: previewOverrides.skills ?? skills.data ?? [],
    projects: previewOverrides.projects ?? projects.data ?? [],
    education: previewOverrides.education ?? education.data ?? [],
    experience: previewOverrides.experience ?? experience.data ?? [],
    socialLinks: previewOverrides.socialLinks ?? socialLinks.data ?? [],
  };
  const logout = () => {
    localStorage.removeItem("apb-token");
    query.clear();
    navigate("/");
  };
  const notify = (s: string) => {
    setToast(s);
    setTimeout(() => setToast(""), 2500);
  };
  const tabs = [
    "Overview",
    "Profile",
    "Projects",
    "Skills",
    "Experience",
    "Education",
    "Social links",
    "GitHub",
    "AI assistant",
    "Preview",
    "Appearance",
  ];
  if (!token) return null;
  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <Code2 size={18} />
          </span>
          folio<span className="brand-light">craft</span>
        </Link>
        <div className="workspace-label">YOUR WORKSPACE</div>
        <div className="side-nav">
          {tabs.map((name, i) => (
            <button
              key={name}
              className={`side-item ${tab === name ? "active" : ""}`}
              onClick={() => navigateTab(name)}
            >
              {
                [
                  <LayoutDashboard key="overview" />,
                  <FileText key="profile" />,
                  <BriefcaseBusiness key="projects" />,
                  <Code2 key="skills" />,
                  <BriefcaseBusiness key="experience" />,
                  <GraduationCap key="education" />,
                  <Link2 key="social" />,
                  <Code2 key="github" />,
                  <WandSparkles key="ai" />,
                  <Eye key="preview" />,
                  <Settings2 key="appearance" />,
                ][i]
              }
              <span>{name}</span>
              {name === "Overview" && <span className="side-count">↗</span>}
            </button>
          ))}
        </div>
        <div className="sidebar-spacer" />
        <div className="sidebar-help">
          <div className="help-bubble">
            <CircleHelp size={17} />
          </div>
          <b>Need a hand?</b>
          <p>Your portfolio is a work in progress. That's the fun part.</p>
          <a href="#how">
            Quick guide <ArrowUpRight size={13} />
          </a>
        </div>
        <button className="user-mini" onClick={logout}>
          <div className="user-avatar">
            {profile.data?.fullName?.[0]?.toUpperCase() || "Y"}
          </div>
          <span>
            <b>{profile.data?.fullName || "Your account"}</b>
            <small>{profile.data?.email}</small>
          </span>
          <LogOut size={16} />
        </button>
      </aside>
      <main className="dash-main">
        <header className="dash-top">
          <div className="crumb">
            <span>Workspace</span>
            <span>/</span>
            <b>{tab}</b>
          </div>
          <div className="top-right">
            <span
              className={`draft-pill ${portfolio.data?.published ? "live" : ""}`}
            >
              <i />
              {portfolio.data?.published ? "Published" : "Draft"}
            </span>
            <button className="icon-button" aria-label="Help">
              <CircleHelp size={18} />
            </button>
          </div>
        </header>
        <div className="dash-content">
          {tab === "Overview" ? (
            <Overview
              profile={profile.data}
              skills={skills.data || []}
              projects={projects.data || []}
              portfolio={portfolio.data}
              loading={profile.isLoading || projects.isLoading}
              setTab={navigateTab}
              refresh={refresh}
              notify={notify}
            />
          ) : tab === "Profile" ? (
            <ProfileEditor
              data={profile.data}
              refresh={refresh}
              setTab={navigateTab}
              onDraftChange={(draft) => setPreviewOverrides((current) => ({ ...current, profile: { ...profile.data, ...current.profile, ...draft } }))}
            />
          ) : tab === "Projects" ? (
            <ProjectsEditor
              items={projects.data || []}
              refresh={refresh}
              notify={notify}
              onDraftChange={(draft) => setPreviewOverrides((current) => ({ ...current, projects: draft }))}
            />
          ) : tab === "Skills" ? (
            <SkillsEditor
              items={skills.data || []}
              refresh={refresh}
              onDraftChange={(draft) => setPreviewOverrides((current) => ({ ...current, skills: draft }))}
            />
          ) : tab === "Experience" ? (
            <ResumeEditor kind="experience" refresh={refresh} onDraftChange={(draft) => setPreviewOverrides((current) => ({ ...current, experience: draft }))} />
          ) : tab === "Education" ? (
            <ResumeEditor kind="education" refresh={refresh} onDraftChange={(draft) => setPreviewOverrides((current) => ({ ...current, education: draft }))} />
          ) : tab === "Social links" ? (
            <ResumeEditor kind="social" refresh={refresh} onDraftChange={(draft) => setPreviewOverrides((current) => ({ ...current, socialLinks: draft.map((item) => ({ id: item.id, platform: item.platform || "", url: item.url || "" })) }))} />
          ) : tab === "GitHub" ? (
            <GithubEditor refresh={refresh} />
          ) : tab === "AI assistant" ? (
            <AiEditor
              profile={profile.data}
              refresh={refresh}
              notify={notify}
            />
          ) : tab === "Preview" ? (
            <DashboardPreview data={previewData} setTab={navigateTab} />
          ) : (
            <AppearanceEditor
              portfolio={portfolio.data}
              refresh={refresh}
              notify={notify}
              onDraftChange={(draft) => setPreviewOverrides((current) => ({ ...current, portfolio: { ...portfolio.data, ...current.portfolio, ...draft } }))}
            />
          )}
        </div>
        {toast && (
          <div className="toast">
            <Check size={15} />
            {toast}
          </div>
        )}
      </main>
    </div>
  );
}

function Overview({
  profile,
  skills,
  projects,
  portfolio,
  loading,
  setTab,
  refresh,
  notify,
}: {
  profile?: Profile;
  skills: Skill[];
  projects: Project[];
  portfolio?: Portfolio;
  loading: boolean;
  setTab: (s: string) => void;
  refresh: () => void;
  notify: (s: string) => void;
}) {
  const name = profile?.fullName?.split(" ")[0] || "there";
  const score = Math.round(
    (Number(!!profile?.fullName) +
      Number(!!profile?.headline) +
      Number(!!profile?.bio) +
      Number(skills.length > 0) +
      Number(projects.length > 0)) *
      20,
  );
  const completion = Math.min(score, 100);
  async function publish() {
    try {
      await api("/api/portfolio/publish", { method: "POST" });
      refresh();
      notify("Your portfolio is live!");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Could not publish");
    }
  }
  return (
    <>
      <div className="dash-heading">
        <div>
          <div className="section-kicker">THURSDAY, OCTOBER 1, 2026</div>
          <h1>
            Good morning, {name}
            <span className="heading-period">.</span>
          </h1>
          <p>One step closer to a portfolio that feels like you.</p>
        </div>
        <button
          className="button button-outline"
          onClick={() => setTab("Preview")}
        >
          <Eye size={16} /> Preview portfolio
        </button>
      </div>
      <div className="completion-card">
        <div className="completion-copy">
          <div className="completion-label">
            <span className="completion-icon">
              <Sparkles size={16} />
            </span>{" "}
            YOUR PORTFOLIO IS TAKING SHAPE
          </div>
          <h2>
            {completion === 100
              ? "Looking sharp."
              : "A little more, a lot more you."}
          </h2>
          <p>
            {completion < 100
              ? "Add a few details to make your first impression count."
              : "Your portfolio has everything it needs. Time to share it."}
          </p>
          <div className="completion-meter">
            <div style={{ width: `${completion}%` }} />
          </div>
          <small>
            {completion}% complete <span>·</span>{" "}
            {5 - Math.round(completion / 20)} quick steps left
          </small>
        </div>
        <div
          className="completion-ring"
          style={
            { "--progress": `${completion * 3.6}deg` } as React.CSSProperties
          }
        >
          <div>
            <b>
              {completion}
              <small>%</small>
            </b>
            <span>COMPLETE</span>
          </div>
        </div>
        <div className="confetti c1" />
        <div className="confetti c2" />
        <div className="confetti c3" />
      </div>
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-icon peach">
              <BriefcaseBusiness size={17} />
            </span>
            <span className="metric-note">IN YOUR PORTFOLIO</span>
          </div>
          <strong>{projects.length.toString().padStart(2, "0")}</strong>
          <span className="metric-name">Projects</span>
          <button onClick={() => setTab("Projects")}>
            Add your work <ArrowRight size={14} />
          </button>
        </div>
        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-icon mint">
              <Code2 size={17} />
            </span>
            <span className="metric-note">WHAT YOU KNOW</span>
          </div>
          <strong>{skills.length.toString().padStart(2, "0")}</strong>
          <span className="metric-name">Skills</span>
          <button onClick={() => setTab("Skills")}>
            Show your skills <ArrowRight size={14} />
          </button>
        </div>
        <div className="metric-card">
          <div className="metric-top">
            <span className="metric-icon lavender">
              <GraduationCap size={17} />
            </span>
            <span className="metric-note">CAREER STORY</span>
          </div>
          <strong>{profile?.headline ? "01" : "00"}</strong>
          <span className="metric-name">Profile</span>
          <button onClick={() => setTab("Profile")}>
            Polish your profile <ArrowRight size={14} />
          </button>
        </div>
      </div>
      <div className="overview-bottom">
        <section className="panel publish-panel">
          <div className="panel-title">
            <div>
              <span className="section-kicker">
                YOUR CORNER OF THE INTERNET
              </span>
              <h2>Ready when you are.</h2>
            </div>
            <span
              className={`status-orb ${portfolio?.published ? "active" : ""}`}
            >
              {portfolio?.published ? (
                <Check size={16} />
              ) : (
                <Globe2 size={16} />
              )}
            </span>
          </div>
          <p>
            {portfolio?.published
              ? "Your portfolio is live. Share it with someone who should see your work."
              : "Your portfolio is still private. Publish when it feels like you."}
          </p>
          <div className="url-preview">
            <span>
              <Globe2 size={15} />
            </span>
            <span className="url-text">
              {window.location.host}/portfolio/{portfolio?.slug || "your-name"}
            </span>
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  `${window.location.origin}/portfolio/${portfolio?.slug}`,
                )
              }
              aria-label="Copy URL"
            >
              <Link2 size={15} />
            </button>
          </div>
          <div className="panel-actions">
            <button
              className="button button-primary"
              onClick={
                portfolio?.published
                  ? () => window.open(`/portfolio/${portfolio.slug}`, "_blank")
                  : publish
              }
            >
              {portfolio?.published ? "View live site" : "Publish portfolio"}
              <ArrowUpRight size={15} />
            </button>
            <button
              className="text-button"
              onClick={() => setTab("Appearance")}
            >
              Edit settings <ArrowRight size={14} />
            </button>
          </div>
        </section>
        <section className="panel next-panel">
          <div className="section-kicker">A GOOD PLACE TO START</div>
          <h2>Your story, in your words.</h2>
          <p>
            A headline and short introduction help people understand what you
            bring to the table.
          </p>
          <button className="next-link" onClick={() => setTab("Profile")}>
            <span className="next-icon">
              <WandSparkles size={17} />
            </span>
            <span>
              <b>Write your introduction</b>
              <small>Usually takes 2 minutes</small>
            </span>
            <ArrowRight size={16} />
          </button>
          <div className="sparkle-decoration">✳</div>
        </section>
      </div>
      {loading && (
        <div className="loading-strip">
          <LoaderCircle className="spin" size={14} /> Pulling your workspace
          together…
        </div>
      )}
    </>
  );
}

function DashboardPreview({
  data,
  setTab,
}: {
  data: PublicData;
  setTab: (tab: string) => void;
}) {
  return (
    <div className="editor-page live-preview-page">
      <div className="editor-heading live-preview-heading">
        <div>
          <div className="section-kicker">A LIVE LOOK AT YOUR PORTFOLIO</div>
          <h1>Preview</h1>
          <p>Profile edits appear as you type. Saved sections update here without a page reload.</p>
        </div>
        <button className="button button-outline" onClick={() => setTab("Appearance")}>
          <Settings2 size={15} /> Edit appearance
        </button>
      </div>
      <div className="preview-live-frame">
        <PortfolioView data={data} preview />
      </div>
    </div>
  );
}

function ProfileEditor({
  data,
  refresh,
  setTab,
  onDraftChange,
}: {
  data?: Profile;
  refresh: () => void;
  setTab: (tab: string) => void;
  onDraftChange: (draft: Partial<Profile>) => void;
}) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  useEffect(() => {
    if (data) {
      setFullName(data.fullName || "");
      setHeadline(data.headline || "");
      setBio(data.bio || "");
      setProfileImageUrl(data.profileImageUrl || "");
      setLocation(data.location || "");
      setPhone(data.phone || "");
    }
  }, [data]);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    const v = profileSchema.safeParse({
      fullName,
      headline,
      bio,
      location,
      phone,
    });
    if (!v.success) {
      setMessage(v.error.issues[0]?.message || "Check the form");
      return;
    }
    setSaving(true);
    try {
      await api("/api/profile", {
        method: "PUT",
        body: JSON.stringify({
          ...v.data,
          profileImageUrl: profileImageUrl || null,
          phone,
        }),
      });
      refresh();
      setMessage("Changes saved");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to save");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="editor-page">
      <div className="editor-heading">
        <div>
          <div className="section-kicker">THE PERSON BEHIND THE WORK</div>
          <h1>Your profile</h1>
          <p>
            Give people a quick sense of who you are and what you care about.
          </p>
        </div>
        <span className="editor-badge">
          <FileText size={15} /> PERSONAL DETAILS
        </span>
      </div>
      <div className="editor-grid">
        <form className="panel editor-form" onSubmit={save}>
          <label>
            Full name
            <input
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); onDraftChange({ fullName: e.target.value }); }}
              placeholder="Alex Morgan"
            />
          </label>
          <label>
            Professional headline
            <input
              value={headline}
              onChange={(e) => { setHeadline(e.target.value); onDraftChange({ headline: e.target.value }); }}
              placeholder="Software engineer who loves the details"
            />
            <small>A clear, specific line about what you do.</small>
          </label>
          <label>
            About you
            <textarea
              rows={7}
              value={bio}
              onChange={(e) => { setBio(e.target.value); onDraftChange({ bio: e.target.value }); }}
              placeholder="A short introduction. What do you build? What gets you curious?"
            />
            <small>{bio.length}/3000 characters</small>
          </label>
          <label>
            Profile image URL
            <input
              type="url"
              value={profileImageUrl}
              onChange={(e) => { setProfileImageUrl(e.target.value); onDraftChange({ profileImageUrl: e.target.value || null }); }}
              placeholder="https://example.com/your-photo.jpg"
            />
          </label>
          <div className="form-two">
            <label>
              Location
              <input
                value={location}
                onChange={(e) => { setLocation(e.target.value); onDraftChange({ location: e.target.value }); }}
                placeholder="San Francisco, CA"
              />
            </label>
            <label>
              Phone (optional)
              <input
                value={phone}
                onChange={(e) => { setPhone(e.target.value); onDraftChange({ phone: e.target.value }); }}
                placeholder="+1 555 010 0123"
              />
            </label>
          </div>
          <div className="form-bottom">
            <span>{message}</span>
            <button className="button button-primary" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
              <Check size={15} />
            </button>
          </div>
        </form>
        <aside className="editor-aside">
          <div className="tip-card">
            <div className="tip-icon">
              <Sparkles size={18} />
            </div>
            <div className="section-kicker">A LITTLE INSPIRATION</div>
            <h3>Be specific. Be yourself.</h3>
            <p>
              The best introductions sound like a person, not a job description.
              What kind of problems do you enjoy solving?
            </p>
            <button
              className="text-button"
              type="button"
              onClick={() => setTab("AI assistant")}
            >
              Get a writing nudge <ArrowRight size={14} />
            </button>
          </div>
          <div className="preview-mini">
            <span className="section-kicker">YOUR PROFILE CARD</span>
            <div className="mini-person">
              <div className="user-avatar big">
                {fullName?.[0]?.toUpperCase() || "A"}
              </div>
              <div>
                <b>{fullName || "Your name"}</b>
                <small>{headline || "Your headline goes here"}</small>
              </div>
            </div>
            <p>
              {bio ||
                "A few thoughtful lines about you will make this feel like home."}
            </p>
            <span className="mini-location">
              <Globe2 size={13} />
              {location || "Location"}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ProjectsEditor({
  items,
  refresh,
  notify,
  onDraftChange,
}: {
  items: Project[];
  refresh: () => void;
  notify: (message: string) => void;
  onDraftChange: (draft: Project[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [busy, setBusy] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [error, setError] = useState("");
  function previewDraft(form: HTMLFormElement) {
    const values = new FormData(form);
    const draft: Project = {
      id: editing?.id ?? -1,
      name: String(values.get("name") || ""),
      shortDescription: String(values.get("shortDescription") || ""),
      description: String(values.get("description") || ""),
      imageUrl: String(values.get("imageUrl") || ""),
      githubUrl: String(values.get("githubUrl") || "") || null,
      liveUrl: String(values.get("liveUrl") || "") || null,
      technologies: String(values.get("technologies") || "").split(",").map((s) => s.trim()).filter(Boolean),
      displayOrder: editing?.displayOrder ?? items.length,
    };
    onDraftChange(editing
      ? items.map((item) => item.id === editing.id ? draft : item)
      : [...items.filter((item) => item.id !== -1), draft]);
  }
  async function suggestDescription(form: HTMLFormElement) {
    const values = new FormData(form);
    setAiBusy(true);
    setError("");
    try {
      const result = await api<{ suggestion: string }>("/api/ai/project-description", {
        method: "POST",
        body: JSON.stringify({
          projectName: values.get("name"),
          shortDescription: values.get("shortDescription"),
          technologies: String(values.get("technologies") || "")
            .split(",")
            .map((technology) => technology.trim())
            .filter(Boolean),
          repositoryInfo: values.get("githubUrl"),
        }),
      });
      const description = form.elements.namedItem("description");
      if (description instanceof HTMLTextAreaElement) {
        description.value = result.suggestion;
        previewDraft(form);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create a suggestion");
    } finally {
      setAiBusy(false);
    }
  }
  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setError("");
    const form = new FormData(formEl);
    const raw = {
      name: String(form.get("name") || ""),
      shortDescription: String(form.get("shortDescription") || ""),
      description: String(form.get("description") || ""),
      imageUrl: String(form.get("imageUrl") || ""),
      githubUrl: String(form.get("githubUrl") || ""),
      liveUrl: String(form.get("liveUrl") || ""),
      technologies: String(form.get("technologies") || ""),
    };
    const v = projectSchema.safeParse(raw);
    if (!v.success) {
      setError(v.error.issues[0]?.message || "Check the form");
      return;
    }
    setBusy(true);
    try {
      const savedProject = await api<Project>(`/api/projects${editing ? `/${editing.id}` : ""}`, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify({
          name: v.data.name,
          shortDescription: v.data.shortDescription,
          description: v.data.description,
          imageUrl: v.data.imageUrl || null,
          githubUrl: v.data.githubUrl || null,
          liveUrl: v.data.liveUrl || null,
          technologies: v.data.technologies
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          displayOrder: editing?.displayOrder ?? items.length,
        }),
      });
      const savedProjects = await api<Project[]>("/api/projects");
      if (!savedProjects.some((project) => project.id === savedProject.id)) {
        throw new Error("The server accepted the save, but the projects list did not return it. Check the backend database logs before trying again.");
      }
      await refresh();
      setOpen(false);
      setEditing(null);
      formEl.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save project");
    } finally {
      setBusy(false);
    }
  }
  async function remove(id: number) {
    if (!confirm("Remove this project from your portfolio?")) return;
    await api(`/api/projects/${id}`, { method: "DELETE" });
    await refresh();
  }
  async function moveProject(index: number, delta: number) {
    const destination = index + delta;
    if (destination < 0 || destination >= items.length || busy) return;
    const reordered = [...items];
    [reordered[index], reordered[destination]] = [reordered[destination], reordered[index]];
    setBusy(true);
    try {
      for (const [displayOrder, project] of reordered.entries()) {
        await api(`/api/projects/${project.id}`, {
          method: "PUT",
          body: JSON.stringify({ ...project, displayOrder }),
        });
      }
      await refresh();
      onDraftChange(reordered.map((project, displayOrder) => ({ ...project, displayOrder })));
      notify("Project order updated");
    } catch (err) {
      notify(err instanceof Error ? err.message : "Could not reorder projects");
      await refresh();
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="editor-page">
      <div className="editor-heading">
        <div>
          <div className="section-kicker">A FEW THINGS YOU'VE MADE</div>
          <h1>Your projects</h1>
          <p>
            Show the work you're proud of, and what you learned along the way.
          </p>
        </div>
        <button
          className="button button-primary"
          onClick={() => {
            setEditing(null);
            setOpen(!open);
          }}
        >
          <Plus size={16} /> Add a project
        </button>
      </div>
      {open && (
        <form className="panel project-form" onSubmit={create} onInput={(e) => previewDraft(e.currentTarget)}>
          <div className="project-form-head">
            <b>{editing ? "Edit project" : "New project"}</b>
            <button
              type="button"
              className="icon-button"
              onClick={() => { setOpen(false); onDraftChange(items); }}
            >
              <X size={17} />
            </button>
          </div>
          <div className="form-two">
            <label>
              Project name
              <input
                name="name"
                defaultValue={editing?.name || ""}
                placeholder="A little project you're proud of"
                required
              />
            </label>
            <label>
              One-line summary
              <input
                name="shortDescription"
                defaultValue={editing?.shortDescription || ""}
                placeholder="What it does, in a sentence"
              />
            </label>
          </div>
          <label>
            Description
            <textarea
              name="description"
              defaultValue={editing?.description || ""}
              rows={3}
              placeholder="What was the challenge? What did you build?"
            />
          </label>
          <label>
            Project image URL
            <input
              name="imageUrl"
              type="url"
              defaultValue={editing?.imageUrl || ""}
              placeholder="https://example.com/project-preview.jpg"
            />
          </label>
          <button
            type="button"
            className="text-button project-ai-button"
            disabled={aiBusy}
            onClick={(e) => suggestDescription(e.currentTarget.form!)}
          >
            {aiBusy ? <LoaderCircle className="spin" size={14} /> : <WandSparkles size={14} />}
            {aiBusy ? "Drafting…" : "Draft description with AI"}
          </button>
          <label>
            Technologies <small>comma separated</small>
            <input
              name="technologies"
              defaultValue={editing?.technologies?.join(", ") || ""}
              placeholder="React, TypeScript, PostgreSQL"
            />
          </label>
          <div className="form-two">
            <label>
              GitHub URL
              <input
                name="githubUrl"
                defaultValue={editing?.githubUrl || ""}
                type="url"
                placeholder="https://github.com/you/project"
              />
            </label>
            <label>
              Live demo URL
              <input
                name="liveUrl"
                defaultValue={editing?.liveUrl || ""}
                type="url"
                placeholder="https://your-project.com"
              />
            </label>
          </div>
          {error && <div className="form-error">{error}</div>}
          <button className="button button-primary" disabled={busy}>
            {busy ? "Saving…" : editing ? "Save changes" : "Save project"}
            <Check size={15} />
          </button>
        </form>
      )}
      <div className="project-list">
        {items.map((p, i) => (
          <article className="project-row" key={p.id}>
            <div className={`project-number pn-${i % 3}`}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="project-row-main">
              <div className="project-title-line">
                <h3>{p.name}</h3>
                <span className="project-count-label">PROJECT</span>
              </div>
              <p>
                {p.shortDescription ||
                  p.description ||
                  "Add a short description to tell people about this work."}
              </p>
              <div className="tag-list">
                {p.technologies?.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
            <div className="project-row-actions">
              <button onClick={() => moveProject(i, -1)} aria-label="Move project up" disabled={i === 0 || busy}>
                <ArrowUp size={15} />
              </button>
              <button onClick={() => moveProject(i, 1)} aria-label="Move project down" disabled={i === items.length - 1 || busy}>
                <ArrowDown size={15} />
              </button>
              <button
                onClick={() => {
                  setEditing(p);
                  setOpen(true);
                }}
                aria-label="Edit project"
              >
                <Settings2 size={15} />
              </button>
              {p.githubUrl && (
                <a href={p.githubUrl} target="_blank">
                  <Code2 size={16} />
                </a>
              )}
              {p.liveUrl && (
                <a href={p.liveUrl} target="_blank">
                  <ExternalLink size={15} />
                </a>
              )}
              <button onClick={() => remove(p.id)} aria-label="Delete project">
                <X size={15} />
              </button>
            </div>
          </article>
        ))}
        {items.length === 0 && !open && (
          <div className="empty-state">
            <span>
              <BriefcaseBusiness size={23} />
            </span>
            <h3>Your first project goes here.</h3>
            <p>
              A class project, a side project, a thing you made just to see if
              you could.
            </p>
            <button
              className="button button-outline"
              onClick={() => setOpen(true)}
            >
              <Plus size={15} /> Add your first project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SkillsEditor({
  items,
  refresh,
  onDraftChange,
}: {
  items: Skill[];
  refresh: () => void;
  onDraftChange: (draft: Skill[]) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  function updateDraft(nextName = name, nextCategory = category) {
    const draft = items.filter((item) => item.id !== -1);
    if (nextName.trim()) draft.push({ id: -1, name: nextName.trim(), category: nextCategory.trim() || null });
    onDraftChange(draft);
  }
  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Add a skill name first");
      return;
    }
    try {
      await api("/api/skills", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), category: category || null }),
      });
      setName("");
      setError("");
      refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add skill");
    }
  }
  async function remove(id: number) {
    await api(`/api/skills/${id}`, { method: "DELETE" });
    refresh();
  }
  async function edit(skill: Skill) {
    const nextName = window.prompt("Edit skill name", skill.name)?.trim();
    if (!nextName) return;
    try {
      await api(`/api/skills/${skill.id}`, {
        method: "PUT",
        body: JSON.stringify({ name: nextName, category: skill.category }),
      });
      refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not update skill",
      );
    }
  }
  const groups = useMemo(
    () =>
      items.reduce<Record<string, Skill[]>>((all, s) => {
        (all[s.category || "Tools & technologies"] ??= []).push(s);
        return all;
      }, {}),
    [items],
  );
  return (
    <div className="editor-page">
      <div className="editor-heading">
        <div>
          <div className="section-kicker">
            THE THINGS YOU BRING TO THE TABLE
          </div>
          <h1>Your skills</h1>
          <p>Keep it honest and useful. No made-up percentages needed.</p>
        </div>
      </div>
      <form className="panel skill-add" onSubmit={add}>
        <div className="skill-add-icon">
          <Code2 size={19} />
        </div>
        <div className="skill-add-fields">
          <input
            value={name}
            onChange={(e) => { setName(e.target.value); updateDraft(e.target.value, category); }}
            placeholder="Add a skill — React, prototyping, facilitation…"
          />
          <input
            className="category-input"
            value={category}
            onChange={(e) => { setCategory(e.target.value); updateDraft(name, e.target.value); }}
            placeholder="Category (optional)"
          />
        </div>
        <button className="button button-dark">
          <Plus size={15} /> Add skill
        </button>
      </form>
      {error && <div className="form-error">{error}</div>}
      <div className="skill-groups">
        {Object.entries(groups).map(([group, skills]) => (
          <section className="panel skill-group" key={group}>
            <div className="skill-group-head">
              <span className="skill-group-dot" />
              <h3>{group}</h3>
              <small>
                {skills.length} {skills.length === 1 ? "skill" : "skills"}
              </small>
            </div>
            <div className="skill-chips">
              {skills.map((s) => (
                <span className="skill-chip" key={s.id}>
                  {s.name}
                  <button onClick={() => edit(s)} aria-label={`Edit ${s.name}`}>
                    <Settings2 size={13} />
                  </button>
                  <button
                    onClick={() => remove(s.id)}
                    aria-label={`Remove ${s.name}`}
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          </section>
        ))}
        {items.length === 0 && (
          <div className="empty-state">
            <span>
              <Code2 size={23} />
            </span>
            <h3>What do you know your way around?</h3>
            <p>Tools, languages, processes, and soft skills all count.</p>
          </div>
        )}
      </div>
    </div>
  );
}

type ResumeItem = {
  id: number;
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  company?: string;
  position?: string;
  platform?: string;
  url?: string;
  location?: string;
  startDate?: string;
  endDate?: string | null;
  currentlyWorking?: boolean;
  description?: string;
};
function ResumeEditor({
  kind,
  refresh,
  onDraftChange,
}: {
  kind: "education" | "experience" | "social";
  refresh: () => void;
  onDraftChange: (draft: ResumeItem[]) => void;
}) {
  const labels = {
    education: {
      title: "Education",
      kicker: "WHERE YOU LEARNED YOUR CRAFT",
      blurb: "Add the places and ideas that shaped how you think.",
    },
    experience: {
      title: "Experience",
      kicker: "THE WORK BEHIND YOUR WORK",
      blurb: "A few roles, a few lessons, and the things you helped make.",
    },
    social: {
      title: "Social links",
      kicker: "LET PEOPLE FIND YOU",
      blurb: "Add the places where you share, build, or connect.",
    },
  }[kind];
  const path = kind === "social" ? "/api/social-links" : `/api/${kind}`;
  const { data: items = [], isLoading } = useData<ResumeItem[]>(
    `resume-${kind}`,
    path,
  );
  const [editing, setEditing] = useState<ResumeItem | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  function previewDraft(form: HTMLFormElement) {
    const fd = new FormData(form);
    let draft: ResumeItem;
    if (kind === "education") draft = {
      id: editing?.id ?? -1,
      institution: String(fd.get("institution") || ""),
      degree: String(fd.get("degree") || ""),
      fieldOfStudy: String(fd.get("fieldOfStudy") || ""),
      startDate: String(fd.get("startDate") || ""),
      endDate: String(fd.get("endDate") || ""),
      description: String(fd.get("description") || ""),
    };
    else if (kind === "experience") draft = {
      id: editing?.id ?? -1,
      company: String(fd.get("company") || ""),
      position: String(fd.get("position") || ""),
      location: String(fd.get("location") || ""),
      startDate: String(fd.get("startDate") || ""),
      endDate: String(fd.get("endDate") || ""),
      currentlyWorking: fd.get("currentlyWorking") === "on",
      description: String(fd.get("description") || ""),
    };
    else draft = { id: editing?.id ?? -1, platform: String(fd.get("platform") || ""), url: String(fd.get("url") || "") };
    onDraftChange(editing
      ? items.map((item) => item.id === editing.id ? draft : item)
      : [...items.filter((item) => item.id !== -1), draft]);
  }
  function startEdit(item?: ResumeItem) {
    setEditing(item || null);
    setOpen(true);
    setError("");
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    let body: Record<string, unknown>;
    if (kind === "education")
      body = {
        institution: fd.get("institution"),
        degree: fd.get("degree"),
        fieldOfStudy: fd.get("fieldOfStudy") || null,
        startDate: fd.get("startDate") || null,
        endDate: fd.get("endDate") || null,
        description: fd.get("description") || null,
      };
    else if (kind === "experience") {
      const current = fd.get("currentlyWorking") === "on";
      body = {
        company: fd.get("company"),
        position: fd.get("position"),
        location: fd.get("location") || null,
        startDate: fd.get("startDate") || null,
        endDate: current ? null : fd.get("endDate") || null,
        currentlyWorking: current,
        description: fd.get("description") || null,
      };
    } else body = { platform: fd.get("platform"), url: fd.get("url") };
    setBusy(true);
    setError("");
    try {
      await api(`${path}${editing ? `/${editing.id}` : ""}`, {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(body),
      });
      await refresh();
      setOpen(false);
      setEditing(null);
      form.reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }
  async function remove(id: number) {
    if (!confirm("Remove this item?")) return;
    await api(`${path}/${id}`, { method: "DELETE" });
    await refresh();
  }
  async function suggestExperienceDescription(form: HTMLFormElement) {
    const company = form.elements.namedItem("company");
    const role = form.elements.namedItem("position");
    const description = form.elements.namedItem("description");
    if (!(company instanceof HTMLInputElement) || !(role instanceof HTMLInputElement) || !(description instanceof HTMLTextAreaElement)) return;
    setAiBusy(true);
    setError("");
    try {
      const result = await api<{ suggestion: string }>("/api/ai/experience-description", {
        method: "POST",
        body: JSON.stringify({ company: company.value, role: role.value, text: description.value }),
      });
      description.value = result.suggestion;
      description.dispatchEvent(new Event("input", { bubbles: true }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create a suggestion");
    } finally {
      setAiBusy(false);
    }
  }
  const v = (key: keyof ResumeItem) => editing?.[key] || "";
  return (
    <div className="editor-page">
      <div className="editor-heading">
        <div>
          <div className="section-kicker">{labels.kicker}</div>
          <h1>{labels.title}</h1>
          <p>{labels.blurb}</p>
        </div>
        <button className="button button-primary" onClick={() => startEdit()}>
          <Plus size={15} /> Add {kind === "social" ? "a link" : `an entry`}
        </button>
      </div>
      {open && (
        <form className="panel project-form" onSubmit={submit} onInput={(e) => previewDraft(e.currentTarget)}>
          <div className="project-form-head">
            <b>
              {editing ? "Edit" : "Add"} {kind === "social" ? "link" : kind}
            </b>
            <button
              type="button"
              className="icon-button"
              onClick={() => { setOpen(false); onDraftChange(items); }}
            >
              <X size={17} />
            </button>
          </div>
          {kind === "education" ? (
            <>
              <div className="form-two">
                <label>
                  Institution
                  <input
                    name="institution"
                    defaultValue={String(v("institution"))}
                    required
                  />
                </label>
                <label>
                  Degree
                  <input
                    name="degree"
                    defaultValue={String(v("degree"))}
                    required
                  />
                </label>
              </div>
              <div className="form-two">
                <label>
                  Field of study
                  <input
                    name="fieldOfStudy"
                    defaultValue={String(v("fieldOfStudy"))}
                  />
                </label>
                <label>
                  Start date
                  <input
                    type="month"
                    name="startDate"
                    defaultValue={String(v("startDate"))}
                  />
                </label>
              </div>
              <label>
                End date
                <input
                  type="month"
                  name="endDate"
                  defaultValue={String(v("endDate"))}
                />
              </label>
              <label>
                Details
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={String(v("description"))}
                />
              </label>
            </>
          ) : kind === "experience" ? (
            <>
              <div className="form-two">
                <label>
                  Company
                  <input
                    name="company"
                    defaultValue={String(v("company"))}
                    required
                  />
                </label>
                <label>
                  Role
                  <input
                    name="position"
                    defaultValue={String(v("position"))}
                    required
                  />
                </label>
              </div>
              <div className="form-two">
                <label>
                  Location
                  <input name="location" defaultValue={String(v("location"))} />
                </label>
                <label>
                  Start date
                  <input
                    type="month"
                    name="startDate"
                    defaultValue={String(v("startDate"))}
                  />
                </label>
              </div>
              <label>
                End date
                <input
                  type="month"
                  name="endDate"
                  defaultValue={String(v("endDate"))}
                  disabled={!!editing?.currentlyWorking}
                />
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="currentlyWorking"
                  defaultChecked={!!editing?.currentlyWorking}
                />{" "}
                I currently work here
              </label>
              <label>
                What did you work on?
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={String(v("description"))}
                />
              </label>
              <button type="button" className="button button-outline" disabled={aiBusy} onClick={(e) => suggestExperienceDescription(e.currentTarget.form!)}>
                {aiBusy ? <LoaderCircle className="spin" size={15} /> : <WandSparkles size={15} />}
                {aiBusy ? "Thinking…" : "Suggest with AI"}
              </button>
            </>
          ) : (
            <div className="form-two">
              <label>
                Platform
                <input
                  name="platform"
                  defaultValue={String(v("platform"))}
                  placeholder="LinkedIn, GitHub, personal site"
                  required
                />
              </label>
              <label>
                URL
                <input
                  name="url"
                  type="url"
                  defaultValue={String(v("url"))}
                  placeholder="https://"
                  required
                />
              </label>
            </div>
          )}
          {error && <div className="form-error">{error}</div>}
          <button className="button button-primary" disabled={busy}>
            {busy ? "Saving…" : "Save"}
            <Check size={15} />
          </button>
        </form>
      )}
      {isLoading ? (
        <div className="empty-state">
          <LoaderCircle className="spin" size={19} />
        </div>
      ) : (
        <div className="resume-list">
          {items.map((item) => (
            <article className="resume-row" key={item.id}>
              <div className="resume-icon">
                {kind === "education" ? (
                  <GraduationCap size={17} />
                ) : kind === "experience" ? (
                  <BriefcaseBusiness size={17} />
                ) : (
                  <Link2 size={17} />
                )}
              </div>
              <div className="resume-copy">
                <b>
                  {kind === "education"
                    ? item.institution
                    : kind === "experience"
                      ? item.position
                      : item.platform}
                </b>
                <span>
                  {kind === "education"
                    ? `${item.degree}${item.fieldOfStudy ? ` · ${item.fieldOfStudy}` : ""}`
                    : kind === "experience"
                      ? `${item.company}${item.location ? ` · ${item.location}` : ""}`
                      : item.url}
                </span>
                <small>
                  {kind === "experience" && item.currentlyWorking
                    ? "Present"
                    : `${item.startDate || ""}${item.endDate ? ` — ${item.endDate}` : ""}`}
                </small>
                {item.description && <p>{item.description}</p>}
              </div>
              <div className="resume-actions">
                <button onClick={() => startEdit(item)} aria-label="Edit">
                  <Settings2 size={15} />
                </button>
                <button onClick={() => remove(item.id)} aria-label="Remove">
                  <X size={15} />
                </button>
              </div>
            </article>
          ))}
          {items.length === 0 && !open && (
            <div className="empty-state">
              <span>
                {kind === "education" ? (
                  <GraduationCap />
                ) : kind === "experience" ? (
                  <BriefcaseBusiness />
                ) : (
                  <Link2 />
                )}
              </span>
              <h3>
                {kind === "social"
                  ? "Add the links you want to share."
                  : `Your ${kind} story starts here.`}
              </h3>
              <p>
                You can add, edit, and rearrange these details as your story
                grows.
              </p>
              <button
                className="button button-outline"
                onClick={() => startEdit()}
              >
                <Plus size={15} /> Add {kind === "social" ? "a link" : kind}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type GithubRepo = {
  name: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
};
function GithubEditor({ refresh }: { refresh: () => void }) {
  const { data: projects = [] } = useData<Project[]>("projects", "/api/projects");
  const importedUrls = new Set(projects.map((project) => project.githubUrl?.replace(/\/$/, "").toLowerCase()).filter(Boolean));
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const normalizedUsername = username.trim();
      const list = await api<GithubRepo[]>(
        `/api/github/repos/${encodeURIComponent(normalizedUsername)}`,
      );
      setRepos(list);
      setSelected([]);
      if (!list.length) setMessage("No public repositories found.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not reach GitHub");
    } finally {
      setBusy(false);
    }
  }
  async function importSelected() {
    setBusy(true);
    setMessage("");
    let count = 0;
    const failures: string[] = [];
    try {
      for (const repository of selected) {
        try {
          await api("/api/github/import", {
            method: "POST",
            body: JSON.stringify({ username: username.trim(), repository }),
          });
          count++;
        } catch {
          failures.push(repository);
        }
      }
      if (count) await refresh();
      setSelected([]);
      setMessage([count ? `${count} ${count === 1 ? "project" : "projects"} added to your portfolio.` : "No repositories were imported.", failures.length ? `Could not import: ${failures.join(", ")}.` : ""].filter(Boolean).join(" "));
    } catch (e) {
      setMessage(
        e instanceof Error ? e.message : "Could not import repository",
      );
    } finally {
      setBusy(false);
    }
  }
  function toggle(name: string) {
    setSelected((s) =>
      s.includes(name) ? s.filter((v) => v !== name) : [...s, name],
    );
  }
  return (
    <div className="editor-page">
      <div className="editor-heading">
        <div>
          <div className="section-kicker">BRING YOUR WORK OVER</div>
          <h1>Connect GitHub</h1>
          <p>
            Find a few public repositories worth featuring. You choose what
            comes in.
          </p>
        </div>
        <span className="editor-badge">
          <Code2 size={15} /> PUBLIC REPOSITORIES
        </span>
      </div>
      <form className="panel github-search" onSubmit={lookup}>
        <span className="github-mark">
          <Code2 size={21} />
        </span>
        <div>
          <b>Look up a username</b>
          <small>
            Only public repositories are searched. No GitHub sign-in required.
          </small>
        </div>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="GitHub username"
          required
        />
        <button className="button button-dark" disabled={busy}>
          {busy ? "Searching…" : "Find repositories"}
          <ArrowRight size={15} />
        </button>
      </form>
      {message && <div className="github-message">{message}</div>}
      {repos.length > 0 && (
        <>
          <div className="github-list-head">
            <span>{repos.length} PUBLIC REPOSITORIES</span>
            <button
              className="button button-primary"
              disabled={!selected.length || busy}
              onClick={importSelected}
            >
              <Plus size={15} /> Import selected ({selected.length})
            </button>
          </div>
          <div className="github-repo-list">
            {repos.map((repo) => {
              const alreadyImported = importedUrls.has(repo.htmlUrl.replace(/\/$/, "").toLowerCase());
              return (
              <label
                className={`github-repo ${selected.includes(repo.name) ? "chosen" : ""} ${alreadyImported ? "imported" : ""}`}
                key={repo.name}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(repo.name)}
                  onChange={() => toggle(repo.name)}
                  disabled={alreadyImported || busy}
                />
                <div className="repo-main">
                  <b>{repo.name} {alreadyImported && <span className="repo-imported-label">Already in portfolio</span>}</b>
                  <p>
                    {repo.description || "No repository description provided."}
                  </p>
                  <div>
                    {repo.language && <span>{repo.language}</span>}
                    {repo.topics?.slice(0, 4).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <small>★ {repo.stars}</small>
                <a
                  href={repo.htmlUrl}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={14} />
                </a>
              </label>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
function AiEditor({
  profile,
  refresh,
  notify,
}: {
  profile?: Profile;
  refresh: () => void;
  notify: (s: string) => void;
}) {
  const { data: skills = [] } = useData<Skill[]>("skills", "/api/skills");
  const { data: experience = [] } = useData<ResumeItem[]>("resume-experience", "/api/experience");
  const { data: education = [] } = useData<ResumeItem[]>("resume-education", "/api/education");
  const { data: projects = [] } = useData<Project[]>("projects", "/api/projects");
  const [mode, setMode] = useState<"about" | "improve">("about");
  const [text, setText] = useState(profile?.bio || "");
  const [suggestion, setSuggestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (profile?.bio && !text) setText(profile.bio);
  }, [profile?.bio]);
  async function generate() {
    setBusy(true);
    setMessage("");
    setSuggestion("");
    try {
      const result = await api<{ suggestion: string }>(
        `/api/ai/${mode === "about" ? "generate-about" : "improve-text"}`,
        {
          method: "POST",
          body: JSON.stringify({
            name: profile?.fullName,
            headline: profile?.headline,
            bio: profile?.bio,
            skills: skills.map((skill) => skill.name),
            experience: experience.map((item) => [item.position, item.company, item.description].filter(Boolean).join(" at ").slice(0, 100)),
            education: education.map((item) => [item.degree, item.fieldOfStudy, item.institution].filter(Boolean).join(" — ").slice(0, 100)),
            projects: projects.map((item) => [item.name, item.shortDescription, item.technologies?.join(", ")].filter(Boolean).join(": ").slice(0, 200)),
            text,
            tone: "warm and professional",
            length: "short",
          }),
        },
      );
      setSuggestion(result.suggestion);
    } catch (e) {
      setMessage(
        e instanceof Error ? e.message : "Could not create a suggestion",
      );
    } finally {
      setBusy(false);
    }
  }
  async function accept() {
    if (mode === "about") {
      setText(suggestion);
      setSuggestion("");
      setMessage("Suggestion added to the editor. Save it when you’re ready.");
      return;
    }
    setText(suggestion);
    setSuggestion("");
    setMessage("Suggestion added to the editor. Save it when you’re ready.");
  }
  async function save() {
    try {
      await api("/api/profile", {
        method: "PUT",
        body: JSON.stringify({
          fullName: profile?.fullName,
          headline: profile?.headline,
          bio: text,
          profileImageUrl: profile?.profileImageUrl,
          location: profile?.location,
          phone: profile?.phone,
        }),
      });
      refresh();
      notify("Your profile was updated");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not save");
    }
  }
  return (
    <div className="editor-page">
      <div className="editor-heading">
        <div>
          <div className="section-kicker">A THOUGHTFUL FIRST DRAFT</div>
          <h1>AI writing studio</h1>
          <p>
            Get a suggestion, shape it into your voice, and choose what to keep.
          </p>
        </div>
        <span className="editor-badge">
          <Sparkles size={15} /> YOUR CALL, ALWAYS
        </span>
      </div>
      <div className="ai-layout">
        <section className="panel ai-input-panel">
          <div className="ai-mode-tabs">
            <button
              className={mode === "about" ? "selected" : ""}
              onClick={() => setMode("about")}
            >
              Write an about section
            </button>
            <button
              className={mode === "improve" ? "selected" : ""}
              onClick={() => setMode("improve")}
            >
              Improve my draft
            </button>
          </div>
          <div className="ai-context">
            <span className="ai-spark">
              <WandSparkles size={18} />
            </span>
            <div>
              <b>
                {mode === "about"
                  ? "A little about you"
                  : "Start with what you have"}
              </b>
              <small>
                {mode === "about"
                  ? "We’ll use the details from your profile."
                  : "Keep the meaning and facts; polish the wording."}
              </small>
            </div>
          </div>
          <label className="ai-text-label">
            {mode === "about"
              ? "Your current introduction (optional)"
              : "Your draft"}
            <textarea
              rows={9}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                mode === "about"
                  ? "You can add a few rough notes, or leave this blank and start fresh."
                  : "Paste the text you would like help with."
              }
            />
          </label>
          {message && <p className="ai-message">{message}</p>}
          <div className="ai-bottom">
            <span>
              <Sparkles size={13} /> AI suggestions can be imperfect. Review
              every detail.
            </span>
            <button
              className="button button-primary"
              onClick={generate}
              disabled={busy}
            >
              {busy ? (
                <LoaderCircle className="spin" size={15} />
              ) : (
                <WandSparkles size={15} />
              )}{" "}
              {busy ? "Thinking…" : "Get a suggestion"}
            </button>
          </div>
        </section>
        <aside className="panel ai-preview-panel">
          <div className="section-kicker">YOUR WORDS, YOUR DECISION</div>
          <h3>
            {suggestion ? "A fresh suggestion" : "A good draft starts here."}
          </h3>
          {suggestion ? (
            <>
              <div className="suggestion-box">{suggestion}</div>
              <div className="suggestion-actions">
                <button className="button button-primary" onClick={accept}>
                  Use this draft <ArrowRight size={14} />
                </button>
                <button
                  className="text-button"
                  onClick={() => setSuggestion("")}
                >
                  Discard <X size={14} />
                </button>
              </div>
            </>
          ) : (
            <div className="suggestion-empty">
              <span>
                <Sparkles size={21} />
              </span>
              <p>
                Your suggestion will show up here. Nothing changes until you
                decide it should.
              </p>
            </div>
          )}
          {text !== (profile?.bio || "") && (
            <button className="button button-dark save-draft" onClick={save}>
              Save to my profile <Check size={14} />
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}

function AppearanceEditor({
  portfolio,
  refresh,
  notify,
  onDraftChange,
}: {
  portfolio?: Portfolio;
  refresh: () => void;
  notify: (s: string) => void;
  onDraftChange: (draft: Partial<Portfolio>) => void;
}) {
  const [slug, setSlug] = useState(portfolio?.slug || "");
  const [title, setTitle] = useState(portfolio?.title || "");
  const [template, setTemplate] = useState(portfolio?.template || "minimal");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (portfolio) {
      setSlug(portfolio.slug);
      setTitle(portfolio.title);
      setTemplate(portfolio.template);
    }
  }, [portfolio]);
  async function save() {
    setSaving(true);
    try {
      await api("/api/portfolio", {
        method: "PUT",
        body: JSON.stringify({ title, slug, template }),
      });
      refresh();
      notify("Portfolio settings saved");
    } catch (e) {
      notify(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }
  const choices = [
    {
      id: "minimal",
      label: "The quiet one",
      desc: "Clean typography and room to breathe.",
      className: "template-minimal",
    },
    {
      id: "modern",
      label: "The editorial one",
      desc: "A bold introduction and expressive details.",
      className: "template-modern",
    },
    {
      id: "developer",
      label: "The builder one",
      desc: "A dark canvas for technical work.",
      className: "template-developer",
    },
  ];
  return (
    <div className="editor-page">
      <div className="editor-heading">
        <div>
          <div className="section-kicker">MAKE IT FEEL LIKE YOU</div>
          <h1>Appearance</h1>
          <p>
            Choose a starting point. Your story stays yours across every style.
          </p>
        </div>
      </div>
      <div className="template-grid">
        {choices.map((t) => (
          <button
            key={t.id}
            className={`template-card ${template === t.id ? "selected" : ""}`}
            onClick={() => { setTemplate(t.id); onDraftChange({ template: t.id }); }}
          >
            <div className={`template-thumb ${t.className}`}>
              <div className="thumb-bar">
                <span />
                <span />
                <span />
              </div>
              <div className="thumb-body">
                <div className="thumb-avatar" />
                <div className="thumb-lines">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="thumb-cards">
                  <i />
                  <i />
                </div>
              </div>
              {template === t.id && (
                <span className="template-selected">
                  <Check size={14} />
                </span>
              )}
            </div>
            <div className="template-info">
              <span>
                <b>{t.label}</b>
                <small>{t.desc}</small>
              </span>
              {template === t.id && <Check size={16} />}
            </div>
          </button>
        ))}
      </div>
      <section className="panel settings-card">
        <div className="section-kicker">YOUR SHAREABLE ADDRESS</div>
        <h2>Put your name on it.</h2>
        <p>Keep it short, easy to spell, and easy to remember.</p>
        <label>
          Portfolio title
          <input
            value={title}
            onChange={(e) => { setTitle(e.target.value); onDraftChange({ title: e.target.value }); }}
            placeholder="Alex Morgan — Portfolio"
          />
        </label>
        <label>
          Public URL
          <div className="slug-input">
            <span>{window.location.host}/portfolio/</span>
            <input
              value={slug}
            onChange={(e) => { const value = e.target.value.toLowerCase(); setSlug(value); onDraftChange({ slug: value }); }}
            />
          </div>
        </label>
        <button
          className="button button-primary"
          disabled={saving}
          onClick={save}
        >
          {saving ? "Saving…" : "Save appearance"}
          <Check size={15} />
        </button>
      </section>
    </div>
  );
}

function PublicPortfolio() {
  const { slug = "" } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["public", slug],
    queryFn: () => api<PublicData>(`/api/public/portfolio/${slug}`),
    retry: false,
  });
  if (isLoading)
    return (
      <div className="public-loading">
        <LoaderCircle className="spin" size={24} /> Opening portfolio…
      </div>
    );
  if (error || !data)
    return (
      <div className="public-missing">
        <span className="brand-mark">
          <Code2 size={19} />
        </span>
        <h1>This page isn't here (yet).</h1>
        <p>The portfolio may be private or the link may have changed.</p>
        <Link to="/" className="button button-dark">
          Back to foliocraft <ArrowRight size={15} />
        </Link>
      </div>
    );
  return <PortfolioView data={data} />;
}
function PortfolioView({ data, preview = false }: { data: PublicData; preview?: boolean }) {
  const p = data.profile;
  return (
    <main className={`public-page public-${data.portfolio.template}`}>
      <header className="public-nav">
        <Link className="public-wordmark" to="/">
          folio<span>craft</span>
        </Link>
        <div>
          {p.location && <span>{p.location}</span>}
          <a href="#projects">
            Selected work <ArrowDownRight size={14} />
          </a>
        </div>
      </header>
      <section className="public-hero">
        {p.profileImageUrl && <img className="public-profile-image" src={p.profileImageUrl} alt={p.fullName ? `${p.fullName} profile` : "Profile"} />}
        <span className="public-kicker">
          INDEPENDENTLY MADE ·{" "}
          {p.location?.toUpperCase() || "OPEN TO WHAT’S NEXT"}
        </span>
        <h1>
          {p.fullName || data.portfolio.title}
          <span>.</span>
        </h1>
        <h2>{p.headline || "Building thoughtful things for the web."}</h2>
        <p>
          {p.bio ||
            "A collection of work, curiosity, and things learned along the way."}
        </p>
        <div className="public-hero-links">
          <a href="#projects">
            See selected work <ArrowDownRight size={15} />
          </a>
          <button
            onClick={() => navigator.clipboard.writeText(preview ? `${window.location.origin}/portfolio/${data.portfolio.slug}` : window.location.href)}
          >
            Copy this link <Link2 size={14} />
          </button>
        </div>
      </section>
      <section id="projects" className="public-projects">
        <div className="public-section-head">
          <div>
            <span className="public-kicker">A FEW THINGS I’VE MADE</span>
            <h2>Selected work</h2>
          </div>
          <span>{String(data.projects.length).padStart(2, "0")} PROJECTS</span>
        </div>
        <div className="public-project-grid">
          {data.projects.map((project, i) => (
            <article className="public-project-card" key={project.id}>
              <div className={`public-project-art art-${i % 3}`}>
                {project.imageUrl ? <img src={project.imageUrl} alt={`${project.name} preview`} /> : <><span>{String(i + 1).padStart(2, "0")}</span><Code2 size={25} /></>}
              </div>
              <div className="public-project-meta">
                <h3>{project.name}</h3>
                <p>{project.shortDescription || project.description}</p>
                <div>
                  {project.technologies?.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <aside>
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank">
                      <Code2 size={15} /> Source
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank">
                      <ExternalLink size={14} /> Visit
                    </a>
                  )}
                </aside>
              </div>
            </article>
          ))}
        </div>
        {data.projects.length === 0 && (
          <div className="public-empty">The next project is taking shape.</div>
        )}
      </section>
      <PublicExtras data={data} />
      <section className="public-skills">
        <span className="public-kicker">TOOLS OF THE TRADE</span>
        <h2>Things I work with.</h2>
        <div>
          {data.skills.map((s) => (
            <span key={s.id}>{s.name}</span>
          ))}
        </div>
      </section>
      <footer className="public-footer">
        <span>Made with care by {p.fullName || data.portfolio.title}</span>
        <Link to="/">
          Made with foliocraft <ArrowUpRight size={14} />
        </Link>
      </footer>
    </main>
  );
}

function PublicExtras({ data }: { data: PublicData }) {
  return (
    <>
      {data.experience.length > 0 && (
        <section className="public-resume">
          <span className="public-kicker">A LITTLE OF WHAT I’VE DONE</span>
          <h2>Experience</h2>
          {data.experience.map((item) => (
            <article key={item.id}>
              <div>
                <b>{item.position}</b>
                <span>
                  {item.company}
                  {item.location ? ` · ${item.location}` : ""}
                </span>
              </div>
              <small>
                {item.startDate || ""} —{" "}
                {item.currentlyWorking ? "Present" : item.endDate || ""}
              </small>
              {item.description && <p>{item.description}</p>}
            </article>
          ))}
        </section>
      )}
      {data.education.length > 0 && (
        <section className="public-resume">
          <span className="public-kicker">ALWAYS LEARNING</span>
          <h2>Education</h2>
          {data.education.map((item) => (
            <article key={item.id}>
              <div>
                <b>{item.institution}</b>
                <span>
                  {item.degree}
                  {item.fieldOfStudy ? ` · ${item.fieldOfStudy}` : ""}
                </span>
              </div>
              <small>
                {item.startDate || ""} — {item.endDate || ""}
              </small>
              {item.description && <p>{item.description}</p>}
            </article>
          ))}
        </section>
      )}
      {data.socialLinks.length > 0 && (
        <section className="public-social">
          <span className="public-kicker">FIND ME AROUND THE WEB</span>
          <div>
            {data.socialLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noreferrer">
                {link.platform}
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default App;
