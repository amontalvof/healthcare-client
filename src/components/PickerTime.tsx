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
    /** Time labels to disable in the dropdown */
    disabledTimes?: string[];
}

const PickerTime = ({ disabledTimes = [] }: PickerTimeProps) => {
    const [time, setTime] = useState<string>('');
    const handleTimeChange = (value: string) => setTime(value);
    const isTimeDisabled = (label: string) => disabledTimes.includes(label);

    const times: string[] = [];
    for (let hour = 9; hour <= 17; hour++) {
        for (let minute of [0, 30]) {
            if (hour === 17 && minute > 0) continue;
            const dt = new Date();
            dt.setHours(hour, minute, 0, 0);
            times.push(format(dt, 'h:mm a')); // e.g. "9:00 AM"
        }
    }

    return (
        <div className="w-[200px]">
            <Select value={time} onValueChange={handleTimeChange}>
                <SelectTrigger className="w-full border border-gray-400 cursor-pointer">
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
