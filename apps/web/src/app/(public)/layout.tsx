export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-[#F5F5F5]">
      {children}
    </div>
  );
}
