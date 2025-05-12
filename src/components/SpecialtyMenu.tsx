import { Element, animateScroll as scroll } from 'react-scroll';
import { specialtyData } from '@/constants';
import { Link } from 'react-router';

const SpecialtyMenu = () => {
    return (
        <Element name="specialty">
            <div className="flex flex-col items-center gap-4 py-16 text-gray-800">
                <h1 className="text-3xl font-medium">Find by Specialty</h1>
                <div className="flex flex-wrap sm:justify-center gap-4 pt-5 w-full overflow-scroll">
                    {specialtyData.map((item, index) => {
                        const keyIndex = `${item.route}-${index}`;
                        return (
                            <Link
                                className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
                                to={`/doctors/${item.route}`}
                                onClick={() =>
                                    scroll.scrollToTop({
                                        duration: 500,
                                        smooth: true,
                                    })
                                }
                                key={keyIndex}
                            >
                                <div className="flex flex-col items-center w-[100px]">
                                    <img
                                        className="w-16 sm:w-24 mb-2"
                                        src={item.image}
                                        alt={item.specialty}
                                    />
                                    <p>{item.specialty}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </Element>
    );
};

export default SpecialtyMenu;
