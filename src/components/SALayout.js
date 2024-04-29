import Navbar from "@/components/Navbar";

const SALayout = ({ children, className = "" }) => {
    const menus = [
        {
            "name": "Create Role",
            "path": "/pages/SA/create-role"
        },
        {
            "name": "Create Workgroup",
            "path": "/pages/SA/create-workgroup"
        }
    ];
    return (
        <div >
            <Navbar
                menu={menus}
            />

            <div className={` ${className} `}>
                {children}
            </div>

        </div>
    );
}

export default SALayout;
