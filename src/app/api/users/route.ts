import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import Poll from "@/models/Poll";

// GET: Fetch all users (Admin only)
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Security Check: Only allow 'admin' role
        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 401 });
        }

        await connectToDatabase();

        // Fetch all users, excluding passwords for security
        const users = await User.find({}).select('-password');

        return NextResponse.json(users);
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// DELETE: Remove a user (Admin only)
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Security Check: Only allow 'admin' role
        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('id');

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        await connectToDatabase();

        // Delete the user from the database
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Optional: Clean up polls created by this user
        // await Poll.deleteMany({ creator: userId });

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Failed to delete user:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
