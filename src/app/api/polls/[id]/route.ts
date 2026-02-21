import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import Poll from "@/models/Poll";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const p = await params;
        await connectToDatabase();
        const poll = await Poll.findById(p.id).populate('creator', 'username');
        if (!poll) return NextResponse.json({ message: "Poll not found" }, { status: 404 });
        return NextResponse.json(poll);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching poll" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const p = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { action } = await req.json();

        await connectToDatabase();
        const poll = await Poll.findById(p.id);
        if (!poll) return NextResponse.json({ message: "Poll not found" }, { status: 404 });

        if (action === "toggleActive") {
            poll.active = !poll.active;
            await poll.save();
            return NextResponse.json({ message: "Poll active status updated", poll });
        }

        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ message: "Error updating poll" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const p = await params;
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await connectToDatabase();
        await Poll.findByIdAndDelete(p.id);
        return NextResponse.json({ message: "Poll deleted successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting poll" }, { status: 500 });
    }
}
