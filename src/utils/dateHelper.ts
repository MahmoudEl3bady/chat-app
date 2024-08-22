
import { Timestamp } from "firebase/firestore";
import { format, formatDistanceToNow } from "date-fns";

export function formatTimestamp(timestamp: Timestamp | null): string {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  return format(date, "MMM d, h:mm a");
}

export function formatRelativeTime(timestamp: Timestamp | null): string {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  return formatDistanceToNow(date, { addSuffix: true });
}

export function isSameDay(
  timestamp1: Timestamp,
  timestamp2: Timestamp
): boolean {
  const date1 = timestamp1.toDate();
  const date2 = timestamp2.toDate();
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export const chatLastMessageTime = (time:Timestamp)=>{
    if(isSameDay(time,Timestamp.now())){
        return `today at${formatTimestamp(time).split(',')[1]}`;
    }else{
        return formatTimestamp(time);
    }
}

export function messageCreatedAt(date: any): any {
  let dateObject: Date;

  if (date instanceof Timestamp) {
    dateObject = date.toDate();
  } else if (date && date.seconds && date.nanoseconds) {
    dateObject = new Timestamp(date.seconds, date.nanoseconds).toDate();
  } else if (date instanceof Date) {
    dateObject = date;
  } else if (typeof date === "string" || typeof date === "number") {
    dateObject = new Date(date);
  } else {
    return null;
  }
  return format(dateObject, "h:mm a");
}

export const userLastSeen = (time:Timestamp)=>{
    return formatRelativeTime(time);
}