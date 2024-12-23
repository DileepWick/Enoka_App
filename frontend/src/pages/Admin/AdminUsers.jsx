import React from "react";
import {Header} from "@/components/Admin/Components/HeaderAdmin";
import {Sidebar} from "@/components/Admin/Components/SidebarAdmin";
import UserManagement from "@/components/Admin/UserManagement";

const AdminUsers = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Header />
        <div className="p-4">
          <UserManagement />
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
