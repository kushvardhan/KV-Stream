import React, { useState, useRef, useEffect } from 'react';

const DropDown = ({ title, options, func }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(title);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative ml-6 text-sm font-semibold">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="bg-[#393841] text-zinc-300 px-3 py-1 rounded-md flex items-center gap-2 hover:bg-[#6556CD] hover:text-white transition duration-300"
            >
                {selected} <i className="ri-arrow-down-s-line"></i>
            </button>

            {isOpen && (
                <ul className="absolute left-0 mt-2 w-32 bg-[#2D2B37] rounded-md shadow-lg z-10 text-xs">
                    {options.map((option, i) => (
                        <li 
                            key={i} 
                            onClick={() => { 
                                setSelected(option); 
                                func(option);
                                setIsOpen(false);
                            }} 
                            className="px-3 py-1 text-zinc-300 hover:bg-[#6556CD] hover:text-white cursor-pointer transition duration-300"
                        >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DropDown;
