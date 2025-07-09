import { getProfileByUsername } from '@/actions/profile.action';
import React from 'react'
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { username } = await params;

  const user = await getProfileByUsername(username);
  if (!user) return;

  return {
    title: `${user.name ?? user.username}'s Profile`,
    description: user.bio || `Profile page of ${user.username}`,
  };
}

function ProfilePage({ params }: { params: { username: string } }) {
    
  return (
    <div>
      Profile Page
    </div>
  )
}

export default ProfilePage
