import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const Sidebar = () => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isTrendingOpen, setIsTrendingOpen] = useState(true);

  return (
    <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
      <Card className="h-full border-0 rounded-none shadow-none bg-transparent">
        <ScrollArea className="h-full">
          <div className="space-y-2">
            <Collapsible open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
              <div className="flex items-center justify-between px-2 py-2 hover:bg-accent/50 cursor-pointer">
                <h3 className="text-xs font-medium tracking-wider">CATEGORIES</h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ChevronDown 
                      className="h-3 w-3 transition-transform" 
                      style={{ transform: isCategoriesOpen ? "rotate(180deg)" : "rotate(0deg)" }} 
                    />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <nav className="flex flex-col">
                  <Button variant="ghost" className="justify-start rounded-none h-8 px-2 font-normal hover:bg-accent/50">
                    All Posts
                  </Button>
                  <Button variant="ghost" className="justify-start rounded-none h-8 px-2 font-normal hover:bg-accent/50">
                    Clinical Cases
                  </Button>
                  <Button variant="ghost" className="justify-start rounded-none h-8 px-2 font-normal hover:bg-accent/50">
                    Research
                  </Button>
                  <Button variant="ghost" className="justify-start rounded-none h-8 px-2 font-normal hover:bg-accent/50">
                    Discussion
                  </Button>
                </nav>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={isTrendingOpen} onOpenChange={setIsTrendingOpen}>
              <div className="flex items-center justify-between px-2 py-2 hover:bg-accent/50 cursor-pointer">
                <h3 className="text-xs font-medium tracking-wider">TRENDING</h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ChevronDown 
                      className="h-3 w-3 transition-transform" 
                      style={{ transform: isTrendingOpen ? "rotate(180deg)" : "rotate(0deg)" }} 
                    />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="space-y-2 px-2 py-1">
                  <div className="flex items-center space-x-2 hover:bg-accent/50 p-1 rounded-sm cursor-pointer">
                    <div className="h-2 w-2 bg-blue-500 rounded-full" />
                    <span className="text-sm">Radiology AI Updates</span>
                  </div>
                  <div className="flex items-center space-x-2 hover:bg-accent/50 p-1 rounded-sm cursor-pointer">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <span className="text-sm">New Treatment Protocols</span>
                  </div>
                  <div className="flex items-center space-x-2 hover:bg-accent/50 p-1 rounded-sm cursor-pointer">
                    <div className="h-2 w-2 bg-purple-500 rounded-full" />
                    <span className="text-sm">Medical Technology</span>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};