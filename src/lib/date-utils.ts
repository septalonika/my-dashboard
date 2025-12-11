import { format, formatDistanceToNow } from "date-fns";

export const safeFormat = (dateString: string, formatStr: string) => {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "—" : format(date, formatStr);
  } catch {
    return "—";
  }
};

export const safeDistance = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "—"
      : formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "—";
  }
};
