"use client";

import { PlaceholdersAndVanishInput } from "../../components/ui/placeholders-and-vanish-input";
import VideoPlayer from "../../components/ui/video-player";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../../components/ui/navbar-menu";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div>
      <div className="h-[40rem] flex flex-col justify-center items-center px-4 pt-4 -mt-10">
        <PlaceholdersAndVanishInputDemo />
      </div>
      <div className="mt-16">
        <VideoPlayer />
      </div>
      <div className="mt-16">
        <NavbarDemo />
    </div>
  </div>
  );
}


export function PlaceholdersAndVanishInputDemo() {
  const placeholders = [
    "What's the integral of sin^x?",
    "Show pi on a graph?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input changed:", e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector("input")?.value;
    if (input) {
      try {
        const response = await fetch('/api/ask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: input }),
        });

        const data = await response.json();
        console.log('Response from serverless function:', data);
      } catch (error) {
        console.error('Error sending data:', error);
      }
    }
  };
  
  return (
    <div className="h-[40rem] flex flex-col justify-center items-center px-4">
      <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-white">
        Ask Motion Mind Anything.
      </h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export function NavbarDemo() {
  return (
       <div className="relative w-full flex items-center justify-center">
         <Navbar className="top-2" />
         <p className="text-black dark:text-white">
         </p>
       </div>
     );
   }
  
   function Navbar({ className }: { className?: string }) {
     const [active, setActive] = useState<string | null>(null);
     return (
       <div
         className={cn("fixed top-4 inset-x-0 max-w-xs mx-auto z-50 h-10", className)}
       >
         <Menu setActive={setActive}>
           <MenuItem setActive={setActive} active={active} item="Get Started">
             <div className="flex flex-col space-y-2 text-sm p-2">
               <HoveredLink href="/web-dev">Get Started</HoveredLink>
               <HoveredLink href="/">Prompt</HoveredLink>
  
             </div>
           </MenuItem>
           <MenuItem setActive={setActive} active={active} item="Pricing">
             <div className="flex flex-col space-y-2 text-sm p-2">
               <HoveredLink href="/hobby">Hobby</HoveredLink>
               <HoveredLink href="/individual">Individual</HoveredLink>
               <HoveredLink href="/team">Team</HoveredLink>
               <HoveredLink href="/enterprise">Enterprise</HoveredLink>
             </div>
           </MenuItem>
         </Menu>
       </div>
     );
   }