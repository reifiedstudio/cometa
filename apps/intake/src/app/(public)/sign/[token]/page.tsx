import ClientPage from "./_client";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ token: "_" }];
}

export default function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return <ClientPage params={params} />;
}
