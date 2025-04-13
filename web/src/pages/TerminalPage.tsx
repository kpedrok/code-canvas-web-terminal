
import React from "react";
import { Terminal } from "@/components/Terminal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Terminal as TerminalIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function TerminalPage() {
  return (
    <div className="h-screen flex flex-col">
      <div className="bg-muted/10 border-b border-border p-4 flex items-center">
        <Link to="/dashboard">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center">
          <TerminalIcon className="h-5 w-5 text-primary mr-2" />
          <h1 className="text-xl font-semibold">Terminal</h1>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <Terminal />
      </div>
    </div>
  );
}

export default TerminalPage;
