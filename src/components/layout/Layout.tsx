import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="h-full max-w-[1600px] mx-auto px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};