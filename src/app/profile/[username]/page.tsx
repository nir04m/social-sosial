import { getProfileByUsername, getUserLikedPosts, getUserPosts, isFollowing } from '@/actions/profile.action';
import React from 'react'
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation';
import ProfilePageClient from './ProfilePageClient';


type AsyncParams = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: AsyncParams): Promise<Metadata> {
  //  await the params Promise!
  const { username } = await params;
  const user = await getProfileByUsername(username);
  if (!user) return {};
  return {
    title: `${user.name ?? user.username}'s Profile`,
    description: user.bio || `Profile of ${user.username}`,
  };
}

export default async function ProfilePageServer({ params }: AsyncParams) {
  //  await the params Promise before using it
  const { username } = await params;
  const user = await getProfileByUsername(username);
  if (!user) notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
    <ProfilePageClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
    />
  );
}
