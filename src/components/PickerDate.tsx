import { FC } from 'react';
import {
    addDays,
    format,
    isAfter,
    isBefore,
    isSameDay,
    startOfDay,
} from 'date-fns';
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
    selectedDate?: Date;
    onSelectDate: (date?: Date) => void;
    disabledDates?: Date[];
    buttonClassName?: string;
    disableWeekends?: boolean;
    amountOfDaysToEnable?: number;
    disabled?: boolean;
}

const PickerDate: FC<PickerDateProps> = ({
    selectedDate,
    onSelectDate,
    buttonClassName,
    disableWeekends = false,
    disabled = false,
    amountOfDaysToEnable,
    disabledDates = [],
}) => {
    const today = startOfDay(new Date());
    const lastActiveDay = addDays(today, amountOfDaysToEnable ?? 30);

    const isDateDisabled = (d: Date) => {
        const day = d.getDay(); // 0 = Sunday, 6 = Saturday
        const isDisableWeekends = disableWeekends && (day === 0 || day === 6);
        const isEnableOnlyThirtyDays =
            !!amountOfDaysToEnable &&
            (isBefore(d, today) || isAfter(d, lastActiveDay));
        return (
            isDisableWeekends ||
            isEnableOnlyThirtyDays ||
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
                        !selectedDate && 'text-muted-foreground',
                        buttonClassName
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon />
                    {selectedDate ? (
                        format(selectedDate, 'PPP')
                    ) : (
                        <span>Pick a date</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={onSelectDate}
                    initialFocus
                    disabled={isDateDisabled}
                />
            </PopoverContent>
        </Popover>
    );
};

export default PickerDate;
