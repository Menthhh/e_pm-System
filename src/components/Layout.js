import { useEffect, useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import HomeIcon from '@mui/icons-material/Home';
import { getSession } from "@/lib/utils/utils";
import nextConfig from "../../next.config.mjs";

const Layout = ({ children, className = "" }) => {
  const [menus, setMenus] = useState([]);
  const [cards, setCards] = useState([]);
  const [session, setSession] = useState({});

  useEffect(() => {
    fetchSession();
  }, []); 

  useEffect(() => {
    updateMenus();
  }, [cards]); 

  const fetchSession = async () => {
    const session = await getSession();
    
    setSession(session);
    await fetchCard(session.user_id);
  };

  const fetchCard = async (user_id) => {
    
    try {
      const response = await fetch(
        `${nextConfig.host}/api/user/get-card-from-user/${user_id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }
      const data = await response.json();
      console.log(data)
      
      setCards(data.cards);
    } catch (error) {
      console.error(error);
    }
  };

  const updateMenus = () => {
    const menus = [
      {
        "name": <div className="flex justify-start items-center gap-2"><HomeIcon className="size-6" /> <p className="text-xl">Home</p></div>,
        "path": "/pages/dashboard"
      }
    ];
   
    menus.push(...cards.map((card) => {
      return {
        "name": card.TITLE, 
        "path": card.LINK 
      };
  }));

    setMenus(menus); 
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar menu={menus} />
      <div className={`flex-1 ${className} pt-24 pb-24`}>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
