import { PrismaClient } from "@prisma/client";
import nextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const prisma = new PrismaClient();
export const authOptions: NextAuthOptions = {
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
					if (user.password === password) {
						return user;
					}
				}
				return null;
			},
		}),
	],
	pages: {
		signIn: "signin",
		newUser: "createAcct",
	},
};

export default nextAuth(authOptions);
