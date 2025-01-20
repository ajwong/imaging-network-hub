import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold text-primary mb-6 animate-fade-in">
        Welcome to RadConnect
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-8 animate-fade-in">
        A professional community platform for radiologists and medical imaging specialists. 
        Share knowledge, collaborate on cases, and grow your network.
      </p>
      <div className="flex gap-4 animate-fade-in">
        <Link to="/feed">
          <Button size="lg" className="bg-primary hover:bg-primary-hover">
            Explore Feed
          </Button>
        </Link>
        <Link to="/cases">
          <Button size="lg" variant="outline">
            Browse Cases
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;