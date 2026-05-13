import { ThemeToggle } from "@/components/public/ThemeToggle";

interface AdminHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminHeader({ title, description, actions }: AdminHeaderProps) {
  return (
    <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-border bg-background px-6 py-4">
      <div>
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <ThemeToggle />
      </div>
    </div>
  );
}
