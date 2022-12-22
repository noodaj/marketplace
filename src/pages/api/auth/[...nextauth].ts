import { PrismaAdapter } from "@next-auth/prisma-adapter";
import nextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
	callbacks: {
		session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
			}
			return session;
		},
	},
	adapter: PrismaAdapter(prisma),
	providers: [
		Credentials({
			type: "credentials",
			credentials: {},
			async authorize(credentials, req) {
				const { username, password } = credentials as {
					username: string;
					password: string;
				};

				const user = await prisma.user.findUnique({
					where: { userName: username },
				});

				if (user) {
					if (user.password == password) {
						return user;
					}
				}
				return null;
				//throw new Error();
			},
		}),
	],
	pages: {
		signIn: "signin",
		newUser: "createAcct",
	},
};

export default nextAuth(authOptions);
