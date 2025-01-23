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
        <ScrollArea className="h-full px-2">
          <div className="space-y-2">
            <Collapsible open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
              <div className="flex items-center justify-between py-2 hover:bg-muted/50 cursor-pointer rounded-md px-2">
                <h3 className="text-xs font-medium tracking-wider text-foreground/70">CATEGORIES</h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-transparent">
                    <ChevronDown 
                      className="h-3 w-3 transition-transform text-foreground/70" 
                      style={{ transform: isCategoriesOpen ? "rotate(180deg)" : "rotate(0deg)" }} 
                    />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <nav className="flex flex-col space-y-1">
                  <Button variant="ghost" className="justify-start rounded-md h-8 px-2 font-normal hover:bg-muted/50 text-foreground/80">
                    All Posts
                  </Button>
                  <Button variant="ghost" className="justify-start rounded-md h-8 px-2 font-normal hover:bg-muted/50 text-foreground/80">
                    Clinical Cases
                  </Button>
                  <Button variant="ghost" className="justify-start rounded-md h-8 px-2 font-normal hover:bg-muted/50 text-foreground/80">
                    Research
                  </Button>
                  <Button variant="ghost" className="justify-start rounded-md h-8 px-2 font-normal hover:bg-muted/50 text-foreground/80">
                    Discussion
                  </Button>
                </nav>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={isTrendingOpen} onOpenChange={setIsTrendingOpen}>
              <div className="flex items-center justify-between py-2 hover:bg-muted/50 cursor-pointer rounded-md px-2">
                <h3 className="text-xs font-medium tracking-wider text-foreground/70">TRENDING</h3>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-transparent">
                    <ChevronDown 
                      className="h-3 w-3 transition-transform text-foreground/70" 
                      style={{ transform: isTrendingOpen ? "rotate(180deg)" : "rotate(0deg)" }} 
                    />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="space-y-1 px-2">
                  <div className="flex items-center space-x-2 hover:bg-muted/50 p-2 rounded-md cursor-pointer">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    <span className="text-sm text-foreground/80">Radiology AI Updates</span>
                  </div>
                  <div className="flex items-center space-x-2 hover:bg-muted/50 p-2 rounded-md cursor-pointer">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    <span className="text-sm text-foreground/80">New Treatment Protocols</span>
                  </div>
                  <div className="flex items-center space-x-2 hover:bg-muted/50 p-2 rounded-md cursor-pointer">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    <span className="text-sm text-foreground/80">Medical Technology</span>
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