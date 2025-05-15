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
    for (let hour = 8; hour <= 17; hour++) {
        if (hour === 17) {
            continue;
        }
        const dt = new Date();
        dt.setHours(hour, 0, 0, 0);
        times.push(format(dt, 'h:mm a'));
    }

    return (
        <div className="w-[200px]">
            <Select value={time} onValueChange={handleTimeChange}>
                <SelectTrigger className="w-full cursor-pointer bg-white">
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
