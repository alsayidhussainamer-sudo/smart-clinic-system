// =========================
// INPUT VALIDATION
// =========================

const Validation = {
    // Email validation
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Phone validation (accepts international formats)
    isValidPhone: (phone) => {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    },

    // Required field validation
    isRequired: (value) => {
        return value && value.trim() !== '';
    },

    // Date validation (not in future for birth date, not in past for appointment)
    isValidDate: (date, type = 'any') => {
        const inputDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(inputDate.getTime())) return false;

        if (type === 'birth') {
            return inputDate < today;
        } else if (type === 'appointment') {
            return inputDate >= today;
        }
        return true;
    },

    // Name validation (letters and spaces only)
    isValidName: (name) => {
        const nameRegex = /^[a-zA-Z\s\u0600-\u06FF]{3,50}$/;
        return nameRegex.test(name.trim());
    },

    // Length validation
    isValidLength: (value, min, max) => {
        const length = value.trim().length;
        return length >= min && length <= max;
    },

    // Validate patient form
    validatePatientForm: (patient) => {
        const errors = [];

        if (!Validation.isRequired(patient.fullName)) {
            errors.push('Full Name is required');
        } else if (!Validation.isValidName(patient.fullName)) {
            errors.push('Full Name must be 3-50 characters (letters only)');
        }

        if (!Validation.isRequired(patient.phone)) {
            errors.push('Phone is required');
        } else if (!Validation.isValidPhone(patient.phone)) {
            errors.push('Please enter a valid phone number');
        }

        if (Validation.isRequired(patient.email) && !Validation.isValidEmail(patient.email)) {
            errors.push('Please enter a valid email address');
        }

        if (patient.birthDate && !Validation.isValidDate(patient.birthDate, 'birth')) {
            errors.push('Birth date must be in the past');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    // Validate doctor form
    validateDoctorForm: (doctor) => {
        const errors = [];

        if (!Validation.isRequired(doctor.fullName)) {
            errors.push('Full Name is required');
        } else if (!Validation.isValidName(doctor.fullName)) {
            errors.push('Full Name must be 3-50 characters (letters only)');
        }

        if (!Validation.isRequired(doctor.phone)) {
            errors.push('Phone is required');
        } else if (!Validation.isValidPhone(doctor.phone)) {
            errors.push('Please enter a valid phone number');
        }

        if (Validation.isRequired(doctor.email) && !Validation.isValidEmail(doctor.email)) {
            errors.push('Please enter a valid email address');
        }

        if (!Validation.isRequired(doctor.specialtyId)) {
            errors.push('Specialty is required');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    // Validate appointment form
    validateAppointmentForm: (appointment) => {
        const errors = [];

        if (!Validation.isRequired(appointment.patientId)) {
            errors.push('Patient is required');
        }

        if (!Validation.isRequired(appointment.doctorId)) {
            errors.push('Doctor is required');
        }

        if (!Validation.isRequired(appointment.appointmentDate)) {
            errors.push('Date is required');
        }

        if (!Validation.isRequired(appointment.appointmentTime)) {
            errors.push('Time is required');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    // Validate user form
    validateUserForm: (user, isUpdate = false) => {
        const errors = [];

        if (!Validation.isRequired(user.username)) {
            errors.push('Username is required');
        } else if (!Validation.isValidLength(user.username, 3, 20)) {
            errors.push('Username must be 3-20 characters');
        }

        if (!isUpdate && !Validation.isRequired(user.password)) {
            errors.push('Password is required');
        } else if (!isUpdate && !Validation.isValidLength(user.password, 6, 50)) {
            errors.push('Password must be at least 6 characters');
        }

        if (!Validation.isRequired(user.role)) {
            errors.push('Role is required');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    // Validate medical record form
    validateMedicalRecordForm: (record) => {
        const errors = [];

        if (!Validation.isRequired(record.patientId)) {
            errors.push('Patient is required');
        }

        if (!Validation.isRequired(record.doctorId)) {
            errors.push('Doctor is required');
        }

        if (!Validation.isRequired(record.symptoms)) {
            errors.push('Symptoms are required');
        }

        if (!Validation.isRequired(record.diagnosis)) {
            errors.push('Diagnosis is required');
        }

        if (!Validation.isRequired(record.visitDate)) {
            errors.push('Visit date is required');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    // Show validation errors
    showErrors: (errors) => {
        if (errors.length > 0) {
            alert('Please fix the following errors:\n\n• ' + errors.join('\n• '));
            return false;
        }
        return true;
    }
};

// Make it globally available
window.Validation = Validation;