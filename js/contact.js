/* ============================================================
   CONTACT.JS — Contact form validation & Supabase submission
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', initContactForm);

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Real-time validation
  form.querySelectorAll('.form-input, .form-textarea').forEach(field => {
    field.addEventListener('blur', () => contactValidateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) contactValidateField(field);
    });
  });

  form.addEventListener('submit', handleContactSubmit);
}

function contactValidateField(field) {
  const value = field.value.trim();
  const required = field.hasAttribute('required');
  let valid = true;
  let message = '';

  if (required && !value) {
    valid = false;
    message = 'This field is required.';
  } else if (value) {
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      valid = false; message = 'Enter a valid email address.';
    }
    if (field.type === 'tel' && !/^[6-9]\d{9}$/.test(value.replace(/\s/g, ''))) {
      valid = false; message = 'Enter a valid 10-digit mobile number.';
    }
  }

  const group = field.closest('.form-group') || field.parentElement;
  const existing = group?.querySelector('.field-error');
  if (existing) existing.remove();

  if (!valid) {
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
    field.style.borderColor = 'var(--accent)';
    field.style.boxShadow   = '0 0 0 4px rgba(24,165,88,0.1)';
  }

  return valid;
}

async function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;

  const fields = form.querySelectorAll('[required]');
  let allValid = true;
  fields.forEach(f => { if (!contactValidateField(f)) allValid = false; });

  if (!allValid) {
    window.Toast?.error('Please fill all required fields correctly.');
    return;
  }

  const submitBtn = form.querySelector('.form-submit');
  const originalHTML = submitBtn?.innerHTML;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
      Sending Message...
    `;
  }

  const data = {
    name    : form.querySelector('#contact-name')?.value,
    email   : form.querySelector('#contact-email')?.value,
    phone   : form.querySelector('#contact-phone')?.value,
    message : form.querySelector('#contact-message')?.value
  };

  try {
    const { error } = await window.RMT_DB.submitContactMessage(data);
    if (error) throw new Error(error.message);

    window.Toast?.success('Message sent successfully! We\'ll respond within 24 hours.');
    form.reset();
    form.querySelectorAll('.form-input, .form-textarea').forEach(f => {
      f.style.borderColor = '';
      f.style.boxShadow   = '';
    });
  } catch (err) {
    console.error('[RMT] Contact error:', err);
    window.Toast?.error('Failed to send message. Please try again or call us.');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
    }
  }
}
