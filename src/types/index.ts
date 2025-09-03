export type Patient = {
  id: number;
  name: string;
  age: number;
  gender: string;
  contact: string;
  disease: string;
  appointments?: Appointment[];
};

export type Doctor = {
  id: number;
  name: string;
  specialization: string;
  availableSlots: number;
  appointments?: Appointment[];
};

export type Appointment = {
  id: number;
  date: string;
  patientId: number;
  doctorId: number;
  patient?: Patient;
  doctor?: Doctor;
};

export type CreatePatientData = Omit<Patient, 'id' | 'appointments'>;
export type CreateDoctorData = Omit<Doctor, 'id' | 'appointments'>;
export type CreateAppointmentData = Omit<Appointment, 'id' | 'patient' | 'doctor'>;
