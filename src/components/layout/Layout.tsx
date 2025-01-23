import { Navbar } from "./Navbar";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="h-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};