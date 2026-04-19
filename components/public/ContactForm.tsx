"use client";

import { useState } from "react";
import { PaperPlaneTilt, CheckCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function update(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Something went wrong"); return; }
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-none border border-border py-16 text-center">
        <CheckCircle className="size-10 text-primary" weight="duotone" />
        <div>
          <p className="text-sm font-semibold">Message sent!</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Thanks for reaching out. I&apos;ll get back to you soon.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setSuccess(false)}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-none border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={form.name}
            onChange={update("name")}
            placeholder="Your name"
            required
            disabled={loading}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder="you@example.com"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subject" className="text-xs">
          Subject
        </Label>
        <Input
          id="subject"
          value={form.subject}
          onChange={update("subject")}
          placeholder="What's this about?"
          disabled={loading}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-xs">
          Message <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          value={form.message}
          onChange={update("message")}
          placeholder="Tell me what's on your mind…"
          rows={6}
          required
          disabled={loading}
        />
        <p className="text-right text-xs text-muted-foreground">
          {form.message.length}/2000
        </p>
      </div>

      <Button type="submit" size="sm" disabled={loading} className="w-full sm:w-auto">
        {loading ? (
          "Sending…"
        ) : (
          <>
            Send message <PaperPlaneTilt />
          </>
        )}
      </Button>
    </form>
  );
}
