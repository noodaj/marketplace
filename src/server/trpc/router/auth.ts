import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "../../../env/client.mjs";
import {
	adminProcedure,
	protectedProcedure,
	publicProcedure,
	router,
} from "../trpc";
export const authRouter = router({
	getSession: publicProcedure.query(({ ctx }) => {
		return ctx.session;
	}),

	getSecretMessage: protectedProcedure.query(() => {
		return "you can now see this secret message!";
	}),

	createUser: publicProcedure
		.input(
			z.object({
				name: z.string(),
				username: z.string(),
				password: z.string().min(6),
				items: z.array(
					z.object({
						itemID: z.string(),
						quantity: z.number(),
					})
				),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { username, password, name, items: data } = input;
			const existing = await ctx.prisma.user.findFirst({
				where: { userName: username },
			});

			if (existing) {
				throw new TRPCError({
					code: "CONFLICT",
					message: "User already exists",
				});
			}
			await ctx.prisma.user.create({
				data: {
					userName: username,
					name: name,
					password: password,
					image: "https://i.imgur.com/7kwZ0na.png",
					role: "USER",
					cart: {
						create: {
							items: { createMany: { data } },
						},
					},
				},
			});

			await ctx.prisma.shoppingCart.update({
				where: { userID: env.NEXT_PUBLIC_DEFAULT_USER },
				data: {
					items: {
						deleteMany: {}
					}
				}
			});
		}),

	updateRole: adminProcedure
		.input(
			z.object({ userID: z.string(), role: z.enum(["ADMIN", "USER"]) })
		)
		.mutation(async ({ input, ctx }) => {
			const { userID, role } = input;
			await ctx.prisma.user.update({
				where: { id: userID },
				data: { role: role },
			});
		}),

	getUsers: adminProcedure.query(async ({ ctx }) => {
		return await ctx.prisma.user.findMany({
			select: { userName: true, id: true, role: true },
		});
	}),
});
