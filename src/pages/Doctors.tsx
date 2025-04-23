import { DoctorCard } from '@/components';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { specialtyData } from '@/constants';
import { useNavigate, useParams } from 'react-router';

const Doctors = () => {
    const { specialty = 'all' } = useParams();
    const navigate = useNavigate();

    const handleRadioGroupChange = (value: string) => {
        const newValue = value === 'all' ? '' : `/${value}`;
        navigate(`/doctors${newValue}`);
    };

    const array = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Doctor ${i + 1}`,
        specialty: [
            'general-physician',
            'gynecologist',
            'dermatologist',
            'pediatricians',
            'neurologist',
            'gastroenterologist',
        ][Math.floor(Math.random() * 6)],
        availability: 'Mon–Fri: 9am–5pm',
        imageUrl: `https://randomuser.me/api/portraits/men/${i}.jpg`,
    }));

    const filteredDoctors =
        specialty === 'all'
            ? array
            : array.filter((item) => item.specialty === specialty);

    return (
        <div>
            <p className="text-lg">Browse through the doctors</p>
            <div className="flex justify-between">
                <div className="mt-4 mr-[100px]">
                    <RadioGroup
                        value={specialty}
                        onValueChange={handleRadioGroupChange}
                    >
                        <div className="flex items-center space-x-2" key="all">
                            <RadioGroupItem
                                value="all"
                                id="all"
                                className="border border-gray-500"
                            />
                            <Label htmlFor="all">All Doctors</Label>
                        </div>
                        {specialtyData.map((item, index) => {
                            const keyIndex = `${item.specialty}-${index}`;
                            return (
                                <div
                                    className="flex items-center space-x-2"
                                    key={keyIndex}
                                >
                                    <RadioGroupItem
                                        value={item.route}
                                        id={item.route}
                                        className="border border-gray-500"
                                    />
                                    <Label htmlFor={item.route}>
                                        {item.specialty}
                                    </Label>
                                </div>
                            );
                        })}
                    </RadioGroup>
                </div>
                <div className="w-full flex flex-wrap gap-4 mt-4">
                    {filteredDoctors.map((doctor) => {
                        return (
                            <DoctorCard
                                key={doctor.id}
                                id={doctor.id}
                                name={doctor.name}
                                specialty={doctor.specialty}
                                availability={doctor.availability}
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
