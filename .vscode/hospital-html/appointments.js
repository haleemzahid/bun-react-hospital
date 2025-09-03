// Appointments page functionality

// API helper functions
async function apiCall(endpoint, method = 'GET', data) {
	try {
		const options = {
			method,
			headers: {
				'Content-Type': 'application/json',
			},
		};

		if (data && method !== 'GET') {
			options.body = JSON.stringify(data);
		}

		const response = await fetch(endpoint, options);
		const result = await response.json();

		if (!response.ok) {
			throw new Error(result.error || 'API call failed');
		}

		return result;
	} catch (error) {
		console.error('API Error:', error);
		throw error;
	}
}

// Show/Hide form functions
window.showBookAppointmentForm = function () {
	const form = document.getElementById('bookAppointmentForm');
	if (form) {
		form.classList.remove('hidden');
		loadPatientsAndDoctorsForForm();
	}
};

window.hideBookAppointmentForm = function () {
	const form = document.getElementById('bookAppointmentForm');
	if (form) {
		form.classList.add('hidden');
		// Reset form
		const formElement = form.querySelector('form');
		if (formElement) {
			formElement.reset();
		}
	}
};

// Load patients and doctors for the appointment form
async function loadPatientsAndDoctorsForForm() {
	try {
		const [patients, doctors] = await Promise.all([
			apiCall('/api/patients'),
			apiCall('/api/doctors'),
		]);

		const patientSelect = document.getElementById('appointmentPatient');
		const doctorSelect = document.getElementById('appointmentDoctor');

		if (patientSelect) {
			patientSelect.innerHTML = '<option value="">Select a patient</option>'
				+ patients.map(patient =>
					`<option value="${patient.id}">${patient.name} (${patient.age}, ${patient.gender})</option>`).join('');
		}

		if (doctorSelect) {
			doctorSelect.innerHTML = '<option value="">Select a doctor</option>'
				+ doctors.map(doctor =>
					`<option value="${doctor.id}">Dr. ${doctor.name} - ${doctor.specialization}</option>`).join('');
		}

		// Set default date to today
		const dateInput = document.getElementById('appointmentDate');
		if (dateInput) {
			const today = new Date().toISOString().split('T')[0];
			dateInput.value = today;
		}
	} catch (error) {
		console.error('Error loading form data:', error);
		alert('Error loading patients and doctors: ' + error.message);
	}
}

// Book appointment function
window.bookAppointment = async function (event) {
	event.preventDefault();

	const patientSelect = document.getElementById('appointmentPatient');
	const doctorSelect = document.getElementById('appointmentDoctor');
	const dateInput = document.getElementById('appointmentDate');

	if (!patientSelect || !doctorSelect || !dateInput) {
		alert('Please fill in all fields');
		return;
	}

	const appointmentData = {
		patientId: patientSelect.value,
		doctorId: doctorSelect.value,
		date: dateInput.value,
	};

	if (!appointmentData.patientId || !appointmentData.doctorId || !appointmentData.date) {
		alert('Please fill in all fields');
		return;
	}

	try {
		console.log('Creating appointment:', appointmentData);
		await apiCall('/api/appointments', 'POST', appointmentData);

		// Hide form and reload appointments
		window.hideBookAppointmentForm();
		loadAppointments();

		alert('Appointment booked successfully!');
	} catch (error) {
		alert('Error booking appointment: ' + error.message);
	}
};

// Format date for display
function formatDate(dateString) {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

// Get status color based on date
function getAppointmentStatus(dateString) {
	const appointmentDate = new Date(dateString);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	appointmentDate.setHours(0, 0, 0, 0);

	if (appointmentDate > today) {
		return {status: 'Upcoming', color: 'bg-blue-100 text-blue-800'};
	}

	if (appointmentDate.getTime() === today.getTime()) {
		return {status: 'Today', color: 'bg-green-100 text-green-800'};
	}

	return {status: 'Completed', color: 'bg-gray-100 text-gray-800'};
}

// Load and display appointments
async function loadAppointments() {
	const appointmentsList = document.getElementById('appointmentsList');
	if (!appointmentsList) {
		return;
	}

	try {
		console.log('Loading appointments...');
		const appointments = await apiCall('/api/appointments');

		if (appointments.length === 0) {
			appointmentsList.innerHTML = `
                <div class="px-4 py-8 text-center text-gray-500">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
                    <p class="mt-1 text-sm text-gray-500">Get started by booking a new appointment.</p>
                </div>
            `;
			return;
		}

		// Sort appointments by date (newest first)
		appointments.sort((a, b) => new Date(b.date) - new Date(a.date));

		appointmentsList.innerHTML = appointments.map(appointment => {
			const statusInfo = getAppointmentStatus(appointment.date);
			return `
                <div class="px-4 py-4 border-b border-gray-200 last:border-b-0">
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                        ${appointment.patient.name.charAt(0).toUpperCase()}${appointment.doctor.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div class="ml-4 flex-1">
                                    <div class="text-sm font-medium text-gray-900">
                                        ${appointment.patient.name} → Dr. ${appointment.doctor.name}
                                    </div>
                                    <div class="text-sm text-gray-500">
                                        ${appointment.doctor.specialization} • ${formatDate(appointment.date)}
                                    </div>
                                    <div class="text-xs text-gray-400 mt-1">
                                        Patient: ${appointment.patient.age} years, ${appointment.patient.gender} • Contact: ${appointment.patient.contact}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center space-x-4">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}">
                                ${statusInfo.status}
                            </span>
                            <div class="text-sm text-gray-500">
                                ID: #${appointment.id}
                            </div>
                        </div>
                    </div>
                </div>
            `;
		}).join('');

		console.log(`Loaded ${appointments.length} appointments`);
	} catch (error) {
		appointmentsList.innerHTML = `
            <div class="px-4 py-4 text-center text-red-500">
                Error loading appointments: ${error.message}
            </div>
        `;
	}
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
	console.log('📅 Appointments page initialized');
	loadAppointments();
});
