import { Info, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import doctorFallback from '../assets/images/doctor.webp';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import { IDoctor } from '@/types/Doctor';
import { useState } from 'react';
import { useAuthCredentials } from '@/context/auth';
import { Textarea } from '@/components/ui/textarea';
import {
    HospitalMap,
    ConditionalTooltip,
    PickerDate,
    PickerTime,
} from '@/components';
import {
    fetchWithoutToken,
    fetchWithToken,
    formatDate,
    formatStartAndEndTime,
    resolveUserInfo,
} from '@/helpers';

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
    const [reason, setReason] = useState<string>('');
    const accessToken = useAuthCredentials((state) => state.accessToken);
    const user = resolveUserInfo(accessToken);

    const { mutate } = useMutation({
        mutationKey: ['bookAppointment'],
        mutationFn: async (appointmentData: {
            doctorId: number;
            patientId: number;
            date: string;
            status: string;
            startTime: string;
            endTime: string;
            reason: string;
        }) => {
            const response = await fetchWithToken(
                '/appointment',
                appointmentData,
                'POST'
            );
            return response;
        },
        onSuccess: () => {
            setSelectedDate(undefined);
            setSelectedTime('');
            setReason('');
            setTimeout(() => {
                navigate('/appointments');
                toast.success('Appointment booked successfully!');
            }, 3000);
        },
        onError: () => {
            setSelectedDate(undefined);
            setSelectedTime('');
            setReason('');
            toast.error('An error occurred while booking the appointment.');
        },
    });

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

    const { data: bookedHours = [], isLoading: isLoadingBookedHours } =
        useQuery({
            queryKey: ['booked-hours', docId, selectedDate],
            queryFn: () =>
                fetchWithToken(
                    `/appointment/booked-hours/${docId}?date=${formatDate(
                        selectedDate
                    )}`
                ),
            enabled: !!docId && !!selectedDate,
            staleTime: Infinity,
            gcTime: Infinity,
        });

    const disabledTimes = bookedHours?.map(
        (item: { startTime: string }) => item.startTime
    );

    const handleSelectDate = (date?: Date) => {
        setSelectedDate(date);
    };

    const handleSelectTime = (value: string) => setSelectedTime(value);

    const handleBookAppointment = () => {
        const { startTime, endTime } = formatStartAndEndTime(selectedTime);
        const date = formatDate(selectedDate);
        mutate({
            doctorId: Number(docId),
            patientId: Number(patient.id),
            status: 'SCHEDULED',
            date,
            startTime,
            endTime,
            reason,
        });
    };

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
            <div className="mt-10 flex flex-wrap gap-4">
                <PickerDate
                    selectedDate={selectedDate}
                    onSelectDate={handleSelectDate}
                    disableWeekends={true}
                    amountOfDaysToEnable={21}
                    buttonClassName="w-full sm:w-[300px]"
                    disabledDates={[new Date(2025, 3, 29)]}
                />
                <ConditionalTooltip
                    enabled={!selectedDate}
                    content={<span>Please select a date first</span>}
                    className="w-full sm:w-[300px]"
                >
                    <PickerTime
                        disabled={!selectedDate || isLoadingBookedHours}
                        selectedTime={selectedTime}
                        onSelectTime={handleSelectTime}
                        disabledTimes={['12:00:00', ...disabledTimes]}
                        className="w-full sm:w-[300px]"
                    />
                </ConditionalTooltip>
                <Textarea
                    className="w-full sm:w-[35%] bg-white border-gray-400 h-9"
                    placeholder="Add reason (optional)"
                    rows={1}
                    style={{ minHeight: '36px', maxHeight: '120px' }}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
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
                    className="w-full sm:w-[200px]"
                >
                    <Button
                        className={'w-full sm:w-[200px] cursor-pointer'}
                        disabled={!selectedDate || !selectedTime || !patient}
                        onClick={handleBookAppointment}
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
