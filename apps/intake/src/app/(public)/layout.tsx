export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-muted">{children}</div>
  );
}
