import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Poll from "@/models/Poll";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const p = await params;
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { optionId } = await req.json();

        if (!optionId) {
            return NextResponse.json({ message: "Option ID is required" }, { status: 400 });
        }

        await connectToDatabase();

        const poll = await Poll.findById(p.id);
        if (!poll) return NextResponse.json({ message: "Poll not found" }, { status: 404 });

        if (!poll.active) {
            return NextResponse.json({ message: "Voting is closed for this poll" }, { status: 400 });
        }

        const userId = session.user.id;
        const alreadyVoted = poll.voters.some((voterId: any) => voterId.toString() === userId.toString());

        console.log(`[Voting API] User: ${userId}, Poll: ${p.id}, Already Voted: ${alreadyVoted}`);

        if (alreadyVoted) {
            return NextResponse.json({ message: "You have already voted on this poll" }, { status: 400 });
        }

        const optionIndex = poll.options.findIndex((opt: any) => opt._id.toString() === optionId.toString());

        if (optionIndex === -1) {
            console.warn(`[Voting API] Invalid option ${optionId} for poll ${p.id}`);
            return NextResponse.json({ message: "Invalid option" }, { status: 400 });
        }

        poll.options[optionIndex].votes += 1;
        poll.voters.push(userId as any);

        await poll.save();
        console.log(`[Voting API] Vote successful for user ${userId} on poll ${p.id}`);

        return NextResponse.json({ message: "Vote cast successfully", poll });
    } catch (error) {
        return NextResponse.json({ message: "Error casting vote" }, { status: 500 });
    }
}
