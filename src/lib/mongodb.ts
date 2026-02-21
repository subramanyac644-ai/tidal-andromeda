import mongoose from "mongoose";

const MONGODB_URI_ENV = process.env.MONGODB_URI;

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null, uri: null, server: null };
}

async function connectToDatabase() {
    let uri = MONGODB_URI_ENV || cached.uri;

    if (!uri || uri.trim() === '') {
        console.warn("No MONGODB_URI provided. Using local mongodb-memory-server...");
        if (!cached.server) {
            const { MongoMemoryServer } = await import('mongodb-memory-server');
            cached.server = await MongoMemoryServer.create();
            cached.uri = cached.server.getUri();
            console.log("Started embedded MongoDB:", cached.uri);
        }
        uri = cached.uri;
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };
        cached.promise = mongoose.connect(uri as string, opts).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectToDatabase;
