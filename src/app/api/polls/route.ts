import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Poll from "@/models/Poll";

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        const polls = await Poll.find().populate('creator', 'username').sort({ createdAt: -1 });
        return NextResponse.json(polls);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching polls", error }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { title, description, options } = await req.json();

        if (!title || !options || options.length < 2) {
            return NextResponse.json({ message: "Title and at least 2 options are required" }, { status: 400 });
        }

        await connectToDatabase();

        const formattedOptions = options.map((opt: string) => ({ text: opt, votes: 0 }));

        const newPoll = new Poll({
            title,
            description,
            options: formattedOptions,
            creator: session.user.id,
            active: true,
            voters: []
        });

        await newPoll.save();

        return NextResponse.json({ message: "Poll created successfully", poll: newPoll }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating poll", error }, { status: 500 });
    }
}
