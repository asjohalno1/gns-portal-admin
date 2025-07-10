import { Header } from "../Component/Header/header";
import { Outlet } from "react-router-dom";
import SideBar from "../Component/Sidebar/sidebar";
import { useState } from "react";

export const Layout = () => {
  const [open, isOpen] = useState(true);
  function toggleButton() {
    isOpen((open) => !open);
  }

  return (
    <div>
      <SideBar />
      <div
        className={`min-h-screen flex  md:ml-auto ${
          open ? " md:w-[calc(100%-256px)] w-[100%]" : "close-sidebar w-[100%]"
        }`}
      >
        <Header toggleButton={toggleButton} />
        <Outlet context={open} />
      </div>
      {/* <Footer /> */}
    </div>
  );
};
