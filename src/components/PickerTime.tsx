import { twMerge } from 'tailwind-merge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Clock3Icon } from 'lucide-react';

interface PickerTimeProps {
    selectedTime: string;
    onSelectTime: (value: string) => void;
    disabledTimes?: string[];
    className?: string;
    disabled?: boolean;
}

const PickerTime = ({
    selectedTime,
    onSelectTime,
    className,
    disabledTimes = [],
    disabled = false,
}: PickerTimeProps) => {
    const isTimeDisabled = (label: string) => disabledTimes.includes(label);

    // timeOptions: value as 'HH:mm:00', label as 'h:mm a'
    const timeOptions: { value: string; label: string }[] = [];
    for (let hour = 8; hour < 17; hour++) {
        const dt = new Date();
        dt.setHours(hour, 0, 0, 0);
        timeOptions.push({
            value: format(dt, 'HH:mm:ss'),
            label: format(dt, 'h:mm a'),
        });
    }

    return (
        <div className={twMerge('w-full', className)}>
            <Select
                value={selectedTime}
                onValueChange={onSelectTime}
                disabled={disabled}
            >
                <SelectTrigger
                    className={twMerge(
                        'w-full cursor-pointer bg-white border-gray-400',
                        className
                    )}
                >
                    <SelectValue
                        placeholder={
                            <p className="flex items-center gap-2 text-sm font-normal text-gray-500">
                                <Clock3Icon />
                                Pick a time
                            </p>
                        }
                    />
                </SelectTrigger>
                <SelectContent>
                    {timeOptions.map(({ value, label }) => (
                        <SelectItem
                            key={value}
                            value={value}
                            disabled={isTimeDisabled(value)}
                            className="cursor-pointer"
                        >
                            {label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default PickerTime;
