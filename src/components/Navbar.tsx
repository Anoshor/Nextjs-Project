'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';

function Navbar() {
  const { data: session } = useSession();
  const user: User | undefined = session?.user;

  return (
    <nav className="p-4 md:p-6 shadow-md bg-blue-500 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          ANON FEEDBACK
        </a>
        {session ? (
          <>
            <span className="mr-4">
              Welcome, {user?.username || user?.email}
            </span>
            <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
              Logout
            </Button>
          </>
        ) : (
          <div className="flex flex-col md:flex-row">
            <Link href="/sign-in">
              <Button className="w-full md:w-auto bg-slate-100 text-black mb-2 md:mb-0 md:mr-2" variant='outline'>
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
