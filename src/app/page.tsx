import getCurrentUser from "@/actions/getCurrentUser";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  );
}
