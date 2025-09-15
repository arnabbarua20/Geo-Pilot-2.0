import { Link, useLocation } from "wouter";
import { Plane, Plus, Map, LogOut, User, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const [location] = useLocation();
  const { user, logout, signInWithGoogle, authAvailable } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 z-50 relative">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <Plane className="text-primary text-xl" />
          <h1 className="text-xl font-semibold text-neutral">Drone Zone Manager</h1>
          <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">NZ</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <nav className="flex items-center space-x-1">
            <Link href="/">
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 ${
                  location === "/" 
                    ? "bg-primary text-white hover:bg-blue-700" 
                    : "bg-gray-100 text-neutral hover:bg-gray-200"
                }`}
              >
                <Map className="w-4 h-4" />
                Map View
              </button>
            </Link>
            <Link href="/report">
              <button 
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 ${
                  location === "/report" 
                    ? "bg-primary text-white hover:bg-blue-700" 
                    : "bg-gray-100 text-neutral hover:bg-gray-200"
                }`}
              >
                <Plus className="w-4 h-4" />
                Report Zone
              </button>
            </Link>
          </nav>

          {/* User Authentication */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || ""} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.displayName || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : authAvailable ? (
            <Button 
              onClick={signInWithGoogle}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign in with Google
            </Button>
          ) : (
            <div className="text-sm text-gray-500">
              <span className="px-2 py-1 bg-gray-100 rounded text-xs">View Only</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
