import {serve} from 'bun';
import index from './index.html';
import prisma from './database/data';

const server = serve({
	routes: {
		// Serve index.html for all unmatched routes.
		'/*': index,

		'/api/hello': {
			async GET() {
				return Response.json({
					message: 'Hello, world!',
					method: 'GET',
				});
			},
			async PUT() {
				return Response.json({
					message: 'Hello, world!',
					method: 'PUT',
				});
			},
		},
    
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

		async '/api/hello/:name'(req) {
			const {name} = req.params;
			return Response.json({
				message: `Hello, ${name}!`,
			});
		},
	},

	development: process.env.NODE_ENV !== 'production' && {
		// Enable browser hot reloading in development
		hmr: true,

		// Echo console logs from the browser to the server
		console: true,
	},
});

console.log(`🚀 Server running at ${server.url}`);
