import { Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import doctorFallback from '../assets/images/doctor.webp';
import { Button } from '@/components/ui/button';
import { PickerDate, PickerTime } from '@/components';

const docInfo = {
    name: 'Dr. John Doe',
    specialty: 'Cardiologist',
    degree: 'MD',
    experience: '10 years',
    fee: 150,
    about: 'Dr. John Doe is a highly experienced cardiologist with over 10 years of experience in treating heart-related conditions. He is known for his patient-centric approach and has received numerous accolades for his work in the field of cardiology.',
};

const Appointment = () => {
    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-4">
                <div>
                    <img
                        className="w-full sm:max-w-72 rounded-lg border-2 border-gray-300"
                        src={doctorFallback}
                        alt="doctor"
                        width={150}
                    />
                </div>
                <div className="flex-1 border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sx:mx-0 mt-[-80px] sm:mt-0 shadow-xl">
                    <p className="text-2xl font-medium text-gray-900">
                        {docInfo.name}
                    </p>
                    <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                        <p>
                            {docInfo.degree} - {docInfo.specialty}
                        </p>
                        <Badge variant="secondary">{docInfo.experience}</Badge>
                    </div>
                    <div>
                        <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                            About <Info size={15} />
                        </p>
                        <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                            {docInfo.about}
                        </p>
                    </div>
                    <p className="text-gray-500 font-medium mt-4">
                        Appointment fee:{' '}
                        <span className="text-gray-600 font-semibold">
                            {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            }).format(docInfo.fee)}
                        </span>
                    </p>
                </div>
            </div>
            <div className="sm:ml-74 sm:pl-4 mt-10 flex flex-wrap gap-4">
                <PickerDate disabledDates={[new Date(2025, 3, 29)]} />
                <PickerTime disabledTimes={['12:00 PM', '12:30 PM']} />
                <Button className="w-[200px] cursor-pointer">
                    Book Appointment
                </Button>
            </div>
        </div>
    );
};

export default Appointment;
