import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { ModeToggle } from "@/components/modeToggle";
import { currentUser } from "@clerk/nextjs/server";
import CreatePost from "@/components/CreatePost";
import SuggestionUsers from "@/components/SuggestionUsers";

export default async function Home() {
  const user = await currentUser();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
        {user ? <CreatePost /> : null}
        
      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <SuggestionUsers />
      </div>
    </div>
  );
}