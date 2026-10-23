const navLinks = [
  {
    id: "projects",
    title: "Projects",
  },
  {
    id: "about",
    title: "About Me",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const projectLists = [
  {
    name: "Pool PM",
    summary:
      "Offline-first project management for pool builders, from lead to warranty. Expo / React Native app with a Fastify, PostgreSQL and Redis API.",
    url: "https://github.com/hgkf7y4kn6-droid/Pool-Project-Workflow",
  },
  {
    name: "Healthcare Agent",
    summary:
      "Multi-agent healthcare assistant that handles prescription refills, EHR lookups, scheduling and support tickets. Python, CrewAI and a webhook API.",
    url: "https://github.com/hgkf7y4kn6-droid/Capstone-Healthcare-Agent",
  },
  {
    name: "News Agent",
    summary:
      "Personal news reader across 62 sources with an AI chat assistant that answers with citations. Cloudflare Workers, Vectorize and Gemini.",
    url: "https://github.com/hgkf7y4kn6-droid/news-agent",
  },
];

const lovedProjects = [
  {
    name: "DFS Riches",
    summary:
      "DraftKings NFL explorer that merges real salaries with Sleeper projections and builds Showdown and Classic slates. Python and FastAPI, with a mobile app.",
    url: "https://github.com/hgkf7y4kn6-droid/DFS-Riches",
  },
  {
    name: "Cost Comparison Tool",
    summary:
      "Good / better / best product matching that compares options on cost per use. FastAPI with CLIP, FAISS and OCR, deployed on Render and Cloudflare.",
    url: "https://github.com/hgkf7y4kn6-droid/Cost-Comparison-Tool",
  },
  {
    name: "Mindful Money Management",
    summary:
      "Personal finance app for tracking subscriptions and spending insights. Expo / React Native with a FastAPI backend that connects bank accounts through Plaid.",
    url: "https://github.com/hgkf7y4kn6-droid/MMM",
  },
];

const contactLinks = [
  {
    label: "Connect on LinkedIn",
    url: "https://www.linkedin.com/in/leonard-riches-529a79b4",
  },
  {
    label: "Book a call",
    url: "https://calendar.app.google/sqYnXARceSy6WBHo6",
  },
];

const aboutParagraphs = [
  "I didn't come to AI by way of a computer science degree. I got here by spending the better part of a decade across the table from the people who run businesses, listening to them describe what wasn't working.",
  "I arrived at Penn State not knowing what I wanted to study. An advisor pointed me toward biochemistry and molecular biology, and by the middle of junior year I'd realized only parts of it clicked for me. Rather than add time and debt to switch, I finished the degree and decided to figure out the rest in the working world.",
  "That led to Enterprise Rent-A-Car as a management trainee, then more than four years at UniFirst, where I served as a team lead and earned President's Club twice. At City Wide Facility Solutions I built a territory from scratch and ranked #1 among Edgehill sales executives in FY25. Today I'm a Solutions Executive at Office Basics.",
  "The best part of all of it was never the close. It was discovery: a plant manager, an office administrator or an operations lead walking me through the workarounds their teams live with every day. I've seen those same hurdles in manufacturing, logistics, healthcare and service businesses.",
  "More recently, I've been learning to build the fixes myself. After completing the Microsoft Applied Generative AI Specialization, I've built AI applications in Python, React and TypeScript. The most polished is Riches Analytics, a live sports analytics site that runs Monte Carlo simulations on NFL and college football games. Mindful Money Management, still in progress, is a personal finance app with AI-generated insights. I also built a multi-agent healthcare assistant for my capstone, and I'm developing a cost-comparison tool and Pool PM, a project management app for pool builders.",
  "That's the combination I bring: enough time in the business to ask the right questions, and the skills to build the tool that answers them. I want to help teams clear the friction that slows them down, so they can move faster and grow without adding headaches.",
  "Outside of work, I'm a husband and a dad to two young boys. I've been a Denver Broncos fan for as long as I can remember, with the Eagles a very close second. And I'm still in Happy Valley on fall Saturdays, a habit that started in Nittanyville.",
];

const aboutClosing =
  "If you're wrestling with a process that should be easier, I'd enjoy hearing about it.";

const aboutHighlights = [
  { value: "2×", label: "President's Club, UniFirst" },
  { value: "#1", label: "Edgehill sales executive, FY25" },
  { value: "Microsoft", label: "Applied Generative AI Specialization" },
  { value: "Penn State", label: "Biochemistry & Molecular Biology" },
];

export {
  navLinks,
  projectLists,
  lovedProjects,
  contactLinks,
  aboutParagraphs,
  aboutClosing,
  aboutHighlights,
};
