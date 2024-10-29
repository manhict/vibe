import { Browse } from "@/components/common/Browse";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function page() {
  const vibeId = cookies().get("vibeId")?.value;
  if (!vibeId) redirect("/");
  const res = await fetch(`${process.env.SOCKET_URI}/api/rooms`, {
    headers: {
      cookie: `vibeId=${vibeId}`,
    },
  });
  if (!res.ok) redirect("/");

  return <Browse data={await res.json()} />;
}

export default page;
