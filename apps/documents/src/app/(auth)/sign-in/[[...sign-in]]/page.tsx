import ClientPage from "./_client";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ "sign-in": [] }];
}

export default function Page() {
  return <ClientPage />;
}
