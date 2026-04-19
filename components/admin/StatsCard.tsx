import type { Icon } from "@phosphor-icons/react/dist/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: Icon;
}

export function StatsCard({ title, value, description, icon: Icon }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <div className="flex h-7 w-7 items-center justify-center rounded-none border border-border bg-muted">
          <Icon className="size-3.5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-xl font-semibold tabular-nums text-foreground">{value}</p>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
