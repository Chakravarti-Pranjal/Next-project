export const formatDate = (data) => {
  // Check if the input is falsy or not a valid date
  if (!data || isNaN(new Date(data).getTime())) {
    return "";
  }

  // If the input is valid, format the date
  const date = new Date(data);
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

  return formattedDate;
};

export const formatTime = (timeString) => {
  // Check if the input is a valid time string
  if (!timeString || !/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
    return "";
  }

  // Extract hours, minutes, and seconds
  const [hours, minutes, seconds] = timeString.split(":").map(Number);

  // Create a Date object with local time
  const date = new Date();
  date.setHours(hours, minutes, seconds, 0);

  // Format the time to hour and minute
  const formattedTime = new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Use false for 24-hour format if needed
  }).format(date);

  return formattedTime;
};