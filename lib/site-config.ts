import type { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  name: "Nyoman Astika",
  title: "Nyoman Astika — Developer & Designer",
  description:
    "I build thoughtful digital products with clean code and great UX.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "",
  author: {
    name: "Nyoman Astika",
    email: "nyomana369@gmail.com",
    github: "https://github.com/oren0115",
    linkedin: "https://linkedin.com/in/nyoman-astika",
  },
};
