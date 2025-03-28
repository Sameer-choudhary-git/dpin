"use client"
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
    SignOutButton
  } from '@clerk/nextjs'
  
export default function Appbar() {
    return(<div>
        <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
                <SignInButton />
                <SignUpButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
                <SignOutButton />
            </SignedIn>
        </header>
    </div>)
}
