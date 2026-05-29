/* NexCare — main script */

import { validateAppointment } from "./validation.js";
import {
  addAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointment,
  loadAppointments,
  isPersistenceAvailable,
} from "./appointments.js";

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
  "Saved on this device. Your request appears in the list below. " +
  "To confirm a booking, please call us at +254 724 699 077.";

const SUBMIT_LABEL_CREATE = "Request appointment";
const SUBMIT_LABEL_UPDATE = "Update request";

const LOCATION_LABELS = {
  eldoret: "Eldoret",
  nairobi: "Nairobi",
  mombasa: "Mombasa",
};

const REASON_MAX = 120;

const dateFormatter = new Intl.DateTimeFormat("en-KE", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

let editingId = null;

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
  success.focus();
}

function formatDate(value) {
  if (typeof value !== "string") return "";
  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return value;
  const [year, month, day] = parts;
  const d = new Date(year, month - 1, day);
  if (Number.isNaN(d.getTime())) return value;
  return dateFormatter.format(d);
}

function truncate(text, max) {
  if (typeof text !== "string") return "";
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + "…";
}

function buildItem(appointment) {
  const li = document.createElement("li");
  li.className = "appointment-item";
  li.dataset.id = appointment.id;

  const meta = document.createElement("div");
  meta.className = "appointment-item__meta";

  const dateEl = document.createElement("span");
  dateEl.className = "appointment-item__date";
  dateEl.textContent = formatDate(appointment.date);

  const timeEl = document.createElement("span");
  timeEl.className = "appointment-item__time";
  timeEl.textContent = appointment.time || "";

  meta.append(dateEl, timeEl);

  const details = document.createElement("div");
  details.className = "appointment-item__details";

  const nameEl = document.createElement("p");
  nameEl.className = "appointment-item__name";
  nameEl.textContent = appointment.fullName || "";

  const locEl = document.createElement("p");
  locEl.className = "appointment-item__location";
  locEl.textContent =
    LOCATION_LABELS[appointment.location] || appointment.location || "";

  const reasonEl = document.createElement("p");
  reasonEl.className = "appointment-item__reason";
  reasonEl.textContent = truncate(appointment.reason || "", REASON_MAX);

  details.append(nameEl, locEl, reasonEl);

  const actions = document.createElement("div");
  actions.className = "appointment-item__actions";

  const displayDate = formatDate(appointment.date);
  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "btn btn--ghost";
  editBtn.dataset.action = "edit";
  editBtn.textContent = "Edit";
  editBtn.setAttribute(
    "aria-label",
    `Edit request for ${appointment.fullName} on ${displayDate}`,
  );

  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.className = "btn btn--danger";
  delBtn.dataset.action = "delete";
  delBtn.textContent = "Delete";
  delBtn.setAttribute(
    "aria-label",
    `Delete request for ${appointment.fullName} on ${displayDate}`,
  );

  actions.append(editBtn, delBtn);

  li.append(meta, details, actions);
  return li;
}

function renderList() {
  const list = loadAppointments();
  const container = document.getElementById("appointment-list");
  const ul = document.getElementById("appointment-list-items");
  if (!container || !ul) return;
  ul.replaceChildren(...list.map(buildItem));
  container.hidden = list.length === 0;
}

function enterEditMode(id, form) {
  const appointment = getAppointment(id);
  if (!appointment) return;
  editingId = id;

  form.elements.namedItem("fullName").value = appointment.fullName || "";
  form.elements.namedItem("phone").value = appointment.phone || "";
  form.elements.namedItem("email").value = appointment.email || "";
  form.elements.namedItem("date").value = appointment.date || "";
  form.elements.namedItem("time").value = appointment.time || "";
  form.elements.namedItem("location").value = appointment.location || "";
  form.elements.namedItem("reason").value = appointment.reason || "";
  const consent = form.elements.namedItem("consent");
  if (consent instanceof HTMLInputElement) {
    consent.checked = Boolean(appointment.consent);
  }

  const submitBtn = document.getElementById("submit-button");
  if (submitBtn) submitBtn.textContent = SUBMIT_LABEL_UPDATE;
  const cancelBtn = document.getElementById("cancel-edit");
  if (cancelBtn) cancelBtn.hidden = false;

  form.scrollIntoView({ behavior: "smooth", block: "start" });
  const fullName = form.elements.namedItem("fullName");
  if (fullName instanceof HTMLElement) fullName.focus();
}

function exitEditMode(form) {
  editingId = null;
  form.reset();
  const submitBtn = document.getElementById("submit-button");
  if (submitBtn) submitBtn.textContent = SUBMIT_LABEL_CREATE;
  const cancelBtn = document.getElementById("cancel-edit");
  if (cancelBtn) cancelBtn.hidden = true;
  clearFormState(form);
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

  if (editingId) {
    updateAppointment(editingId, result.data);
    editingId = null;
    const submitBtn = document.getElementById("submit-button");
    if (submitBtn) submitBtn.textContent = SUBMIT_LABEL_CREATE;
    const cancelBtn = document.getElementById("cancel-edit");
    if (cancelBtn) cancelBtn.hidden = true;
  } else {
    addAppointment(result.data);
  }

  renderList();
  form.reset();
  showSuccess(form);
}

function handleListClick(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const button = target.closest("button[data-action]");
  if (!button) return;
  const item = button.closest(".appointment-item");
  if (!(item instanceof HTMLElement)) return;
  const id = item.dataset.id;
  if (!id) return;

  const form = document.getElementById("appointment-form");
  if (!(form instanceof HTMLFormElement)) return;

  const action = button.dataset.action;
  if (action === "edit") {
    enterEditMode(id, form);
  } else if (action === "delete") {
    const confirmed = window.confirm(
      "Delete this saved request? This cannot be undone.",
    );
    if (!confirmed) return;
    if (editingId === id) {
      exitEditMode(form);
    }
    deleteAppointment(id);
    renderList();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("appointment-form");
  if (!(form instanceof HTMLFormElement)) return;

  if (!isPersistenceAvailable()) {
    const warning = document.getElementById("storage-warning");
    if (warning) warning.hidden = false;
  }

  renderList();

  form.addEventListener("submit", handleSubmit);

  const listItems = document.getElementById("appointment-list-items");
  if (listItems) {
    listItems.addEventListener("click", handleListClick);
  }

  const cancelBtn = document.getElementById("cancel-edit");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => exitEditMode(form));
  }
});
