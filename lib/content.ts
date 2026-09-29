/**
 * KalamSpark: editable site content.
 *
 * PRICING NOTE
 * Official package names and prices have not been published yet.
 * Everything inside `packages` is a placeholder. Edit names, prices,
 * features and links here and the Plans section updates automatically.
 */

export const brand = {
  company: "Acubotz",
  tagline: "Igniting Curiosity, Inspiring Innovation",
  product: "KalamSpark",
  positioning: "World's first smallest animatronic study companion",
  site: "https://acubotz.com",
  siteLabel: "acubotz.com",
};

export const navLinks = [
  { label: "KalamSpark", href: "#kalamspark" },
  { label: "Experience", href: "#experience" },
  { label: "Features", href: "#features" },
  { label: "Learning", href: "#learning" },
  { label: "Plans", href: "#plans" },
];

export type Package = {
  id: string;
  number: string;
  name: string;
  price: string;
  priceNote: string;
  summary: string;
  features: string[];
  highlight?: boolean;
  highlightLabel?: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

export const packages: Package[] = [
  {
    id: "app",
    number: "01",
    name: "KalamSpark App",
    price: "Coming soon",
    priceNote: "Pricing will be announced soon",
    summary: "Kalam in your pocket. The complete study companion experience on Android.",
    features: [
      "Kalam voice assistant",
      "Study assistance",
      "Homework support",
      "Planner",
      "Reminders",
      "Night study",
    ],
    primaryCta: { label: "Get KalamSpark", href: "#" },
    secondaryCta: { label: "Explore Package", href: "#" },
  },
  {
    id: "companion",
    number: "02",
    name: "KalamSpark Companion",
    price: "Coming soon",
    priceNote: "Pricing will be announced soon",
    summary: "The app and the humanoid robot, working as one companion.",
    features: [
      "KalamSpark app",
      "Robot connectivity",
      "Voice interaction",
      "Gesture integration",
      "Learning tools",
      "Homework assistant",
      "Study planner",
    ],
    highlight: true,
    highlightLabel: "The full companion",
    primaryCta: { label: "Get KalamSpark", href: "#" },
    secondaryCta: { label: "Explore Package", href: "#" },
  },
  {
    id: "complete",
    number: "03",
    name: "KalamSpark Complete",
    price: "Coming soon",
    priceNote: "Pricing will be announced soon",
    summary: "Everything in Companion, plus the complete KalamSpark product experience.",
    features: [
      "Everything in Companion",
      "[Premium feature to be added]",
      "[Premium feature to be added]",
      "[Premium feature to be added]",
    ],
    primaryCta: { label: "Get KalamSpark", href: "#" },
    secondaryCta: { label: "Explore Package", href: "#" },
  },
];

export type SubjectKey =
  | "science"
  | "maths"
  | "english"
  | "social"
  | "gk"
  | "coding"
  | "ai";

export const subjects: {
  key: SubjectKey;
  name: string;
  progress: string;
  ratio: number;
  blurb: string;
  isNew?: boolean;
}[] = [
  { key: "science", name: "Science", progress: "8 of 14 chapters", ratio: 8 / 14, blurb: "Why the sky is blue, how leaves make food." },
  { key: "maths", name: "Mathematics", progress: "6 of 15 chapters", ratio: 6 / 15, blurb: "Fractions to equations, one step at a time." },
  { key: "english", name: "English", progress: "9 of 12 chapters", ratio: 9 / 12, blurb: "Reading, grammar and your next essay draft." },
  { key: "social", name: "Social Science", progress: "4 of 13 chapters", ratio: 4 / 13, blurb: "Maps, history and how societies work." },
  { key: "gk", name: "General Knowledge", progress: "5 of 10 topics", ratio: 5 / 10, blurb: "Curious facts about the world around you." },
  { key: "coding", name: "Coding", progress: "3 of 8 projects", ratio: 3 / 8, blurb: "Build small projects and learn by making." },
  { key: "ai", name: "Artificial Intelligence", progress: "Start with “What is AI?”", ratio: 0, blurb: "Understand the ideas behind Kalam himself.", isNew: true },
];

export const experienceStages = [
  { key: "ask", word: "Ask", line: "Talk naturally.", detail: "Say “Hey Kalam” and ask anything, out loud." },
  { key: "understand", word: "Understand", line: "Complex ideas, explained simply.", detail: "Rayleigh scattering, in words that make sense." },
  { key: "practice", word: "Practice", line: "Step-by-step learning.", detail: "Scan a problem. Follow every step to the answer." },
  { key: "plan", word: "Plan", line: "Know what comes next.", detail: "Today's schedule, reminders and the week ahead." },
  { key: "focus", word: "Focus", line: "Stay on track after dark.", detail: "Soft voice, low light and a timer after 9 PM." },
] as const;

export const footerLinks = [
  { label: "KalamSpark", href: "#kalamspark" },
  { label: "Product", href: "#features" },
  { label: "Features", href: "#voice" },
  { label: "Plans", href: "#plans" },
  { label: "Contact", href: "https://acubotz.com" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

/**
 * The minds behind Kalam.
 * To add a photo: put the image in /public/team/ and set `photo`,
 * e.g. photo: "/team/code-wizard.jpg". Leave it null to show the placeholder.
 */
export type TeamMember = { id: string; name: string; title: string; role: string; photo: string | null };

export const teamLead: TeamMember = { id: "mission-head", name: "Krishnanunni J S", title: "The Mission Head", role: "Team Lead & Project Head", photo: "/team/mission-head.webp" };

export const team: TeamMember[] = [
  { id: "brain-maker", name: "Abhinand Anilkumar", title: "The Brain & Learning Maker", role: "AI Engineer & Content Head", photo: "/team/brain-maker.webp" },
  { id: "code-wizard", name: "Akhilraj U R", title: "The Code Wizard", role: "Lead Programmer", photo: "/team/code-wizard.png" },
  { id: "dream-designer", name: "Mohammed Habeeb Hassan", title: "The Dream Designer", role: "Designer", photo: "/team/dream-designer.webp" },
  { id: "art-magician", name: "Baisil S V", title: "The Art Magician", role: "Artist", photo: "/team/art-magician.webp" },
];
