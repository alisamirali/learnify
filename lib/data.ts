type Feature = {
  title: string;
  description: string;
  icon: string;
};

type NavigationLink = {
  name: string;
  href: string;
};

export const features: Feature[] = [
  {
    title: "Comprehensive Courses",
    description:
      "Explore a wide range of subjects with in-depth courses designed by industry experts.",
    icon: "📚",
  },
  {
    title: "Interactive Learning",
    description:
      "Engage with interactive content, quizzes, and hands-on projects to reinforce your understanding.",
    icon: "🖥️",
  },
  {
    title: "Expert Instructors",
    description:
      "Learn from experienced professionals who bring real-world insights and practical knowledge to the classroom.",
    icon: "👨‍🏫",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your learning journey with personalized dashboards and progress reports to stay motivated.",
    icon: "📈",
  },
  {
    title: "Flexible Learning",
    description:
      "Access courses anytime, anywhere, and learn at your own pace with our mobile-friendly platform.",
    icon: "📱",
  },
  {
    title: "Community Support",
    description:
      "Join a vibrant community of learners and educators to share knowledge, ask questions, and collaborate on projects.",
    icon: "🤝",
  },
];

export const navigationLinks: NavigationLink[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Courses",
    href: "/courses",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
  },
];

export const courseCategories = [
  "Business & Management",
  "Technology & IT",
  "Personal Development",
  "Health & Wellness",
  "Language Learning",
  "Arts & Creativity",
  "Finance & Accounting",
  "Education & Teaching",
  "Science & Mathematics",
  "Career Development",
] as const;

export const courseLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export const courseStatus = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
