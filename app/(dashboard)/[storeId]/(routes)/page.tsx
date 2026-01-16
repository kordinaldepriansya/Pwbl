import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, DollarSign, CreditCard, Package } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { RevenueChart } from "@/components/revenue-chart";
import { RecentActivity } from "@/components/recent-activity";

function StatCard({
  title,
  value,
  icon: Icon,
  hint,
}: {
  title: string;
  value: string;
  icon: any;
  hint?: string;
}) {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

const DashboardPage = () => {
  const revenueData = [
    { name: "Sen", total: 0 },
    { name: "Sel", total: 0 },
    { name: "Rab", total: 0 },
    { name: "Kam", total: 0 },
    { name: "Jum", total: 0 },
    { name: "Sab", total: 0 },
    { name: "Min", total: 0 },
  ];

  const activities: { title: string; description: string; time: string }[] = [];

  return (
    <div className="space-y-6">
      <Breadcrumbs className="mb-2" />

      <PageHeader
        title="Dashboard"
        description="Ringkasan toko Anda"
        action={
          <Button variant="outline" className="rounded-xl">
            Lihat laporan
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        }
      />

      <Separator />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <StatCard title="Total Pendapatan" value="Rp 0" icon={DollarSign} hint="Belum ada transaksi" />
        <StatCard title="Penjualan" value="0" icon={CreditCard} hint="0 transaksi berhasil" />
        <StatCard title="Produk Stok" value="0" icon={Package} hint="Tambahkan produk untuk mulai jualan" />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="rounded-xl shadow-sm lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-base">Revenue Overview</CardTitle>
            <p className="text-sm text-muted-foreground">
              Tren pendapatan 7 hari terakhir.
            </p>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueData} />
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Aktivitas Terbaru</CardTitle>
            <p className="text-sm text-muted-foreground">
              Transaksi dan perubahan terbaru.
            </p>
          </CardHeader>
          <CardContent>
            <RecentActivity items={activities} />
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl border-dashed">
        <CardContent className="py-10 text-center">
          <p className="text-sm font-medium">Belum ada data aktivitas</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tambahkan produk dan lakukan transaksi pertama untuk melihat statistik.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button className="rounded-xl">Tambah Produk</Button>
            <Button variant="outline" className="rounded-xl">
              Buat Transaksi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
