import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto pt-20 px-4">
        <Outlet />
      </main>
    </div>
  );
};