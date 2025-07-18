"use client"
import React, { useState } from 'react'
import { Button } from './ui/button';
import { Loader2Icon } from 'lucide-react';
import toast from 'react-hot-toast';
import { toggleFollow } from '@/actions/user.action';


function FollowButton({ userId }: { userId: string }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleFollow = async () => {
        setIsLoading(true);

        try {
            await toggleFollow(userId);
            toast.success("Followed user successfully!");
        } catch (error) {
            toast.error("Failed to follow user:");
        } finally {
            setIsLoading(false);
        }
    }
  return (
    <Button
    size={"sm"}
    onClick={handleFollow}
    disabled={isLoading}
    variant={"secondary"}
    className='w-20'
    >{isLoading ? <Loader2Icon className="size-4 animate-spin" /> : "Follow"}

    </Button>
  )
}

export default FollowButton
