import { TypeAnimation } from 'react-type-animation';
import { IconButton } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import Link from 'next/link';

const Navbar = () => {

    return (
        <nav className="w-full h-auto p-4 bg-blue-500 flex justify-between items-center shadow-lg text-white font-bold">
            <TypeAnimation 
                sequence={[
                    'e_pm',
                    5000,
                    "",
                    5000,
                ]}
                wrapper="span"
                speed={50}
                style={{ fontSize: '2em', display: 'inline-block' }}
                repeat={Infinity}
            />
            <IconButton color="inherit">
                <Link href="/pages/login">
                    <ExitToApp />
                </Link>
            </IconButton>
        </nav>
    );
}

export default Navbar;
