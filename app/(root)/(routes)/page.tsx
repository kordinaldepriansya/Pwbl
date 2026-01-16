import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { SetupClient } from "../../../components/setup-client";

const SetupPage = async () => {
  const { userId } = await auth();

  // Middleware sudah menjamin userId ada di sini. 
  // Jika tidak ada, user tidak akan sampai ke baris ini.

  const store = await db.store.findFirst({
    where: {
      userId: userId as string,
    },
  });

  if (store) {
    redirect(`/${store.id}`);
  }

  return <SetupClient />;
};

export default SetupPage;