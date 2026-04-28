import AgentPage from "./agent-page";

export function generateStaticParams() {
  return [{ slug: "accounting" }, { slug: "legal" }];
}

export default function Page() {
  return <AgentPage />;
}
