type NavigationProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export const Navigation = ({ currentPage, onNavigate }: NavigationProps) => {
  const navItems = [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'patients', label: 'Patients', href: '/patients' },
    { key: 'doctors', label: 'Doctors', href: '/doctors' },
    { key: 'appointments', label: 'Appointments', href: '/appointments' },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">🏥 Hospital Management System</h1>
          </div>
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`px-3 py-2 rounded transition-colors ${
                  currentPage === item.key
                    ? 'bg-blue-800'
                    : 'hover:bg-blue-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
