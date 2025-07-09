import { Info, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import doctorFallback from '../assets/images/doctor.webp';
import { Button } from '@/components/ui/button';
import { PickerDate, PickerTime } from '@/components';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchWithoutToken, fetchWithToken } from '@/helpers/fetch';
import { useQueries } from '@tanstack/react-query';
import { IDoctor } from '@/types/Doctor';
import { HospitalMap } from '@/components/HospitalMap';
import { useState } from 'react';
import { useAuthCredentials } from '@/context/auth';
import { resolveUserInfo } from '@/helpers';

import { ConditionalTooltip } from '@/components/ConditionalTooltip';

const resolveTooltipText = (
    isSelectedDate: boolean,
    isSelectedTime: boolean,
    hasPatientProfile: boolean
) => {
    if (!isSelectedDate) {
        return 'Please select a date first';
    }
    if (!isSelectedTime) {
        return 'Please select a time first';
    }
    if (!hasPatientProfile) {
        return 'Please complete your patient profile to book an appointment';
    }
    return '';
};

const Appointment = () => {
    const { docId } = useParams<{ docId: string }>();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedTime, setSelectedTime] = useState<string>('');
    const accessToken = useAuthCredentials((state) => state.accessToken);
    const user = resolveUserInfo(accessToken);

    const [{ data: doctors = [], isLoading }, { data: patient }] = useQueries({
        queries: [
            {
                queryKey: ['doctors'],
                queryFn: () => fetchWithoutToken('/doctor'),
                staleTime: Infinity,
                gcTime: Infinity,
            },
            {
                queryKey: ['patient', user?._id],
                enabled: !!user?._id,
                queryFn: () => fetchWithToken(`/patient/${user?._id}`),
            },
        ],
    });

    const handleSelectDate = (date?: Date) => {
        setSelectedDate(date);
    };

    const handleSelectTime = (value: string) => setSelectedTime(value);

    const docInfo: IDoctor = doctors.find(
        (doc: IDoctor) => doc.id === Number(docId)
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-gray-50 px-4">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 max-w-sm text-center space-y-6">
                    <p className="text-lg font-semibold">Loading...</p>
                </div>
            </div>
        );
    }

    if (!docInfo) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-gray-50 px-4">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 max-w-sm text-center space-y-6">
                    <XCircle className="mx-auto h-12 w-12 " />
                    <h2 className="text-2xl font-semibold ">
                        Doctor Not Found
                    </h2>
                    <Button
                        className="w-full cursor-pointer"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-4">
                <div>
                    <img
                        className="w-full sm:max-w-72 rounded-lg border-2 border-[#B2C2DC] bg-[#B2C2DC]"
                        src={docInfo.imageUrl ?? doctorFallback}
                        alt="doctor"
                        width={150}
                    />
                </div>
                <div className="flex-1 border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sx:mx-0 sm:mt-0 shadow-xl">
                    <p className="text-2xl font-medium text-gray-900">
                        {docInfo.fullName}
                    </p>
                    <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
                        <p>
                            {docInfo.degree} - {docInfo.specialty.name}
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
                    <p className="text-gray-500 font-medium mt-2">
                        Appointment fee:{' '}
                        <span className="text-gray-600 font-semibold">
                            {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                            }).format(docInfo.fees)}
                        </span>
                    </p>
                    <p className="text-gray-500 font-medium mt-2">
                        Hospital:{' '}
                        <span className="text-gray-600 font-semibold">
                            {docInfo.hospital}
                        </span>
                    </p>
                    <p className="text-gray-500 font-medium mt-2">
                        Insurances accepted:{' '}
                        <span className="text-gray-600 font-semibold">
                            {docInfo.insurancesList
                                .map((insurance) => insurance.name)
                                .join(', ') || 'None'}
                        </span>
                    </p>
                </div>
            </div>
            <div className="sm:ml-74 sm:pl-4 mt-10 flex flex-wrap gap-4">
                <PickerDate
                    selectedDate={selectedDate}
                    onSelectDate={handleSelectDate}
                    disableWeekends={true}
                    amountOfDaysToEnable={21}
                    buttonClassName="w-full sm:w-[200px]"
                    disabledDates={[new Date(2025, 3, 29)]}
                />
                <ConditionalTooltip
                    enabled={!selectedDate}
                    content={<span>Please select a date first</span>}
                >
                    <PickerTime
                        disabled={!selectedDate}
                        selectedTime={selectedTime}
                        onSelectTime={handleSelectTime}
                        className="w-full sm:w-[200px]"
                        disabledTimes={['12:00 PM']}
                    />
                </ConditionalTooltip>
                <ConditionalTooltip
                    enabled={!selectedDate || !selectedTime || !patient}
                    content={
                        <span>
                            {resolveTooltipText(
                                !!selectedDate,
                                !!selectedTime,
                                !!patient
                            )}
                        </span>
                    }
                >
                    <Button
                        className="w-full sm:w-[200px] cursor-pointer"
                        disabled={!selectedDate || !selectedTime || !patient}
                    >
                        Book Appointment
                    </Button>
                </ConditionalTooltip>
            </div>
            <div className="mt-10 h-[500px]">
                <HospitalMap
                    hospitalsNames={[docInfo.hospital]}
                    hospitals={[docInfo.hospitalAddress]}
                />
            </div>
        </div>
    );
};

export default Appointment;
