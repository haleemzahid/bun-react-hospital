/* eslint-disable no-alert */
// Patients page functionality

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
window.showAddPatientForm = function () {
	const form = document.getElementById('addPatientForm');
	if (form) {
		form.classList.remove('hidden');
	}
};

window.hideAddPatientForm = function () {
	const form = document.getElementById('addPatientForm');
	if (form) {
		form.classList.add('hidden');
		// Reset form
		const formElement = form.querySelector('form');
		if (formElement) {
			formElement.reset();
		}
	}
};

// Add patient function
window.addPatient = async function (event) {
	event.preventDefault();

	const nameInput = document.getElementById('patientName');
	const ageInput = document.getElementById('patientAge');
	const genderInput = document.getElementById('patientGender');
	const contactInput = document.getElementById('patientContact');
	const diseaseInput = document.getElementById('patientDisease');

	if (!nameInput || !ageInput || !genderInput || !contactInput || !diseaseInput) {
		alert('Please fill in all fields');
		return;
	}

	const patientData = {
		name: nameInput.value,
		age: parseInt(ageInput.value),
		gender: genderInput.value,
		contact: contactInput.value,
		disease: diseaseInput.value,
	};

	try {
		console.log('Creating patient:', patientData);
		await apiCall('/api/patients', 'POST', patientData);

		// Hide form and reload patients
		window.hideAddPatientForm();
		loadPatients();

		alert('Patient added successfully!');
	} catch (error) {
		alert('Error adding patient: ' + error.message);
	}
};

// Load and display patients
async function loadPatients() {
	const patientsList = document.getElementById('patientsList');
	if (!patientsList) {
		return;
	}

	try {
		console.log('Loading patients...');
		const patients = await apiCall('/api/patients');

		if (patients.length === 0) {
			patientsList.innerHTML = `
                <li class="px-4 py-4 text-center text-gray-500">
                    No patients found. Add some patients to get started.
                </li>
            `;
			return;
		}

		patientsList.innerHTML = patients.map(patient => `
            <li class="px-4 py-4">
                <div class="flex items-center justify-between">
                    <div class="flex-1">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    ${patient.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">${patient.name}</div>
                                <div class="text-sm text-gray-500">
                                    ${patient.age} years old • ${patient.gender} • ${patient.disease}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="text-sm text-gray-500">
                            📞 ${patient.contact}
                        </div>
                        <div class="text-sm text-gray-500">
                            ${patient.appointments?.length || 0} appointments
                        </div>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                        </span>
                    </div>
                </div>
            </li>
        `).join('');

		console.log(`Loaded ${patients.length} patients`);
	} catch (error) {
		patientsList.innerHTML = `
            <li class="px-4 py-4 text-center text-red-500">
                Error loading patients: ${error.message}
            </li>
        `;
	}
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
	console.log('🏥 Patients page initialized');
	loadPatients();
});
