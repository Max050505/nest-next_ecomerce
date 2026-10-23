import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/get-current-user';
import { AdminSidebar } from '@/components/admin/AdminSideBar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth?mode=login');
  }

  if (user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="pl-64">
        <AdminHeader user={user} />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}