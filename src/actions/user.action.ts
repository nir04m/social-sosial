"use server"

import { prisma } from "@/lib/prisma";
import { currentUser, auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function syncUser() {
    try{
        const {userId} = await auth();
        const user = await currentUser();

        // Ensure userId and user data are available
        if (!userId || !user) {
            console.error("User ID or user data is missing");
            return;
        }
        
        // Check if the user already exists in the database
        const existingUser = await prisma.user.findUnique({
            where: {
                clerkId: userId,
            },
        });

        if (existingUser) {
            return existingUser;
        }

        // If the user does not exist, create a new user record
        const dbUser = await prisma.user.create({
            data: {
                clerkId: userId,
                name: `${user.firstName || ""} ${user.lastName || ""}`,
                username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
                email: user.emailAddresses[0].emailAddress,
                image: user.imageUrl,
            },
        });

        revalidatePath("/"); // Revalidate the home page to reflect the new user
        return dbUser;
    } catch (error) {
        console.error("Error syncing user:", error);
    }
}

export async function getUserbyClerkId(clerkId: string) {
    return await prisma.user.findUnique({
        where: { clerkId },
        include: {
            _count: {
                select: { 
                    followers: true,
                    following: true,
                    posts: true,
                },
            },
        },
    });
}

export async function getDbUserId() {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
        return null;
    }
    const user = await getUserbyClerkId(clerkId);
    if (!user) {
        throw new Error("User not found in database");
    }
    return user.id;
}


export async function getRandomUsers() {
    try {
        const userId = await getDbUserId();

        if (!userId) {
            return [];
        }

        //get random users excluding the current user and those already followed
        const randomUsers = await prisma.user.findMany({
            where: {
                AND: [
                    {NOT: {id: userId},
                    },
                    {NOT: {followers: {some: {followerId: userId}}} // Exclude users already followed
                    }
                ],
                
            },
            select: {
                id: true,
                name: true,
                username: true,
                image: true,
                _count: {
                    select: {
                        followers: true,
                    },
                },
            },
            take: 3, // Adjust the number of random users to fetch
        });

        return randomUsers;
    } catch (error) {
        console.error("Error fetching random users:", error);
        return [];
    }
}

export async function toggleFollow(targetUserId: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;

    if (userId === targetUserId) throw new Error("You cannot follow yourself");

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      // unfollow
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId,
          },
        },
      });
    } else {
      // follow
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: targetUserId,
          },
        }),

        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetUserId, // user being followed
            creatorId: userId, // user following
          },
        }),
      ]);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.log("Error in toggleFollow", error);
    return { success: false, error: "Error toggling follow" };
  }
}
