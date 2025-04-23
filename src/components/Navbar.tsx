import { Link as RouterLink } from 'react-router';
import { Link as ScrollLink } from 'react-scroll';
import Lottie from 'lottie-react';
import Logo from '../assets/icons/corona-vaccine.json';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from './ui/navigation-menu';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

import { twMerge } from 'tailwind-merge';
import RenderIf from './RenderIf';

const user = {
    name: 'John Doe',
    image: 'https://randomuser.me/api/portraits/men/64.jpg',
};

const Navbar = () => {
    return (
        <div className="flex items-center justify-around text-sm py-1 mb-5 border-b border-gray-300 sticky top-0 z-50 bg-white w-full">
            <RouterLink
                to="/"
                className="w-[50px] h-[50px] cursor-pointer p-0 border-0 bg-transparent"
                aria-label="Play animation"
            >
                <Lottie
                    animationData={Logo}
                    alt="logo"
                    loop={true}
                    autoplay={true}
                />
            </RouterLink>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem className="hover:shadow-md rounded-md">
                        <RouterLink
                            to="/"
                            className={navigationMenuTriggerStyle()}
                        >
                            HOME
                        </RouterLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="hover:shadow-md rounded-md">
                        <RouterLink
                            to="/doctors"
                            className={navigationMenuTriggerStyle()}
                        >
                            ALL DOCTORS
                        </RouterLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem className="hover:shadow-md rounded-md">
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
                        >
                            CONTACT
                        </ScrollLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <div>
                <RenderIf
                    ifTrue={!user}
                    ifChild={
                        <Button className="cursor-pointer">
                            Register/Login
                        </Button>
                    }
                    elseChild={
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center focus:outline-none">
                                    <Avatar className="h-8 w-8 cursor-pointer">
                                        <AvatarImage
                                            src={user?.image}
                                            alt={user?.name}
                                        />
                                        <AvatarFallback>
                                            {user?.name?.[0] || 'U'}
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

export default Navbar;
