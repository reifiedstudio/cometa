import TasksPage from "./department-page";

export function generateStaticParams() {
  return [{ slug: "accounting" }, { slug: "legal" }];
}

export default function Page() {
  return <TasksPage />;
}
