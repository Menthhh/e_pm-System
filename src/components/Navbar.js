import { IconButton } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import Link from 'next/link';
import { useState } from 'react';

const Navbar = ({ menu }) => {
   
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const closeMenu = () => {
        setShowMenu(false);
    };

    return (
        <nav className="w-full h-16 p-4 bg-blue-500 flex justify-between items-center shadow-lg text-white font-bold relative">
            <div className="flex flex-col gap-2 cursor-pointer" onClick={toggleMenu}>
                <div className={`bg-white w-8 h-0.5 ${showMenu ? 'rotate-45' : ''}`}></div>
                <div className={`bg-white w-8 h-0.5 ${showMenu ? 'opacity-0' : ''}`}></div>
                <div className={`bg-white w-8 h-0.5 ${showMenu ? '-rotate-45' : ''}`}></div>
            </div>
            <div className={`bg-blue-400 h-screen z-50 left-0 top-0 absolute w-1/4 shadow-lg transition-transform duration-300 ${showMenu ? 'translate-x-0' : '-translate-x-full'}`}>
                <button className="absolute top-4 right-4" onClick={closeMenu}>
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <ul className="mt-10 text-white">
                    {menu.map((item, index) => (
                        <li className="mb-4" key={index}>
                            <Link href={item.path} className="block px-4 py-2 hover:bg-blue-600">
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <IconButton color="inherit" className="flex gap-3 font-medium text-sm">
                <p className="text-sm">Tonkla Pokaew</p>
                <Link href="/pages/login">
                    <ExitToApp />
                </Link>
            </IconButton>
        </nav>
    );
}

export default Navbar;
