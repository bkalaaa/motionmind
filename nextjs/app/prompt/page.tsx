"use client";
import { useState } from "react";
import { PlaceholdersAndVanishInput } from "../../components/ui/placeholders-and-vanish-input";
import VideoPlayer from "../../components/ui/video-player";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../../components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
export default function Home() {
  const [videoSrc, setVideoSrc] = useState("");

  return (
    <div>
      <div className="h-[40rem] flex flex-col justify-center items-center px-4 pt-4 -mt-10">
        <PlaceholdersAndVanishInputDemo setVideoSrc={setVideoSrc} />
      </div>
      <div className="mt-16">
        <VideoPlayer src={videoSrc} />
      </div>
      <div className="mt-16">
        <NavbarDemo />
      </div>
    </div>
  );
}

export function PlaceholdersAndVanishInputDemo({ setVideoSrc }) {
  const placeholders = [
    "What's the integral of sin^x?",
    "Show a 3D plot of z = x^2 + y^2 over the range -2 to 2 for both axes.",
    "Plot the function y = sin(x) from -2π to 2π.",
    "Show the Pythagorean theorem with a right triangle and squares on each side.",
    "Draw the Cartesian coordinate system with x and y axes labeled."
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input changed:", e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector("input")?.value;
    if (input) {
      try {
        const response = await fetch('http://localhost:4000/api/generateVideo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ question: input }),
        });

        const data = await response.json();
        console.log('Response from serverless function:', data);
        setVideoSrc(`http://localhost:4000${data.videoUrl}`); // Assuming the response contains the video URL as "videoUrl"
        console.log('Video URL:', `http://localhost:4000${data.videoUrl}`);
      } catch (error) {
        console.error('Error sending data:', error);
      }
    }
  };
  
  return (
    <div className="h-[40rem] flex flex-col justify-center items-center px-4">
      <h2 className="mb-10 sm:mb-20 text-xl text-center font-bold sm:text-5xl dark:text-white text-white">
        Ask MotionMind Anything.
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
         className={cn("fixed top-4 inset-x-0 flex justify-center mx-auto z-50", className)}
       >
         <Menu setActive={setActive}>
           <MenuItem setActive={setActive} active={active} item="Pages">
             <div className="flex flex-col space-y-2 text-sm p-2">
               <HoveredLink href="/">Go Home</HoveredLink>
  
             </div>
           </MenuItem>
           {/* <MenuItem setActive={setActive} active={active} item="Pricing">
             <div className="flex flex-col space-y-2 text-sm p-2">
               <HoveredLink href="/hobby">Hobby</HoveredLink>
               <HoveredLink href="/individual">Individual</HoveredLink>
               <HoveredLink href="/team">Team</HoveredLink>
               <HoveredLink href="/enterprise">Enterprise</HoveredLink>
             </div>
           </MenuItem> */}
         </Menu>
       </div>
     );
   }