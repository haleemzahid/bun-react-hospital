import { useState } from 'react';
import { Navigation } from '../components/layout';
import { HomePage, PatientsPage, DoctorsPage, AppointmentsPage } from '../pages';

type Page = 'home' | 'patients' | 'doctors' | 'appointments';

export const Router = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'patients':
        return <PatientsPage />;
      case 'doctors':
        return <DoctorsPage />;
      case 'appointments':
        return <AppointmentsPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      {renderPage()}
    </div>
  );
};
