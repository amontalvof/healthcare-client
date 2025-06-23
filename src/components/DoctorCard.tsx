import React from 'react';
import { animateScroll as scroll } from 'react-scroll';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthDialog, useAuthCredentials } from '@/zustand/auth';
import resolveUserInfo from '@/helpers/resolveUserInfo';

interface DoctorCardProps {
    id: number;
    name: string;
    specialty: string;
    availability: string;
    imageUrl?: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
    id,
    name,
    specialty,
    availability,
    imageUrl,
}) => {
    const navigate = useNavigate();
    const setAuthDialogOpen = useAuthDialog((state) => state.setAuthDialogOpen);
    const accessToken = useAuthCredentials((state) => state.accessToken);
    const user = resolveUserInfo(accessToken);

    const handleBookAppointment = () => {
        if (user) {
            navigate(`/appointments/${id}`);
            scroll.scrollToTop({
                duration: 1,
                smooth: true,
            });
        } else {
            setAuthDialogOpen(true);
        }
    };

    return (
        <Card className="w-64 aspect-square bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-center">
            <CardHeader className="flex items-center space-x-4">
                <Avatar className="w-16 h-16 bg-[#B2C2DC]">
                    <AvatarImage src={imageUrl} alt={`${name}'s photo`} />
                    <AvatarFallback>
                        {name.split(' ')[0][0]}
                        {name.split(' ')[1]?.[0]}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-lg font-semibold">
                        {name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                        {specialty}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
                <div className="flex items-center text-sm text-gray-600 space-x-2">
                    <Clock3 className="w-4 h-4 text-primary" />
                    <span>{availability}</span>
                </div>
            </CardContent>
            <CardFooter className="pt-0">
                <Button
                    className="w-full cursor-pointer"
                    onClick={handleBookAppointment}
                >
                    Book Appointment
                </Button>
            </CardFooter>
        </Card>
    );
};

export default DoctorCard;
