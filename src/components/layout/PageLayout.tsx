import { ReactNode } from 'react';

type PageLayoutProps = {
  children: ReactNode;
  title: string;
  subtitle: string;
  actionButton?: ReactNode;
};

export const PageLayout = ({ children, title, subtitle, actionButton }: PageLayoutProps) => {
  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {title}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          </div>
          {actionButton && (
            <div className="mt-4 flex md:mt-0 md:ml-4">
              {actionButton}
            </div>
          )}
        </div>
        {children}
      </div>
    </main>
  );
};
