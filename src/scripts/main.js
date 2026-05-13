/* NexCare — main script */

import { validateAppointment } from "./validation.js";

const FIELDS = [
  "fullName",
  "phone",
  "email",
  "date",
  "time",
  "location",
  "reason",
  "consent",
];

const SUCCESS_MESSAGE =
  "Thank you. Your appointment request has been received. " +
  "We will contact you within one working day to confirm.";

function clearFormState(form) {
  for (const name of FIELDS) {
    const input = form.elements.namedItem(name);
    if (input instanceof Element) {
      input.removeAttribute("aria-invalid");
    }
    const errorEl = form.querySelector(`#error-${name}`);
    if (errorEl) {
      errorEl.textContent = "";
    }
  }
  const success = form.querySelector(".form-success");
  if (success) {
    success.hidden = true;
    success.textContent = "";
  }
}

function renderErrors(form, errors) {
  let firstInvalid = null;
  for (const name of FIELDS) {
    const message = errors[name];
    if (!message) continue;
    const input = form.elements.namedItem(name);
    const errorEl = form.querySelector(`#error-${name}`);
    if (input instanceof Element) {
      input.setAttribute("aria-invalid", "true");
      if (!firstInvalid) firstInvalid = input;
    }
    if (errorEl) {
      errorEl.textContent = message;
    }
  }
  if (firstInvalid && typeof firstInvalid.focus === "function") {
    firstInvalid.focus();
  }
}

function showSuccess(form) {
  const success = form.querySelector(".form-success");
  if (!success) return;
  success.textContent = SUCCESS_MESSAGE;
  success.hidden = false;
  form.reset();
  success.focus();
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  clearFormState(form);
  const result = validateAppointment(form);
  if (!result.isValid) {
    renderErrors(form, result.errors);
    return;
  }
  showSuccess(form);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("appointment-form");
  if (!form) return;
  form.addEventListener("submit", handleSubmit);
});
