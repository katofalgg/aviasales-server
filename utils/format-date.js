export default function formatDate(dateStr) {
  const date = new Date(dateStr);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "long",
  };

  return date.toLocaleString("ru-RU", options);
}
