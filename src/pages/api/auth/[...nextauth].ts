import { PrismaClient, User } from "@prisma/client";
import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const prisma = new PrismaClient();
let userAcct: User;

export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
		maxAge: 60 * 10
	},
	callbacks: {
		session: async ({ session, token }) => {
			session.userID = token.user.id;
			session.user!.name = token.user.name;
			session.user!.image = token.user.image;
			session.role = token.user.role
			return session;
		},

		jwt: async ({ token, user }) => {
			if (user) {
				token.user = userAcct;
			}
			return token;
		},
	},
	providers: [
		Credentials({
			type: "credentials",
			credentials: {},
			async authorize(credentials) {
				const { username, password } = credentials as {
					username: string;
					password: string;
				};

				const user = await prisma.user.findUnique({
					where: { userName: username },
				});

				if (user) {
					if (user.password === password) {
						userAcct = user;
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

export default NextAuth(authOptions);
