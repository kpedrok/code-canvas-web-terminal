
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Code, Terminal, Lock, Layout } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";

const Index = () => {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1">
        {/* Hero section */}
        <section className="py-20 px-4 text-center">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              Modern Python Code Execution Platform
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Write, run, and test your Python code directly in the browser with our powerful online IDE
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {isAuthenticated ? (
                <Button size="lg" asChild>
                  <Link to="/dashboard">My Projects</Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link to="/register">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Code Editor</h3>
                <p className="text-muted-foreground">
                  Powerful editor with syntax highlighting and code completion for Python
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Terminal className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Integrated Terminal</h3>
                <p className="text-muted-foreground">
                  Execute commands and see real-time output directly in the browser
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg border border-border">
                <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">User Authentication</h3>
                <p className="text-muted-foreground">
                  Secure access to your projects and code from any device
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 CodeCanvas. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
