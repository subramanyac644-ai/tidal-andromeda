import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { username, password, role } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ message: "Username and password required" }, { status: 400 });
        }

        await connectToDatabase();

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userRole = role === "admin" ? "user" : "user"; // Force all registrations to "user"

        // Extra safety check
        if (role === "admin") {
            return NextResponse.json({ message: "Admin registration is restricted" }, { status: 403 });
        }

        const newUser = new User({
            username,
            password: hashedPassword,
            role: userRole
        });

        await newUser.save();

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error registering user", error }, { status: 500 });
    }
}
