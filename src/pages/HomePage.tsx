import { useState } from 'react';
import { FeatureCard } from '../components/layout';
import { UserIcon, DoctorIcon, CalendarIcon } from '../components/ui';
import { patientService, doctorService } from '../services/api';

type HomePageProps = {
  onNavigate: (page: string) => void;
};

export const HomePage = ({ onNavigate }: HomePageProps) => {
  const [apiResponse, setApiResponse] = useState<string>('Click a button to test API');

  const testGetPatients = async () => {
    try {
      const patients = await patientService.getAll();
      setApiResponse(JSON.stringify(patients, null, 2));
    } catch (error) {
      setApiResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testGetDoctors = async () => {
    try {
      const doctors = await doctorService.getAll();
      setApiResponse(JSON.stringify(doctors, null, 2));
    } catch (error) {
      setApiResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Welcome Section */}
        <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Hospital Management System</h2>
            <p className="text-lg text-gray-600 mb-6">
              A modern full-stack application built with <strong>Bun</strong>, <strong>TypeScript</strong>, <strong>React</strong>, <strong>Prisma</strong>, and <strong>Tailwind CSS</strong>
            </p>
            
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                title="Patient Management"
                description="Register, view, and manage patient information including medical history and personal details."
                icon={<UserIcon />}
                buttonText="Manage Patients"
                buttonColor="blue"
                onButtonClick={() => onNavigate('patients')}
              />

              <FeatureCard
                title="Doctor Directory"
                description="Manage doctor profiles, specializations, and availability schedules for appointments."
                icon={<DoctorIcon />}
                buttonText="View Doctors"
                buttonColor="green"
                onButtonClick={() => onNavigate('doctors')}
              />

              <FeatureCard
                title="Appointments"
                description="Schedule, track, and manage patient appointments with doctors across all departments."
                icon={<CalendarIcon />}
                buttonText="Book Appointment"
                buttonColor="purple"
                onButtonClick={() => onNavigate('appointments')}
              />
            </div>
          </div>
        </div>

        {/* API Demo Section */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔌 API Demonstration</h3>
            <p className="text-gray-600 mb-4">Test the RESTful APIs built with Bun's new routing system:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded border">
                <h4 className="font-semibold mb-2">Test GET API</h4>
                <button
                  onClick={testGetPatients}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                >
                  Get All Patients
                </button>
                <button
                  onClick={testGetDoctors}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Get All Doctors
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded border">
                <h4 className="font-semibold mb-2">API Response</h4>
                <pre className="bg-gray-800 text-green-400 p-2 rounded text-sm overflow-x-auto max-h-32">
                  {apiResponse}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
