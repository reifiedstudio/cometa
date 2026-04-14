import ViewerPage from "./viewer-page";

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function Page() {
  return <ViewerPage />;
}
