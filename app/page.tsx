"use client";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // stop the browser's default form submission
    if (!username.trim()) return;  // If username is empty or white space then stops the function
    router.push(`/user/${username}`); // Navigate to the user page
  }
  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      {/* Here items-center make your element center from every axis on the other side justify-center just simply center the element from the main axis */}
      <div className="flex items-center justify-center h-[90vh]">
        <form onSubmit={handleSearch}>
          {/* Here we using border then border-gray-400 because this is how you set border in tailwind  */}
          <input type="search" placeholder="Enter your Leetcode username" className="border border-gray-400 px-2 py-1 text-black w-[60vw]" value={username} onChange={(e) => setUsername(e.target.value)} />
          <button type="submit" className="bg-yellow-400 px-2 py-1  border border-gray-400">Search</button>
        </form>
      </div>
    </main>
  );
}