import { useState, useEffect } from 'react';
import { PageLayout } from '../components/layout';
import { Button, Input, Select, Loading, PlusIcon } from '../components/ui';
import { Appointment, Patient, Doctor, CreateAppointmentData } from '../types';
import { appointmentService, patientService, doctorService } from '../services/api';

export const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookForm, setShowBookForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateAppointmentData>({
    patientId: 0,
    doctorId: 0,
    date: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appointmentsData, patientsData, doctorsData] = await Promise.all([
        appointmentService.getAll(),
        patientService.getAll(),
        doctorService.getAll(),
      ]);
      
      setAppointments(appointmentsData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newAppointment = await appointmentService.create(formData);
      setAppointments([...appointments, newAppointment]);
      setFormData({ patientId: 0, doctorId: 0, date: '' });
      setShowBookForm(false);
      // Reload data to get updated relationships
      loadData();
    } catch (error) {
      console.error('Failed to book appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const patientOptions = patients.map(patient => ({
    value: patient.id.toString(),
    label: patient.name,
  }));

  const doctorOptions = doctors.map(doctor => ({
    value: doctor.id.toString(),
    label: `Dr. ${doctor.name} (${doctor.specialization})`,
  }));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const actionButton = (
    <Button onClick={() => setShowBookForm(true)} variant="purple">
      <PlusIcon className="w-5 h-5 mr-2" />
      Book Appointment
    </Button>
  );

  return (
    <PageLayout
      title="Appointment Scheduler"
      subtitle="Schedule and manage patient appointments"
      actionButton={actionButton}
    >
      {/* Book Appointment Form */}
      {showBookForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Book New Appointment</h3>
          <form onSubmit={handleBookAppointment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              id="appointmentPatient"
              label="Patient"
              value={formData.patientId.toString()}
              onChange={(value) => setFormData({ ...formData, patientId: parseInt(value) || 0 })}
              options={patientOptions}
              placeholder="Select Patient"
              required
            />
            
            <Select
              id="appointmentDoctor"
              label="Doctor"
              value={formData.doctorId.toString()}
              onChange={(value) => setFormData({ ...formData, doctorId: parseInt(value) || 0 })}
              options={doctorOptions}
              placeholder="Select Doctor"
              required
            />
            
            <Input
              id="appointmentDate"
              label="Appointment Date & Time"
              type="datetime-local"
              value={formData.date}
              onChange={(value) => setFormData({ ...formData, date: value })}
              className="md:col-span-2"
              required
            />
            
            <div className="md:col-span-2 flex space-x-3">
              <Button type="submit" variant="purple" disabled={isSubmitting}>
                {isSubmitting ? 'Booking...' : 'Book Appointment'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setShowBookForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Appointments List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Scheduled Appointments</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Current and upcoming appointments in the system</p>
        </div>
        
        {isLoading ? (
          <Loading message="Loading appointments..." />
        ) : (
          <ul className="divide-y divide-gray-200">
            {appointments.length === 0 ? (
              <li className="px-4 py-4 text-center text-gray-500">
                No appointments found. Book a new appointment to get started.
              </li>
            ) : (
              appointments.map((appointment) => (
                <li key={appointment.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="bg-purple-100 rounded-full p-3 mr-4">
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            Appointment #{appointment.id}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Patient: <span className="font-medium">{appointment.patient?.name || `Patient ID: ${appointment.patientId}`}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Doctor: <span className="font-medium">Dr. {appointment.doctor?.name || `Doctor ID: ${appointment.doctorId}`}</span>
                            {appointment.doctor?.specialization && (
                              <span className="text-gray-500"> ({appointment.doctor.specialization})</span>
                            )}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Date: <span className="font-medium">{formatDate(appointment.date)}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Scheduled
                      </span>
                      <Button variant="primary" className="text-sm">
                        View Details
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
