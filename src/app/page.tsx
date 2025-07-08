import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { ModeToggle } from "@/components/modeToggle";
import { currentUser } from "@clerk/nextjs/server";
import CreatePost from "@/components/CreatePost";
import SuggestionUsers from "@/components/SuggestionUsers";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/actions/post.action";
import { getDbUserId } from "@/actions/user.action";

export default async function Home() {
  const user = await currentUser();
  const posts = await getPosts(); // Assuming you have a function to fetch posts
  const dbUserId = await getDbUserId();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
        {user ? <CreatePost /> : null}

        <div className="space-y-6">
          {/* Add your post feed or other components here */}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} dbUserId={dbUserId} />
          ))}
          
        </div>
        
      </div>
      <div className="hidden lg:block lg:col-span-4 sticky top-20">
        <SuggestionUsers />
      </div>
    </div>
  );
}