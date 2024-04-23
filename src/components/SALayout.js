import Navbar from "@/components/Navbar"; 

const SALayout = ({ children, className="" }) => {
    return (
        <div >
            <Navbar /> 
            <div className={className}>
            {children}  
            </div>     
        </div>
    );
} 

export default SALayout;
