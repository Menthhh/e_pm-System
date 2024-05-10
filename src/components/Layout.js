import { useEffect, useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import HomeIcon from '@mui/icons-material/Home';
import { getSession } from "@/lib/utils/utils";
import { config } from "../config/config.js";
import Image from 'next/image';
import useFetchCards from "@/lib/hooks/useFetchCards";

const Layout = ({ children, className = "" }) => {
  const [refresh, setRefresh] = useState(false);
  const [menus, setMenus] = useState([]);
  const {cards, isLoading: cardsLoading} = useFetchCards(refresh);

  const updateMenus = () => {
    const menus = [
      {
        "name": <div className="flex justify-start items-center gap-2"><HomeIcon className="size-6" /> <p className="text-xl">Home</p></div>,
        "path": "/pages/dashboard"
      }
    ];
   
    menus.push(...cards.map((card) => {
      return {
        "name": <div className="flex justify-start items-center gap-3"><Image src={card.LOGO_PATH} width={24} height={24} style={{ filter: "invert(100%)", }}/> <p className="text-xl">{card.TITLE}</p></div>, 
        "path": card.LINK 
      };
  }));

    setMenus(menus); 
  };

  useEffect(() => {
    updateMenus();
  }, [cards]);

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
