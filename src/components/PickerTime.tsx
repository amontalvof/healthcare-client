import { useState } from 'react';
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

    const times: string[] = [];
    for (let hour = 8; hour <= 17; hour++) {
        if (hour === 17) {
            continue;
        }
        const dt = new Date();
        dt.setHours(hour, 0, 0, 0);
        times.push(format(dt, 'h:mm a'));
    }

    return (
        <div className={className}>
            <Select
                value={selectedTime}
                onValueChange={onSelectTime}
                disabled={disabled}
            >
                <SelectTrigger className="w-full cursor-pointer bg-white border-gray-400">
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
                    {times.map((label) => (
                        <SelectItem
                            key={label}
                            value={label}
                            disabled={isTimeDisabled(label)}
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
