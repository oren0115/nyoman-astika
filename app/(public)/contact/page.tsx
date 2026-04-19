import type { Metadata } from "next";
import { GithubLogo, LinkedinLogo, TwitterLogo, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { Separator } from "@/components/ui/separator";
import { ContactForm } from "@/components/public/ContactForm";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch — I'd love to hear from you.",
};

const socialLinks = [
  {
    icon: EnvelopeSimple,
    label: "Email",
    value: siteConfig.author.email,
    href: `mailto:${siteConfig.author.email}`,
  },
  {
    icon: GithubLogo,
    label: "GitHub",
    value: siteConfig.author.github?.replace("https://github.com/", "@"),
    href: siteConfig.author.github,
  },
  {
    icon: LinkedinLogo,
    label: "LinkedIn",
    value: siteConfig.author.linkedin?.replace("https://linkedin.com/in/", "in/"),
    href: siteConfig.author.linkedin,
  },
  {
    icon: TwitterLogo,
    label: "Twitter",
    value: siteConfig.author.twitter?.replace("https://twitter.com/", "@"),
    href: siteConfig.author.twitter,
  },
].filter((l) => l.href);

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-10">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">Contact</h1>
        <p className="text-sm text-muted-foreground">
          Have a project in mind, a question, or just want to say hi? I&apos;m all ears.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        {/* Contact Form */}
        <ContactForm />

        {/* Sidebar info */}
        <div className="space-y-8">
          <div>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Get in touch
            </h2>
            <div className="space-y-3">
              {socialLinks.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href?.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-none border border-border bg-muted">
                    <Icon className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-xs font-medium text-foreground">{value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Response time
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              I typically respond within <span className="text-foreground font-medium">1–2 business days</span>.
              For urgent inquiries, feel free to reach out directly via email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
