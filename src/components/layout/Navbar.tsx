"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Menu, UserRound, LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);

  const user = session?.user;

  async function handleLogout() {
    try {
      await authClient.signOut();
      toast.success("You have logged out");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Could not log out");
    }
  }

  const navLinks = (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => setOpen(false)}
          className={`text-sm font-medium transition hover:text-primary ${
            pathname === link.href
              ? "text-primary"
              : "text-muted-foreground"
          }`}
        >
          {link.label}
        </Link>
      ))}

      {user && (
        <>
          <Link href="/add-book" onClick={() => setOpen(false)}>
            Add Book
          </Link>
          <Link href="/my-books" onClick={() => setOpen(false)}>
            My Books
          </Link>
          <Link href="/my-borrows" onClick={() => setOpen(false)}>
            My Borrows
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="rounded-lg bg-primary p-2 text-white">
            <BookOpen size={23} />
          </span>
          <span className="font-serif text-2xl font-bold text-primary">
            BookNook
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isPending ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 rounded-full">
                  <UserRound size={17} />
                  {user.name || "My Account"}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2" size={16} />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-72">
              <div className="mt-10 flex flex-col gap-6">
                {navLinks}

                {user ? (
                  <>
                    <Link href="/profile">My Profile</Link>
                    <button
                      onClick={handleLogout}
                      className="text-left text-destructive"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login">Login</Link>
                    <Link href="/register">Register</Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
