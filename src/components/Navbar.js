import { TypeAnimation } from 'react-type-animation';


const Navbar = () => {
    return (
        <nav className="w-full h-auto p-4 bg-gray-500 flex gap-5 -z-10">
            <TypeAnimation
                sequence={[
                    // Same substring at the start will only be typed out once, initially
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
        </nav>
    );
}

export default Navbar;
