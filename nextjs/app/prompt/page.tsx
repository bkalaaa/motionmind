"use client";

import { PlaceholdersAndVanishInput } from "../../components/ui/placeholders-and-vanish-input";


export default function Home() {
  return (
    <div className="h-[40rem] flex flex-col justify-center  items-center px-4">
      
      <PlaceholdersAndVanishInputDemo />
    </div>
  );
}
export function PlaceholdersAndVanishInputDemo() {
  const placeholders = [
    "What's the integral of sin^x?",
    "Show pi on a graph?",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className="h-[40rem] flex flex-col justify-center  items-center px-4">
      <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
        Ask Motion Mind Anything.
      </h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
