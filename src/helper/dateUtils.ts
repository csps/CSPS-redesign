export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

export const formatTimeRange = (startTime: string, endTime: string): string => {
  if (!startTime || !endTime) return "";
  const to12Hour = (time: string): string => {
    let [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return `${to12Hour(startTime)} - ${to12Hour(endTime)}`;
};

export const parseEventDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};
