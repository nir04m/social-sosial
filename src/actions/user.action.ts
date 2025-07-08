"use server"

import { prisma } from "@/lib/prisma";
import { currentUser, auth } from "@clerk/nextjs/server";

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
