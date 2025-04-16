import { useRef } from 'react';
import { Link } from 'react-router';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import Logo from '../assets/icons/online-health-report.json';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
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
import RenderIf from './RenderIf';

const user = {
    name: 'John Doe',
    image: 'https://randomuser.me/api/portraits/men/64.jpg',
};

const Navbar = () => {
    const lottieRef = useRef<LottieRefCurrentProps | null>(null);

    const handlePlay = () => {
        lottieRef.current?.play();
    };

    const handleStop = () => {
        lottieRef.current?.stop();
    };
    return (
        <div className="flex items-center justify-between text-sm py-1 mb-5 border-b border-gray-300 ">
            <Link
                to="/"
                className="w-[50px] h-[50px] cursor-pointer p-0 border-0 bg-transparent"
                onMouseEnter={handlePlay}
                onMouseLeave={handleStop}
                aria-label="Play animation"
            >
                <Lottie
                    lottieRef={lottieRef}
                    animationData={Logo}
                    alt="logo"
                    autoplay={false}
                />
            </Link>
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <Link to="/">
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                            >
                                HOME
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link to="/doctors">
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                            >
                                ALL DOCTORS
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link to="/about">
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                            >
                                ABOUT
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <Link to="/contact">
                            <NavigationMenuLink
                                className={navigationMenuTriggerStyle()}
                            >
                                CONTACT
                            </NavigationMenuLink>
                        </Link>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
            <div>
                <RenderIf
                    ifTrue={!user}
                    ifChild={
                        <Button className="cursor-pointer">
                            Create Account
                        </Button>
                    }
                    elseChild={
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center focus:outline-none">
                                    <Avatar className="h-8 w-8 cursor-pointer">
                                        <AvatarImage
                                            src={user.image}
                                            alt={user.name}
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
                                    {user.name}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link to="/profile">
                                    <DropdownMenuItem className="cursor-pointer">
                                        My Profile
                                    </DropdownMenuItem>
                                </Link>
                                <Link to="/appointments">
                                    <DropdownMenuItem className="cursor-pointer">
                                        My appointments
                                    </DropdownMenuItem>
                                </Link>
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
