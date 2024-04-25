import Navbar from "./Navbar";

const AdminLayout = ({ children, className = "" }) => {
    const menus = [
        {
            "name": "Add User to Workgroup",
            "path": "/pages/admin/add-user-to-workgroup"
        }
    ];
  return (
    <div className={className}>
      <Navbar 
      menu = {menus}
      />
      {children}
    </div>
  );
};

export default AdminLayout;
