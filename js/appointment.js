document.getElementById("appointmentForm").addEventListener("submit", async function(e) {
  e.preventDefault(); // page reload rokne ke liye

  var mobile = document.getElementById("mobileNumber").value.replace(/\D/g, "");
  if (mobile.length === 10) mobile = "91" + mobile;

  var payload = {
    fullName: document.getElementById("fullName").value,
    mobileNumber: mobile,
    email: document.getElementById("email").value,
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    department: document.getElementById("department").value,
    preferredDoctor: document.getElementById("preferredDoctor").value,
    preferredDate: document.getElementById("preferredDate").value,
    preferredTime: document.getElementById("preferredTime").value,
    problemDescription: document.getElementById("problem").value,
    submittedAt: new Date().toISOString()
  };

  try {
    const response = await fetch("https://hook.eu1.make.com/888h9iyypt0e4lakd9n1n534vsacqfek", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      alert("Appointment confirmed! Hum jald hi aapse contact karenge.");
      document.getElementById("appointmentForm").reset();
    } else {
      alert("Kuch gadbad ho gayi, dobara try karein.");
    }
  } catch (err) {
    console.error(err);
    alert("Network error, please try again.");
  }
});

document.addEventListener('DOMContentLoaded', initAppointmentForm);

const DEPARTMENTS = [
  'Cardiology', 'Neurology', 'Orthopedics', 'Oncology',
  'Pediatrics', 'Gynecology', 'Urology', 'Gastroenterology',
  'Dermatology', 'ENT', 'Ophthalmology', 'Psychiatry',
  'Pulmonology', 'Endocrinology', 'Nephrology', 'Emergency Medicine'
];

const DOCTORS_BY_DEPT = {
  'Cardiology'         : ['Dr. Arjun Sharma', 'Dr. Meenakshi Iyer'],
  'Neurology'          : ['Dr. Vikram Patel', 'Dr. Sunita Rao'],
  'Orthopedics'        : ['Dr. Ravi Kumar', 'Dr. Priya Nair'],
  'Oncology'           : ['Dr. Suresh Mehta', 'Dr. Kavitha Krishnan'],
  'Pediatrics'         : ['Dr. Ananya Gupta', 'Dr. Rahul Verma'],
  'Gynecology'         : ['Dr. Deepa Srinivasan', 'Dr. Smitha Reddy'],
  'Urology'            : ['Dr. Karthik Nair', 'Dr. Arun Pillai'],
  'Gastroenterology'   : ['Dr. Jayesh Patel', 'Dr. Mythili Chandran'],
  'Dermatology'        : ['Dr. Neha Kapoor', 'Dr. Sanjay Bhatt'],
  'ENT'                : ['Dr. Mohan Lal', 'Dr. Preethi Kumar'],
  'Ophthalmology'      : ['Dr. Harish Rao', 'Dr. Uma Devi'],
  'Psychiatry'         : ['Dr. Rakesh Saxena', 'Dr. Leela Menon'],
  'Pulmonology'        : ['Dr. Anil Mathur', 'Dr. Geetha Pillai'],
  'Endocrinology'      : ['Dr. Sunil Khanna', 'Dr. Rekha Nair'],
  'Nephrology'         : ['Dr. Bharat Singh', 'Dr. Padma Suresh'],
  'Emergency Medicine' : ['Dr. Manoj Tiwari', 'Dr. Nisha Varma']
};

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM',
  '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
  '04:30 PM', '05:00 PM'
];

function initAppointmentForm() {
  const form = document.getElementById('appointment-form');
  if (!form) return;

  const deptSelect   = document.getElementById('appt-department');
  const doctorSelect = document.getElementById('appt-doctor');
  const timeSelect   = document.getElementById('appt-time');
  const dateInput    = document.getElementById('appt-date');

  // Populate departments
  if (deptSelect) {
    DEPARTMENTS.forEach(dept => {
      const opt = document.createElement('option');
      opt.value = dept;
      opt.textContent = dept;
      deptSelect.appendChild(opt);
    });

    deptSelect.addEventListener('change', () => {
      const dept = deptSelect.value;
      if (!doctorSelect) return;
      doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
      const doctors = DOCTORS_BY_DEPT[dept] || [];
      doctors.forEach(doc => {
        const opt = document.createElement('option');
        opt.value = doc;
        opt.textContent = doc;
        doctorSelect.appendChild(opt);
      });
    });
  }

  // Populate time slots
  if (timeSelect) {
    TIME_SLOTS.forEach(time => {
      const opt = document.createElement('option');
      opt.value = time;
      opt.textContent = time;
      timeSelect.appendChild(opt);
    });
  }

  // Set minimum date to today
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Real-time validation
  form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) validateField(field);
    });
  });

  // Form submission
  form.addEventListener('submit', handleSubmit);
}

/* ─── Form Validation ────────────────────────────────────── */
function validateField(field) {
  const value = field.value.trim();
  const required = field.hasAttribute('required');
  let valid = true;
  let message = '';

  if (required && !value) {
    valid = false;
    message = 'This field is required.';
  } else if (value) {
    switch (field.type) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          valid = false; message = 'Enter a valid email address.';
        }
        break;
      case 'tel':
        if (!/^[6-9]\d{9}$/.test(value.replace(/\s/g, ''))) {
          valid = false; message = 'Enter a valid 10-digit mobile number.';
        }
        break;
      case 'number':
        const num = parseInt(value);
        if (isNaN(num) || num < 1 || num > 120) {
          valid = false; message = 'Enter a valid age (1–120).';
        }
        break;
    }
  }

  setFieldState(field, valid, message);
  return valid;
}

function setFieldState(field, valid, message) {
  const group = field.closest('.form-group') || field.parentElement;
  const existing = group?.querySelector('.field-error');

  if (existing) existing.remove();

  if (!valid) {
    field.classList.add('invalid');
    field.classList.remove('valid');
    field.style.borderColor = '#E53E3E';
    field.style.boxShadow   = '0 0 0 4px rgba(229,62,62,0.1)';

    if (group) {
      const err = document.createElement('span');
      err.className = 'field-error';
      err.textContent = message;
      err.style.cssText = 'color:#E53E3E;font-size:0.75rem;margin-top:4px;display:block;font-family:var(--font-secondary)';
      group.appendChild(err);
    }
  } else {
    field.classList.remove('invalid');
    field.classList.add('valid');
    field.style.borderColor = 'var(--accent)';
    field.style.boxShadow   = '0 0 0 4px rgba(24,165,88,0.1)';
  }
}

function validateForm(form) {
  const fields = form.querySelectorAll('[required]');
  let allValid = true;

  fields.forEach(field => {
    if (!validateField(field)) allValid = false;
  });

  return allValid;
}

/* ─── Form Submission ────────────────────────────────────── */
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;

  if (!validateForm(form)) {
    window.Toast?.error('Please fill all required fields correctly.');
    return;
  }

  const submitBtn = form.querySelector('.form-submit');
  const originalText = submitBtn?.innerHTML;

  // Loading state
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
      Booking Appointment...
    `;
  }

  const data = {
    patient_name     : form.querySelector('#appt-name')?.value,
    phone            : form.querySelector('#appt-phone')?.value,
    email            : form.querySelector('#appt-email')?.value,
    age              : form.querySelector('#appt-age')?.value,
    gender           : form.querySelector('#appt-gender')?.value,
    department       : form.querySelector('#appt-department')?.value,
    doctor           : form.querySelector('#appt-doctor')?.value,
    appointment_date : form.querySelector('#appt-date')?.value,
    appointment_time : form.querySelector('#appt-time')?.value,
    problem          : form.querySelector('#appt-problem')?.value,
  };

  try {
    const { data: result, error } = await window.RMT_DB.submitAppointment(data);

    if (error) throw new Error(error.message || 'Submission failed');

    // Google Sheet + WhatsApp automation (Make.com) — fire and forget,
    // isse appointment booking fail nahi honi chahiye agar yeh error de.
    sendToMakeWebhook(data);

    // Success
    window.Toast?.success('🎉 Appointment booked successfully! We\'ll confirm within 2 hours.');
    form.reset();
    form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(f => {
      f.style.borderColor = '';
      f.style.boxShadow   = '';
      f.classList.remove('valid', 'invalid');
    });

    // Show success state
    showSuccessMessage(form, result);

  } catch (err) {
    console.error('[RMT] Appointment error:', err);
    window.Toast?.error('Something went wrong. Please try again or call us directly.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }
}

function showSuccessMessage(form, data) {
  const parent = form.closest('.appt-form-card') || form.parentElement;
  if (!parent) return;

  const successDiv = document.createElement('div');
  successDiv.style.cssText = `
    position: absolute; inset: 0; background: white; border-radius: inherit;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 2rem; text-align: center; z-index: 10; animation: fadeIn 0.4s ease;
  `;

  successDiv.innerHTML = `
    <div style="width:80px;height:80px;border-radius:50%;background:rgba(24,165,88,0.12);display:flex;align-items:center;justify-content:center;margin-bottom:1.5rem">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#18A558" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
    <h3 style="color:#0D1B2A;font-size:1.5rem;font-weight:800;margin-bottom:0.75rem">Appointment Booked!</h3>
    <p style="color:#4A5568;font-family:var(--font-secondary);line-height:1.8;margin-bottom:1.5rem;max-width:400px">
      Your appointment reference is <strong style="color:var(--primary)">#${data?.id?.slice(0, 8).toUpperCase() || 'RMT' + Date.now()}</strong>. 
      Our team will contact you shortly to confirm your appointment.
    </p>
    <button onclick="this.closest('[style]').remove();document.getElementById('appointment-form').style.display='block'" 
      style="background:var(--gradient-primary);color:white;border:none;padding:0.875rem 2rem;border-radius:9999px;font-weight:600;cursor:pointer;font-family:var(--font-primary)">
      Book Another Appointment
    </button>
  `;

  parent.style.position = 'relative';
  form.style.display = 'none';
  parent.appendChild(successDiv);
}
