const castTimeFormat = (value) => {
  return value < 10 ? String(value).padStart(2, `0`) : String(value);
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

