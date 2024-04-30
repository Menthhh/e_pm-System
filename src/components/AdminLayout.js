import Footer from "./Footer";
import Navbar from "./Navbar";

const AdminLayout = ({ children, className = "" }) => {
    const menus = [
        {
            "name": "Add User to Workgroup",
            "path": "/pages/admin/add-user-to-workgroup"
        }
    ];
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
          menu={menus}
      />
      <div className={`flex-1 ${className} pt-24 pb-24`}>
          {children}
      </div>
      <Footer />
</div>
  );
};

export default AdminLayout;
