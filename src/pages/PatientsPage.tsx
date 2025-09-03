import { useState, useEffect } from 'react';
import { PageLayout } from '../components/layout';
import { Button, Input, Select, Loading, PlusIcon } from '../components/ui';
import { Patient, CreatePatientData } from '../types';
import { patientService } from '../services/api';

export const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreatePatientData>({
    name: '',
    age: 0,
    gender: '',
    contact: '',
    disease: '',
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await patientService.getAll();
      setPatients(data);
    } catch (error) {
      console.error('Failed to load patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newPatient = await patientService.create(formData);
      setPatients([...patients, newPatient]);
      setFormData({ name: '', age: 0, gender: '', contact: '', disease: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add patient:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  const actionButton = (
    <Button onClick={() => setShowAddForm(true)} variant="primary">
      <PlusIcon className="w-5 h-5 mr-2" />
      Add New Patient
    </Button>
  );

  return (
    <PageLayout
      title="Patient Management"
      subtitle="Manage patient records and information"
      actionButton={actionButton}
    >
      {/* Add Patient Form */}
      {showAddForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Patient</h3>
          <form onSubmit={handleAddPatient} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="patientName"
              label="Name"
              value={formData.name}
              onChange={(value) => setFormData({ ...formData, name: value })}
              required
            />
            
            <Input
              id="patientAge"
              label="Age"
              type="number"
              value={formData.age}
              onChange={(value) => setFormData({ ...formData, age: parseInt(value) || 0 })}
              required
            />
            
            <Select
              id="patientGender"
              label="Gender"
              value={formData.gender}
              onChange={(value) => setFormData({ ...formData, gender: value })}
              options={genderOptions}
              placeholder="Select Gender"
              required
            />
            
            <Input
              id="patientContact"
              label="Contact"
              value={formData.contact}
              onChange={(value) => setFormData({ ...formData, contact: value })}
              required
            />
            
            <Input
              id="patientDisease"
              label="Disease/Condition"
              value={formData.disease}
              onChange={(value) => setFormData({ ...formData, disease: value })}
              className="md:col-span-2"
              required
            />
            
            <div className="md:col-span-2 flex space-x-3">
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Patient'}
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

      {/* Patients List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Patients List</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Current registered patients in the system</p>
        </div>
        
        {isLoading ? (
          <Loading message="Loading patients..." />
        ) : (
          <ul className="divide-y divide-gray-200">
            {patients.length === 0 ? (
              <li className="px-4 py-4 text-center text-gray-500">
                No patients found. Add a new patient to get started.
              </li>
            ) : (
              patients.map((patient) => (
                <li key={patient.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <span className="text-blue-600 font-semibold">
                            {patient.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{patient.name}</h4>
                          <p className="text-sm text-gray-600">
                            Age: {patient.age} | Gender: {patient.gender} | Contact: {patient.contact}
                          </p>
                          <p className="text-sm text-red-600 mt-1">Condition: {patient.disease}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
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
