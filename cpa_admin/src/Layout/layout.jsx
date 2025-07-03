import { Header } from "../Component/Header/header";
import { Outlet } from "react-router-dom";
import SideBar from "../Component/Sidebar/sidebar";
import { useState } from "react";

export const Layout = () => {
  const [open, isOpen] = useState(false);
  function toggleButton() {
    isOpen((open) => !open);
  }

  return (
    <div>
      <Header  />
      <div className="flex">
        <SideBar />
        <Outlet context={open} />
      </div>
      {/* <Footer /> */}
    </div>
  );
};
