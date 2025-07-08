"use client";
import { useUser } from '@clerk/nextjs';
import { createComment, deletePost, getPosts, toggleLike } from '@/actions/post.action';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

type  Posts  = Awaited<ReturnType<typeof getPosts>>
type Post = Posts[number];

function PostCard({ post, dbUserId } :{
  post: Post;
  dbUserId: string | null;
}) {
    const { user} = useUser();
    const [newComment, setNewComment] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [hasLiked, setHasLiked] = useState(post.likes.some(like => like.userId === dbUserId));
    const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes || 0);

    // Handlers for like, comment, and delete actions
    const handleLike = async () => {
        if(isLiking) return;
        
        try {
            setIsLiking(true);
            setHasLiked(prev => !prev);
            setOptimisticLikes(prev => prev + (hasLiked ? -1 : 1));
            await toggleLike(post.id);
        } catch (error) {
            setOptimisticLikes(post._count.likes || 0);
            setHasLiked(false);
        } finally {
            setIsLiking(false);
        }
    }

    const handleAddComment = async () => {
        if (!newComment) return;

        try {
            setIsCommenting(true);
            const result = await createComment(post.id, newComment);
            if (result?.success) {
                // Update UI optimistically
                toast.success("Comment added successfully!");
                setNewComment('');
            }
        } catch (error) {
            console.error("Failed to add comment:", error);
        } finally {
            setIsCommenting(false);
        }
    }

    const handleDeletePost = async () => {
        if (isDeleting) return;
        try {
        setIsDeleting(true);
        const result = await deletePost(post.id);
        if (result.success) toast.success("Post deleted successfully");
        else throw new Error(result.error);
        } catch (error) {
        toast.error("Failed to delete post");
        } finally {
        setIsDeleting(false);
        }
    }


  return (
    <h1>
      Post Title
    </h1>
  )
}

export default PostCard
