export const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getFollowUpDateString = (date) => {
  if (!date) {
    return "";
  }

  return String(date).slice(0, 10);
};

export const formatFollowUpDate = (date) => {
  const dateString = getFollowUpDateString(date);

  if (!dateString) {
    return "No date set";
  }

  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getFollowUpStatus = (application, todayString) => {
  const date = getFollowUpDateString(application.followUpDate);

  if (date < todayString) {
    return {
      label: "Overdue",
      classes: "bg-rose-100 text-rose-700",
    };
  }

  if (date === todayString) {
    return {
      label: "Due today",
      classes: "bg-amber-100 text-amber-800",
    };
  }

  return {
    label: "Upcoming",
    classes: "bg-blue-100 text-blue-700",
  };
};
