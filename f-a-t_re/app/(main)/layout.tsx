import Sidebar from '@/app/components/sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="main-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}