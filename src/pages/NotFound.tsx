import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { TerminalLayout } from "@/components/terminal/TerminalLayout";
import { TopNavbar } from "@/components/terminal/TopNavbar";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <TerminalLayout>
      <TopNavbar />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-6">
          <div className="bg-card border border-border p-8 font-mono">
            <h1 className="text-6xl font-normal text-foreground terminal-text mb-4">404</h1>
            <p className="text-xl text-muted-foreground mb-6 font-normal">MISSION NOT FOUND</p>
            <p className="text-sm text-muted-foreground mb-6 font-normal">
              The requested operation path does not exist in our system.
            </p>
            <Button asChild className="bg-foreground text-background hover:bg-foreground/90 font-normal">
              <a href="/" className="flex items-center gap-2">
                <Home size={16} />
                RETURN TO MISSION CONTROL
              </a>
            </Button>
          </div>
        </div>
      </div>
    </TerminalLayout>
  );
};

export default NotFound;
