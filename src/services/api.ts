import { Patient, Doctor, Appointment, CreatePatientData, CreateDoctorData, CreateAppointmentData } from '../types';

const API_BASE = '';

export const patientService = {
  async getAll(): Promise<Patient[]> {
    const response = await fetch(`${API_BASE}/api/patients`);
    if (!response.ok) {
      throw new Error('Failed to fetch patients');
    }
    return response.json();
  },

  async create(data: CreatePatientData): Promise<Patient> {
    const response = await fetch(`${API_BASE}/api/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create patient');
    }
    return response.json();
  },
};

export const doctorService = {
  async getAll(): Promise<Doctor[]> {
    const response = await fetch(`${API_BASE}/api/doctors`);
    if (!response.ok) {
      throw new Error('Failed to fetch doctors');
    }
    return response.json();
  },

  async create(data: CreateDoctorData): Promise<Doctor> {
    const response = await fetch(`${API_BASE}/api/doctors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create doctor');
    }
    return response.json();
  },
};

export const appointmentService = {
  async getAll(): Promise<Appointment[]> {
    const response = await fetch(`${API_BASE}/api/appointments`);
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    return response.json();
  },

  async create(data: CreateAppointmentData): Promise<Appointment> {
    const response = await fetch(`${API_BASE}/api/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create appointment');
    }
    return response.json();
  },
};
