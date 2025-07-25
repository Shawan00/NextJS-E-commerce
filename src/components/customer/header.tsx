"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Logo from "./logo";
import { Search, ShoppingCart, User, LogIn, UserPlus, Bell, History, LogOut } from "lucide-react";
import { getAvatarFallback } from "@/helper/general";
import MenuHeader from "./menu-header";


interface CustomerData {
  id: string;
  fullName: string;
  avatar: string;
  email: string;
  phone: string | null;
  address: string | null;
}

export default function Header() {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);

  useEffect(() => {
    // Kiểm tra cookie customer
    const checkCustomerCookie = async () => {
      try {
        const response = await fetch('/api/get-cookie/customer');
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          if (data) {
            // Parse customer data từ cookie
            const parsedData = JSON.parse(data);
            setCustomerData(parsedData);
          }
        }
      } catch (error) {
        console.error('Error checking customer cookie:', error);
      }
    };

    checkCustomerCookie();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCustomerData(null);
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <header className="bg-background shadow-sm mx-auto px-6 py-4
        flex items-center justify-between relative z-10"
      >
        <Logo />
        <MenuHeader />

        <div className="flex items-center gap-4">
          <Link href={"/"} className="text-muted-foreground hover:text-foreground">
            <Search />
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground focus:outline-none">
                <User />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {customerData ? (
                <>
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={customerData.avatar} alt={customerData.fullName} />
                      <AvatarFallback>
                        {getAvatarFallback(customerData.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{customerData.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {customerData.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/me/profile/${customerData.id}`} className="cursor-pointer flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled className="cursor-not-allowed flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span>Notification</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                    <History className="h-4 w-4" />
                    <span>Order History</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="cursor-pointer flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      <span>Login</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register" className="cursor-pointer flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      <span>Register</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href={"/"} className="text-muted-foreground hover:text-foreground">
            <ShoppingCart />
          </Link>
        </div>
      </header>
    </>
  )
}
