import { ArrowRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-scroll';
import groupProfiles from '../assets/images/group_profiles.png';
import headerImage from '../assets/images/header_img.png';

const Header = () => {
    return (
        <div
            className={twMerge(
                'flex flex-col md:flex-row flex-wrap rounded-lg px-6 md:px-10 lg:px-20',
                `bg-[#B2C2DC]`
            )}
        >
            <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]">
                <p className="text-3xl md:text-4xl lg:text-5xl  font-semibold leading-tight md:leading-tight lg:leading-tight">
                    Book Appointment <br /> With Trusted Doctors
                </p>
                <div className="flex flex-col md:flex-row items-center gap-3  text-sm font-normal">
                    <img
                        className="w-28"
                        src={groupProfiles}
                        alt="group profiles"
                    />
                    <p>
                        Take a look at our list of trusted doctors and quickly
                        book an appointment online with just a few simple
                        clicks.
                    </p>
                </div>
                <Link to="specialty" smooth={true} duration={500}>
                    <Button className="cursor-pointer hover:scale-105 transition-all duration-300">
                        Book Appointment <ArrowRight />
                    </Button>
                </Link>
            </div>
            <div className="md:w-1/2 relative">
                <img
                    className="md:w-[100%] 2xl:w-[80%] md:absolute bottom-0 h-auto rounded-lg"
                    src={headerImage}
                    alt="header"
                />
            </div>
        </div>
    );
};

export default Header;
