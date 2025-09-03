import {serve} from 'bun';
import prisma from './database/data';

// Import HTML files as routes
import indexPage from './public/index.html';
import patientsPage from './public/patients.html';
import doctorsPage from './public/doctors.html';
import appointmentsPage from './public/appointments.html';

const server = serve({
	port: 3000,

	// Define routes using Bun's new routes API
	routes: {
		// HTML Pages
		'/': indexPage,
		'/patients': patientsPage,
		'/doctors': doctorsPage,
		'/appointments': appointmentsPage,

		// API Endpoints for Patients
		'/api/patients': {
			async GET() {
				try {
					const patients = await prisma.patient.findMany({
						include: {
							appointments: {
								include: {
									doctor: true,
								},
							},
						},
					});
					return Response.json(patients);
				} catch {
					return Response.json({error: 'Failed to fetch patients'}, {status: 500});
				}
			},

			async POST(req) {
				try {
					const {name, age, gender, contact, disease} = await req.json();
					const patient = await prisma.patient.create({
						data: {
							name, age, gender, contact, disease,
						},
					});
					return Response.json(patient, {status: 201});
				} catch {
					return Response.json({error: 'Failed to create patient'}, {status: 500});
				}
			},
		},

		// API Endpoints for Doctors
		'/api/doctors': {
			async GET() {
				try {
					const doctors = await prisma.doctor.findMany({
						include: {
							appointments: {
								include: {
									patient: true,
								},
							},
						},
					});
					return Response.json(doctors);
				} catch {
					return Response.json({error: 'Failed to fetch doctors'}, {status: 500});
				}
			},

			async POST(req) {
				try {
					const {name, specialization, availableSlots} = await req.json();
					const doctor = await prisma.doctor.create({
						data: {name, specialization, availableSlots},
					});
					return Response.json(doctor, {status: 201});
				} catch {
					return Response.json({error: 'Failed to create doctor'}, {status: 500});
				}
			},
		},

		// API Endpoints for Appointments
		'/api/appointments': {
			async GET() {
				try {
					const appointments = await prisma.appointment.findMany({
						include: {
							patient: true,
							doctor: true,
						},
					});
					return Response.json(appointments);
				} catch {
					return Response.json({error: 'Failed to fetch appointments'}, {status: 500});
				}
			},

			async POST(req) {
				try {
					const {patientId, doctorId, date} = await req.json();
					const appointment = await prisma.appointment.create({
						data: {
							patientId: parseInt(patientId),
							doctorId: parseInt(doctorId),
							date: date || new Date().toISOString().split('T')[0],
						},
						include: {
							patient: true,
							doctor: true,
						},
					});
					return Response.json(appointment, {status: 201});
				} catch {
					return Response.json({error: 'Failed to create appointment'}, {status: 500});
				}
			},
		},

		// Individual patient endpoint
		async '/api/patients/:id'(req) {
			try {
				const id = parseInt(req.params.id, 10);
				const patient = await prisma.patient.findUnique({
					where: {id},
					include: {
						appointments: {
							include: {
								doctor: true,
							},
						},
					},
				});

				if (!patient) {
					return Response.json({error: 'Patient not found'}, {status: 404});
				}

				return Response.json(patient);
			} catch {
				return Response.json({error: 'Failed to fetch patient'}, {status: 500});
			}
		},

		// Individual doctor endpoint
		async '/api/doctors/:id'(req) {
			try {
				const id = parseInt(req.params.id);
				const doctor = await prisma.doctor.findUnique({
					where: {id},
					include: {
						appointments: {
							include: {
								patient: true,
							},
						},
					},
				});

				if (!doctor) {
					return Response.json({error: 'Doctor not found'}, {status: 404});
				}

				return Response.json(doctor);
			} catch {
				return Response.json({error: 'Failed to fetch doctor'}, {status: 500});
			}
		},
	},

	// Enable development mode for hot reloading and debugging
	development: {
		hmr: true, // Hot module reloading
		console: true, // Echo browser console logs to terminal
	},

	// Fallback for unmatched routes
	async fetch() {
		return new Response('Not Found', {status: 404});
	},
});

console.log(`🚀 Hospital Management System running at http://localhost:${server.port}`);
console.log('📋 Pages available:');
console.log(`   • Home: http://localhost:${server.port}/`);
console.log(`   • Patients: http://localhost:${server.port}/patients`);
console.log(`   • Doctors: http://localhost:${server.port}/doctors`);
console.log(`   • Appointments: http://localhost:${server.port}/appointments`);
console.log('🔌 API Endpoints:');
console.log('   • GET/POST /api/patients');
console.log('   • GET/POST /api/doctors');
console.log('   • GET/POST /api/appointments');
