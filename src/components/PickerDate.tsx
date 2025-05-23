import { useState, FC } from 'react';
import { format, isSameDay } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface PickerDateProps {
    /** Dates to disable in the calendar */
    disabledDates?: Date[];
    buttonClassName?: string;
}

const PickerDate: FC<PickerDateProps> = ({
    buttonClassName,
    disabledDates = [],
}) => {
    const [date, setDate] = useState<Date>();

    const isDateDisabled = (d: Date) => {
        const day = d.getDay(); // 0 = Sunday, 6 = Saturday
        return (
            day === 0 ||
            day === 6 ||
            disabledDates.some((dd) => isSameDay(dd, d))
        );
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                        'justify-start text-left font-normal cursor-pointer bg-white',
                        !date && 'text-muted-foreground',
                        buttonClassName
                    )}
                >
                    <CalendarIcon />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={isDateDisabled}
                />
            </PopoverContent>
        </Popover>
    );
};

export default PickerDate;
