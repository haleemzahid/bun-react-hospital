import { useState, useEffect } from 'react';
import { PageLayout } from '../components/layout';
import { Button, Input, Loading, PlusIcon } from '../components/ui';
import { Doctor, CreateDoctorData } from '../types';
import { doctorService } from '../services/api';

export const DoctorsPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateDoctorData>({
    name: '',
    specialization: '',
    availableSlots: 0,
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const data = await doctorService.getAll();
      setDoctors(data);
    } catch (error) {
      console.error('Failed to load doctors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newDoctor = await doctorService.create(formData);
      setDoctors([...doctors, newDoctor]);
      setFormData({ name: '', specialization: '', availableSlots: 0 });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add doctor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const actionButton = (
    <Button onClick={() => setShowAddForm(true)} variant="success">
      <PlusIcon className="w-5 h-5 mr-2" />
      Add New Doctor
    </Button>
  );

  return (
    <PageLayout
      title="Doctor Directory"
      subtitle="Manage doctor profiles and availability"
      actionButton={actionButton}
    >
      {/* Add Doctor Form */}
      {showAddForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Doctor</h3>
          <form onSubmit={handleAddDoctor} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="doctorName"
              label="Name"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              required
            />
            
            <Input
              id="doctorSpecialization"
              label="Specialization"
              value={formData.specialization}
              onChange={(value) => setFormData({ ...formData, specialization: value })}
              required
            />
            
            <Input
              id="doctorSlots"
              label="Available Slots"
              type="number"
              value={formData.availableSlots}
              onChange={(value) => setFormData({ ...formData, availableSlots: parseInt(value) || 0 })}
              required
            />
            
            <div className="md:col-span-2 flex space-x-3">
              <Button type="submit" variant="success" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Doctor'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Doctors List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Doctors List</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Medical professionals available in the system</p>
        </div>
        
        {isLoading ? (
          <Loading message="Loading doctors..." />
        ) : (
          <ul className="divide-y divide-gray-200">
            {doctors.length === 0 ? (
              <li className="px-4 py-4 text-center text-gray-500">
                No doctors found. Add a new doctor to get started.
              </li>
            ) : (
              doctors.map((doctor) => (
                <li key={doctor.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="bg-green-100 rounded-full p-3 mr-4">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Dr. {doctor.name}</h4>
                          <p className="text-sm text-gray-600">
                            Specialization: <span className="font-medium text-green-600">{doctor.specialization}</span>
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Available Slots: <span className="font-medium">{doctor.availableSlots}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doctor.availableSlots > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {doctor.availableSlots > 0 ? 'Available' : 'Fully Booked'}
                      </span>
                      <Button variant="primary" className="text-sm">
                        View Schedule
                      </Button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </PageLayout>
  );
};
