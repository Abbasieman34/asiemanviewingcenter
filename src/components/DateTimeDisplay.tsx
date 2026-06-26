import { Calendar, Clock } from "lucide-react";

interface DateTimeDisplayProps {
  date: string;
  time: string;
  className?: string;
}

const DateTimeDisplay = ({ date, time, className = "" }: DateTimeDisplayProps) => {
  return (
    <div className={`flex items-center gap-4 text-sm text-muted-foreground ${className}`}>
      <span className="flex items-center gap-1">
        <Calendar className="h-3.5 w-3.5 text-primary" />
        {date}
      </span>
      <span className="flex items-center gap-1">
        <Clock className="h-3.5 w-3.5 text-primary" />
        {time}
      </span>
    </div>
  );
};

export default DateTimeDisplay;
