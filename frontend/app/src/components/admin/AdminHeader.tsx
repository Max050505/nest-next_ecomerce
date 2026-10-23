interface AdminHeaderProps {
  user: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    role: 'USER' | 'ADMIN';
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold">
          Admin Panel
        </h1>
      </div>

      <div className="text-right">
        <p className="text-sm font-medium">
          {user.firstName} {user.lastName}
        </p>

        <p className="text-xs text-gray-500">
          {user.email}
        </p>
      </div>
    </header>
  );
}