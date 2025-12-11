import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";

interface NavbarProps {
  onAuthClick?: (mode: 'login' | 'register') => void;
}

export default function Navbar({ onAuthClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-red-500">RentalHaven</h1>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/properties" className="text-gray-600 hover:text-red-500 px-3 py-2 text-sm font-medium"
                onClick={e => {
                  e.preventDefault();
                  if (window.location.pathname === "/properties") {
                    window.location.reload();
                  } else {
                    navigate("/properties");
                  }
                }}
              >
                Browse Properties
              </Link>
              {user?.role === 'owner' && (
                <Link href="/dashboard" className="text-gray-600 hover:text-red-500 px-3 py-2 text-sm font-medium">
                  List Your Property
                </Link>
              )}
              <Link href="/help-center" className="text-gray-600 hover:text-red-500 px-3 py-2 text-sm font-medium">
                Help
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="hidden sm:block">
                      {user ? (user.firstName ? `${user.firstName} ${user.lastName}` : user.email) : 'Guest'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="flex items-center">
                    {(() => {
                      // Wrap logout to redirect after
                      const handleLogout = () => {
                        logout();
                        navigate("/");
                      };
                      return (
                        <span onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Log Out
                        </span>
                      );
                    })()}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  onClick={() => onAuthClick?.('register')}
                  className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition duration-200"
                >
                  Sign Up
                </Button>
                <Button
                  onClick={() => onAuthClick?.('login')}
                  variant="ghost"
                  className="text-gray-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition duration-200"
                >
                  Log In
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
