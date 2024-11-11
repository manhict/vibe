import { redirect } from "next/navigation";

function page({ params }: { params: { name: string } }) {
  const name = params.name;
  redirect(`/v?room=${name}`);
}

export default page;
