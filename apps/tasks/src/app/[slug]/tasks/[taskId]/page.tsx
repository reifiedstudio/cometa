import TaskDetailPage from "./task-detail-page";

export function generateStaticParams() {
  return [
    { slug: "accounting", taskId: "_" },
    { slug: "legal", taskId: "_" },
  ];
}

export default function Page() {
  return <TaskDetailPage />;
}
