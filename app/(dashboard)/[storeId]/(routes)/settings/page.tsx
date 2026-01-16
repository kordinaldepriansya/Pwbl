import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "./components/settings-form";

const SettingsPage = async ({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { storeId } = await params;

  const store = await db.store.findFirst({
    where: { id: storeId, userId },
  });

  if (!store) redirect("/");

  return (
    <div className="space-y-6">
      <Breadcrumbs className="mb-2" />

      <PageHeader title="Settings" description="Kelola preferensi toko" />

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Informasi Toko</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsForm initialData={store} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
