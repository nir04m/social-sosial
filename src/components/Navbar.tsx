import Link from 'next/dist/client/link'
import React, { use } from 'react'
import DesktopNavbar from './DesktopNavbar'
import MobileNavbar from './MobileNavbar'
import { currentUser } from '@clerk/nextjs/server';
import { syncUser } from '@/actions/user.action';

async function Navbar() {
  const user = await currentUser(); // Fetch the user data
  if (user) await syncUser();
  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-4'>
                <Link href='/' className='text-xl font-bold text-primary font-mono tracking-wider'>
                    Sosial App
                </Link>
            </div>
            <DesktopNavbar />
            <MobileNavbar />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
