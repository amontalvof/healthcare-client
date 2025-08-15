import { DoctorCard } from '@/components';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { fetchWithoutToken, prettyTimeRange } from '@/helpers';
import { IDoctor, IDoctorSpecialty } from '@/types/Doctor';
import { useQueries } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

const Doctors = () => {
    const { specialty = 'all' } = useParams();
    const navigate = useNavigate();

    const [{ data: specialtyData = [] }, { data: doctors = [] }] = useQueries({
        queries: [
            {
                queryKey: ['specialties'],
                queryFn: () => fetchWithoutToken('/doctor/specialties'),
                staleTime: Infinity,
                gcTime: Infinity,
            },
            {
                queryKey: ['doctors'],
                queryFn: () => fetchWithoutToken('/doctor'),
                staleTime: Infinity,
                gcTime: Infinity,
            },
        ],
    });

    const handleRadioGroupChange = (value: string) => {
        const newValue = value === 'all' ? '' : `/${value}`;
        navigate(`/doctors${newValue}`);
    };

    const filteredDoctors =
        specialty === 'all'
            ? doctors
            : doctors.filter(
                  (item: IDoctor) => item.specialty.route === specialty
              );

    return (
        <div className="ml-5 sm:ml-0">
            <p className="text-lg">Browse through the doctors</p>
            <div className="flex flex-col  sm:flex-row sm:justify-between">
                <div className="my-4 mr-[100px]">
                    <RadioGroup
                        value={specialty}
                        onValueChange={handleRadioGroupChange}
                    >
                        <div className="flex items-center space-x-2" key="all">
                            <RadioGroupItem
                                value="all"
                                id="all"
                                className="border border-gray-400 cursor-pointer"
                            />
                            <Label htmlFor="all" className="cursor-pointer">
                                All Doctors
                            </Label>
                        </div>
                        {specialtyData.map((item: IDoctorSpecialty) => {
                            const keyIndex = `${item.name}-${item.id}`;
                            return (
                                <div
                                    className="flex items-center space-x-2 "
                                    key={keyIndex}
                                >
                                    <RadioGroupItem
                                        value={item.route}
                                        id={item.route}
                                        className="border border-gray-400 cursor-pointer"
                                    />
                                    <Label
                                        htmlFor={item.route}
                                        className="cursor-pointer"
                                    >
                                        {item.name}
                                    </Label>
                                </div>
                            );
                        })}
                    </RadioGroup>
                </div>
                <div className="w-full flex flex-wrap gap-4 mt-4">
                    {filteredDoctors.map((doctor: IDoctor) => {
                        return (
                            <DoctorCard
                                key={doctor.id}
                                id={doctor.id}
                                name={doctor.fullName}
                                specialty={doctor.specialty.name}
                                availability={prettyTimeRange(
                                    doctor.workStart,
                                    doctor.workEnd
                                )}
                                imageUrl={doctor.imageUrl}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Doctors;
