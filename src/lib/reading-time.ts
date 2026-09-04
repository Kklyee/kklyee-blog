import getReadingTime from "reading-time";

export function readingMinutes(body: string) {
  return Math.max(1, Math.ceil(getReadingTime(body).minutes));
}
