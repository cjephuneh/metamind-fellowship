
import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";
import { GraduationCap, Building2, Wallet, BookOpen } from "lucide-react";

export function MainNavigation() {
  const location = useLocation();
  const { isConnected, user } = useWallet();
  
  return (
    <div className="flex justify-between items-center py-4">
      <Link to="/" className="text-2xl font-bold text-purple-600">
        EduLink
      </Link>
      
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <NavigationMenuTrigger>Scholarships</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-500 to-purple-900 p-6 no-underline outline-none focus:shadow-md"
                      to="/dashboard"
                    >
                      <BookOpen className="h-6 w-6 text-white" />
                      <div className="mt-4 mb-2 text-lg font-medium text-white">
                        Scholarships
                      </div>
                      <p className="text-sm leading-tight text-white/90">
                        Explore available scholarships and funding opportunities for students.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                
                <ListItem href="/smart-contracts" title="Smart Contracts" icon={<Building2 className="h-4 w-4 mr-2" />}>
                  Browse blockchain-powered scholarship contracts
                </ListItem>
                
                {user?.type === "student" && (
                  <ListItem href="/dashboard" title="My Applications" icon={<GraduationCap className="h-4 w-4 mr-2" />}>
                    Track your scholarship applications and progress
                  </ListItem>
                )}
                
                {user?.type === "sponsor" && (
                  <ListItem href="/dashboard" title="My Scholarships" icon={<Wallet className="h-4 w-4 mr-2" />}>
                    Manage the scholarships you've created
                  </ListItem>
                )}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          
          <NavigationMenuItem>
            <Link to="/smart-contracts">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Smart Contracts
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      
      <div className="flex items-center space-x-4">
        {isConnected ? (
          <Link to="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        ) : (
          <>
            <Link to="/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/connect">
              <Button>Connect Wallet</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

interface ListItemProps {
  title: string;
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const ListItem = ({ title, href, children, icon }: ListItemProps) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          )}
        >
          <div className="flex items-center text-sm font-medium leading-none">
            {icon}
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

export default MainNavigation;
