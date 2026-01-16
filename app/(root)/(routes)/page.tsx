import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import db from "@/lib/db";
import { SetupClient } from "@/components/setup-client";

const SetupPage = async () => {

  const { userId } = await auth();


  if (!userId) {
    redirect("/sign-in");
  }

  const store = await db.store.findFirst({
    where: {
      userId: userId,
    },
  });

  if (store) {
    redirect(`/${store.id}`);
  }
  return (
    <div className="p-4">
      <SetupClient />
      <p className="text-sm text-muted-foreground">Sedang menyiapkan pembuat toko...</p>
    </div>
  );
};

export default SetupPage;
