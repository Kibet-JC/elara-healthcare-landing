/* Elara Healthcare — appointment form validation (pure functions, ES module). */

export function isRequired(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function normalizeKenyanPhone(value) {
  if (typeof value !== "string") return "";
  return value.replace(/[\s\-()]/g, "");
}

export function isValidKenyanPhone(value) {
  const normalized = normalizeKenyanPhone(value);
  return /^(?:\+?254|0)[17]\d{8}$/.test(normalized);
}

export function isValidEmail(value) {
  if (typeof value !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isFutureDate(value) {
  if (typeof value !== "string" || value.trim() === "") return false;
  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return false;
  const [year, month, day] = parts;
  const input = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return input.getTime() >= today.getTime();
}

export function validateAppointment(form) {
  const formData = new FormData(form);
  const data = {
    fullName: (formData.get("fullName") || "").toString().trim(),
    phone: (formData.get("phone") || "").toString().trim(),
    email: (formData.get("email") || "").toString().trim(),
    date: (formData.get("date") || "").toString(),
    time: (formData.get("time") || "").toString(),
    location: (formData.get("location") || "").toString(),
    reason: (formData.get("reason") || "").toString().trim(),
    consent: formData.get("consent") === "on" || formData.get("consent") === "true",
  };

  const errors = {};

  if (!isRequired(data.fullName)) {
    errors.fullName = "Please enter your full name.";
  }

  if (!isRequired(data.phone)) {
    errors.phone = "Please enter your phone number.";
  } else if (!isValidKenyanPhone(data.phone)) {
    errors.phone = "Enter a Kenyan number, e.g. 0712 345 678 or +254 712 345 678.";
  }

  if (data.email !== "" && !isValidEmail(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!isRequired(data.date)) {
    errors.date = "Choose a preferred date.";
  } else if (!isFutureDate(data.date)) {
    errors.date = "Choose today or a future date.";
  }

  if (!isRequired(data.time)) {
    errors.time = "Choose a preferred time.";
  }

  if (!isRequired(data.location) || data.location === "") {
    errors.location = "Choose a clinic location.";
  }

  if (!isRequired(data.reason)) {
    errors.reason = "Tell us briefly why you'd like to be seen.";
  } else if (data.reason.length > 500) {
    errors.reason = "Please keep this to 500 characters.";
  }

  if (!data.consent) {
    errors.consent = "Please confirm you've read the Privacy Notice.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data,
  };
}
