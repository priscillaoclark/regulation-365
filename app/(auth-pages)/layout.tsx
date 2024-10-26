export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl flex flex-col mt-16 gap-12 items-start">
      {children}
    </div>
  );
}
