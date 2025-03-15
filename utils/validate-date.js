import logMessage from "./log-message.js";

const isValidDate = (dateStr) => !isNaN(new Date(dateStr));

export default async function validateDates(departDateFrom, departDateTo) {
  if (!isValidDate(departDateFrom) || !isValidDate(departDateTo)) {
    logMessage("One or both dates are invalid.");
    return false;
  }

  if (new Date(departDateFrom) > new Date(departDateTo)) {
    logMessage("Start date cannot be later than end date.");
    return false;
  }

  return true;
}
