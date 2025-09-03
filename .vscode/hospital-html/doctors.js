// Doctors page functionality

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
window.showAddDoctorForm = function () {
	const form = document.getElementById('addDoctorForm');
	if (form) {
		form.classList.remove('hidden');
	}
};

window.hideAddDoctorForm = function () {
	const form = document.getElementById('addDoctorForm');
	if (form) {
		form.classList.add('hidden');
		// Reset form
		const formElement = form.querySelector('form');
		if (formElement) {
			formElement.reset();
		}
	}
};

// Add doctor function
window.addDoctor = async function (event) {
	event.preventDefault();

	const nameInput = document.getElementById('doctorName');
	const specializationInput = document.getElementById('doctorSpecialization');
	const slotsInput = document.getElementById('doctorSlots');

	if (!nameInput || !specializationInput || !slotsInput) {
		alert('Please fill in all fields');
		return;
	}

	const doctorData = {
		name: nameInput.value,
		specialization: specializationInput.value,
		availableSlots: parseInt(slotsInput.value),
	};

	try {
		console.log('Creating doctor:', doctorData);
		await apiCall('/api/doctors', 'POST', doctorData);

		// Hide form and reload doctors
		window.hideAddDoctorForm();
		loadDoctors();

		alert('Doctor added successfully!');
	} catch (error) {
		alert('Error adding doctor: ' + error.message);
	}
};

// Get specialization color
function getSpecializationColor(specialization) {
	const colors = {
		Cardiology: 'bg-red-100 text-red-800',
		Neurology: 'bg-purple-100 text-purple-800',
		Orthopedics: 'bg-blue-100 text-blue-800',
		Pediatrics: 'bg-green-100 text-green-800',
		Dermatology: 'bg-yellow-100 text-yellow-800',
		'General Medicine': 'bg-gray-100 text-gray-800',
		Surgery: 'bg-orange-100 text-orange-800',
		'Emergency Medicine': 'bg-red-100 text-red-800',
	};
	return colors[specialization] || 'bg-gray-100 text-gray-800';
}

// Load and display doctors
async function loadDoctors() {
	const doctorsGrid = document.getElementById('doctorsGrid');
	if (!doctorsGrid) {
		return;
	}

	try {
		console.log('Loading doctors...');
		const doctors = await apiCall('/api/doctors');

		if (doctors.length === 0) {
			doctorsGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="text-gray-500">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900">No doctors</h3>
                        <p class="mt-1 text-sm text-gray-500">Get started by adding a new doctor.</p>
                    </div>
                </div>
            `;
			return;
		}

		doctorsGrid.innerHTML = doctors.map(doctor => `
            <div class="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div class="p-6">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                ${doctor.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        <div class="ml-4 flex-1">
                            <h3 class="text-lg font-medium text-gray-900">Dr. ${doctor.name}</h3>
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSpecializationColor(doctor.specialization)}">
                                ${doctor.specialization}
                            </span>
                        </div>
                    </div>
                    
                    <div class="mt-4">
                        <div class="flex items-center justify-between text-sm text-gray-600">
                            <span>Available Slots</span>
                            <span class="font-semibold">${doctor.availableSlots}</span>
                        </div>
                        <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-green-600 h-2 rounded-full" style="width: ${Math.min((doctor.availableSlots / 20) * 100, 100)}%"></div>
                        </div>
                    </div>
                    
                    <div class="mt-4 text-sm text-gray-500">
                        ${doctor.appointments?.length || 0} appointments scheduled
                    </div>
                    
                    <div class="mt-4">
                        <button class="w-full bg-green-50 text-green-700 hover:bg-green-100 font-medium py-2 px-4 rounded border border-green-200 transition-colors">
                            View Schedule
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

		console.log(`Loaded ${doctors.length} doctors`);
	} catch (error) {
		doctorsGrid.innerHTML = `
            <div class="col-span-full text-center py-12 text-red-500">
                Error loading doctors: ${error.message}
            </div>
        `;
	}
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
	console.log('👨‍⚕️ Doctors page initialized');
	loadDoctors();
});
