import Lottie from 'lottie-react';
import { Element } from 'react-scroll';
import Logo from '../assets/icons/corona-vaccine.json';
import { Separator } from './ui/separator';

const Footer = () => {
    return (
        <Element name="contact">
            <Separator className="mt-7" />
            <div className="md:mx-10">
                <div className="flex flex-col sm:grid grid-cols-[4fr_1fr] gap-14 my-10 text-sm">
                    <div>
                        <div className="relative w-56 h-40">
                            {/* Centered, smaller Lottie */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Lottie
                                    animationData={Logo}
                                    alt="logo"
                                    loop={true}
                                    autoplay={true}
                                    className="w-22 h-22"
                                />
                            </div>
                            <svg
                                viewBox="0 0 200 200"
                                className="absolute inset-0 w-full h-full pointer-events-none"
                            >
                                <defs>
                                    <path
                                        id="topArc"
                                        d="M10,100 a90,90 0 0,1 180,0"
                                    />
                                </defs>
                                <text
                                    className="uppercase text-xl font-semibold fill-current text-gray-800 tracking-[5px]"
                                    textAnchor="middle"
                                    dy="30" /* lift text further above the arc */
                                >
                                    <textPath href="#topArc" startOffset="51%">
                                        HEALTHCARE SYSTEM
                                    </textPath>
                                </text>
                            </svg>
                        </div>
                        <p className="mt-[-40px] w-full  text-gray-600 leading-6">
                            Lorem ipsum dolor sit amet, consectetur adipisicing
                            elit. Impedit, beatae facere ut libero, doloremque
                            dicta cumque repellat exercitationem iste fugiat,
                            placeat id voluptatem culpa consequatur rem quaerat.
                            Harum, fugit repudiandae.
                        </p>
                    </div>
                    <div className="mt-5">
                        <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
                        <ul className="flex flex-col gap-2 text-gray-600">
                            <li>+1 (234) 567-8900</li>
                            <li>loremipsum@mail.com</li>
                        </ul>
                    </div>
                </div>
            </div>
        </Element>
    );
};

export default Footer;
