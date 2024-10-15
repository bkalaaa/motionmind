"use client";
import Image from "next/image";
import React, { useState } from "react";
import { WavyBackground } from "../components/ui/wavy-background";
import { LayoutGrid } from "../components/ui/layout-grid";
import { useRouter } from "next/navigation";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../components/ui/navbar-menu";
import { cn } from "@/lib/utils";


export default function Home() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/prompt"); // Redirects to the demo page
  };

  return (

    <div className="flex flex-col items-center">
      <WavyBackground className="max-w-10xl mx-auto pb-40">
        <p className="text-2xl md:text-20xl lg:text-7xl text-white font-bold inter-var text-center">
          MotionMind
        </p>
        <p className="text-base md:text-lg mt-4 text-white font-bold inter-var text-center">
          Leverage the power of AI to create stunning animations.
        </p>
        <div className="flex justify-center mt-8">
          <button
            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            onClick={handleRedirect}
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Start Prompting
            </span>
          </button>
        </div>
      </WavyBackground>
      
      <div className="w-full">
        <LayoutGridDemo />
      </div>
    </div>
  );
}

// export function NavbarDemo() {
//   return (
//     <div className="relative w-full flex items-center justify-center">
//       <Navbar className="top-2" />
//       <p className="text-black dark:text-white">
//       </p>
//     </div>
//   );
// }

// function Navbar({ className }: { className?: string }) {
//   const [active, setActive] = useState<string | null>(null);
//   return (
//     <div
//       className={cn("fixed top-4 inset-x-0 max-w-xs mx-auto z-50 h-10", className)}
//     >
//       <Menu setActive={setActive}>
//         <MenuItem setActive={setActive} active={active} item="Get Started">
//           <div className="flex flex-col space-y-2 text-sm p-2">
//             <HoveredLink href="/web-dev">Get Started</HoveredLink>
//             <HoveredLink href="/prompt">Prompt</HoveredLink>

//           </div>
//         </MenuItem>
//         <MenuItem setActive={setActive} active={active} item="Pricing">
//           <div className="flex flex-col space-y-2 text-sm p-2">
//             <HoveredLink href="/hobby">Hobby</HoveredLink>
//             <HoveredLink href="/individual">Individual</HoveredLink>
//             <HoveredLink href="/team">Team</HoveredLink>
//             <HoveredLink href="/enterprise">Enterprise</HoveredLink>
//           </div>
//         </MenuItem>
//       </Menu>
//     </div>
//   );
// }

export function LayoutGridDemo() {
  return (
    <div className="h-screen py-20 w-full">
      <LayoutGrid cards={cards} />
    </div>
  );
}

const SkeletonOne = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        3D-Graph
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        A 3d sinusodial graph that is animated and with the formula on the top.
      </p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        3D-Ball
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        A ball rendered in 3D space that is animated, a bit rough around the edges (there are none).
      </p>
    </div>
  );
};

const SkeletonThree = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Graph of two sinusodial waves
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Two compressed waves that oscillate in a synchronized manner.
      </p>
    </div>
  );
};

const SkeletonFour = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Why is sin the way it is?
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        This photo shows why sin is the way it is.
      </p>
    </div>
  );
};

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "col-span-2",
    thumbnail: "/icons/kewl.png",
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail: "/icons/ball.png",
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail: "/icons/sincoswave.png",
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2",
    thumbnail:
      "/icons/circlesin.png",
  },
];