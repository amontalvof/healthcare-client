import { useState } from 'react';
import { Link as RouterLink } from 'react-router';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';
import Lottie from 'lottie-react';
import Logo from '../assets/icons/corona-vaccine.json';
import { Menu } from 'lucide-react';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from './ui/navigation-menu';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

import { twMerge } from 'tailwind-merge';
import RenderIf from './RenderIf';
import AuthDialog from './AuthDialog';

// const user = {
//     name: 'John Doe',
//     image: 'https://randomuser.me/api/portraits/men/64.jpg',
// };

const user: any = null;

const Navbar = () => {
    const [open, setOpen] = useState(false);

    const handleCloseSheet = () => {
        setOpen(false);
    };

    const handleScroll = () => {
        handleCloseSheet();
        scroll.scrollToTop({
            duration: 1,
            smooth: true,
        });
    };
    return (
        <div className="flex items-center justify-between sm:justify-around text-sm py-1 mb-5 border-b border-gray-300 sticky top-0 z-50 bg-white w-full">
            <div className="block sm:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger>
                        <Menu className="mx-5" />
                    </SheetTrigger>
                    <SheetContent side="left">
                        <SheetHeader>
                            <NavMenu
                                handleScroll={handleScroll}
                                handleCloseSheet={handleCloseSheet}
                            />
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
            <RouterLink
                to="/"
                className="w-[50px] h-[50px] cursor-pointer p-0 border-0 bg-transparent hidden sm:block"
                aria-label="Play animation"
            >
                <Lottie
                    animationData={Logo}
                    alt="logo"
                    loop={true}
                    autoplay={true}
                />
            </RouterLink>
            <NavMenu
                handleScroll={handleScroll}
                handleCloseSheet={handleCloseSheet}
                className="hidden sm:block"
            />
            <div>
                <RenderIf
                    ifTrue={!user}
                    ifChild={<AuthDialog />}
                    elseChild={
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center focus:outline-none">
                                    <Avatar className="h-8 w-8 cursor-pointer mx-5 sm:mx-0">
                                        <AvatarImage
                                            src={user?.image}
                                            alt={user?.name}
                                        />
                                        <AvatarFallback>
                                            {user?.name?.[0] ?? 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56"
                                align="end"
                                forceMount
                            >
                                <DropdownMenuLabel>
                                    {user?.name}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <RouterLink to="/profile">
                                    <DropdownMenuItem className="cursor-pointer">
                                        My Profile
                                    </DropdownMenuItem>
                                </RouterLink>
                                <RouterLink to="/billing">
                                    <DropdownMenuItem className="cursor-pointer">
                                        Billing
                                    </DropdownMenuItem>
                                </RouterLink>
                                <DropdownMenuItem
                                    onSelect={() => {}}
                                    className="cursor-pointer"
                                >
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    }
                />
            </div>
        </div>
    );
};

const NavMenu = ({
    handleScroll,
    handleCloseSheet,
    className,
}: {
    handleScroll: () => void;
    handleCloseSheet: () => void;
    className?: string;
}) => {
    return (
        <NavigationMenu className={className}>
            <NavigationMenuList className="flex flex-col w-48 space-y-2 sm:flex-row sm:w-0 sm:space-y-0">
                <NavigationMenuItem
                    className="hover:shadow-md rounded-md"
                    onClick={handleScroll}
                >
                    <RouterLink to="/" className={navigationMenuTriggerStyle()}>
                        HOME
                    </RouterLink>
                </NavigationMenuItem>
                <NavigationMenuItem
                    className="hover:shadow-md rounded-md"
                    onClick={handleScroll}
                >
                    <RouterLink
                        to="/doctors"
                        className={navigationMenuTriggerStyle()}
                    >
                        ALL DOCTORS
                    </RouterLink>
                </NavigationMenuItem>
                <NavigationMenuItem
                    className="hover:shadow-md rounded-md"
                    onClick={handleScroll}
                >
                    <RouterLink
                        to="/appointments"
                        className={navigationMenuTriggerStyle()}
                    >
                        MY APPOINTMENTS
                    </RouterLink>
                </NavigationMenuItem>
                <NavigationMenuItem className="hover:shadow-md rounded-md">
                    <ScrollLink
                        to="contact"
                        smooth={true}
                        duration={500}
                        className={twMerge(
                            navigationMenuTriggerStyle(),
                            'cursor-pointer'
                        )}
                        onClick={handleCloseSheet}
                    >
                        CONTACT
                    </ScrollLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};

export default Navbar;
