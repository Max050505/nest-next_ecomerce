
import Link from 'next/link';

const stats = [
  {
    title: 'Users',
    value: '—',
    description: 'Total registered users',
    href: '/admin/users',
  },
  {
    title: 'Products',
    value: '—',
    description: 'Products in store',
    href: '/admin/products',
  },
  {
    title: 'Categories',
    value: '—',
    description: 'Active categories',
    href: '/admin/categories',
  },
  {
    title: 'Orders',
    value: '—',
    description: 'Total orders',
    href: '/admin/orders',
  },
];

const quickActions = [
  {
    title: 'Manage categories',
    description: 'Create, edit and remove categories.',
    href: '/admin/categories',
  },
  {
    title: 'Manage products',
    description: 'Add and manage products in your store.',
    href: '/admin/products',
  },
  {
    title: 'Manage users',
    description: 'View users and manage their roles.',
    href: '/admin/users',
  },
];

export function AdminDashboard() {
  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
          Overview
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage your store and monitor its activity.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <p className="mt-3 text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>

              <span className="text-gray-400 transition group-hover:text-gray-900">
                →
              </span>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              {stat.description}
            </p>
          </Link>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900">
          Quick actions
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Quickly navigate to the most important sections.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-gray-300 hover:shadow-sm"
            >
              <h3 className="font-semibold text-gray-900">
                {action.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {action.description}
              </p>

              <span className="mt-5 inline-block text-sm font-medium text-gray-900">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900">
          Recent activity
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Recent store activity will appear here.
        </p>

        <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
          <p className="text-sm text-gray-500">
            No activity yet.
          </p>
        </div>
      </section>
    </div>
  );
}

