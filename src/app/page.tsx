import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { ModeToggle } from "@/components/modeToggle";

export default function Home() {
  return (
    <div className="m-4">
      <h1>Welcome to Sosial app</h1>
    </div>
  );
}