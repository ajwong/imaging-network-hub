import { Link, useNavigate } from "react-router-dom";
import { Bell, MessageSquare, Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-muted">
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              RadConnect
            </Link>
            <div className="hidden md:flex items-center ml-10 space-x-8">
              <Link to="/feed" className="text-foreground/80 hover:text-foreground">Feed</Link>
              <Link to="/cases" className="text-foreground/80 hover:text-foreground">Cases</Link>
              <Link to="/network" className="text-foreground/80 hover:text-foreground">Network</Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-foreground">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-foreground">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Link to="/profile">
              <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-foreground">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="text-foreground/80 hover:text-foreground" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};