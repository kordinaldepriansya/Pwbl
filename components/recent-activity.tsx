import { Card, CardContent } from "@/components/ui/card";

export function RecentActivity({
  items,
}: {
  items: { title: string; description: string; time: string }[];
}) {
  if (items.length === 0) {
    return (
      <Card className="rounded-xl border-dashed">
        <CardContent className="py-10 text-center">
          <p className="text-sm font-medium">Belum ada aktivitas</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Aktivitas transaksi akan muncul di sini.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((it, idx) => (
        <div
          key={idx}
          className="flex items-start justify-between gap-4 rounded-xl border bg-background p-4 shadow-sm"
        >
          <div>
            <p className="text-sm font-medium">{it.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{it.description}</p>
          </div>
          <p className="text-xs text-muted-foreground">{it.time}</p>
        </div>
      ))}
    </div>
  );
}
