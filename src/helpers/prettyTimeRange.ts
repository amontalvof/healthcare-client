import { parse, format } from 'date-fns';

export const prettyTimeRange = (workStart: string, workEnd: string): string => {
    // parse accepts the incoming string, a format template, and a “base” date
    const startDate = parse(workStart, 'HH:mm:ss', new Date());
    const endDate = parse(workEnd, 'HH:mm:ss', new Date());

    // format them in 12-hour with am/pm – change the pattern to 'HH:mm' if you prefer 24h
    const prettyStart = format(startDate, 'hh:mm a'); // e.g. "09:00 AM"
    const prettyEnd = format(endDate, 'hh:mm a'); // e.g. "05:00 PM"

    return `${prettyStart} – ${prettyEnd}`;
};
