import { User } from ".prisma/client";
import NextAuth from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		userID: string
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		user: User;
	}
}
