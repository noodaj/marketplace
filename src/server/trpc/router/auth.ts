import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { z } from "zod";
import {
	router,
	publicProcedure,
	protectedProcedure,
	adminProcedure,
} from "../trpc";
import * as trpc from "@trpc/server";
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
				username: z.string().optional(),
				email: z.string().optional(),
				password: z.string().min(6),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { username, password, email } = input;
			try {
				const user = await ctx.prisma.user.create({
					data: { userName: username, password: password },
				});
				return user;
			} catch (e) {
				if (e instanceof PrismaClientKnownRequestError) {
					throw new trpc.TRPCError({
						code: "CONFLICT",
						message: "User already exists",
					});
				}

				throw new trpc.TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong",
				});
			}
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
		return await ctx.prisma.user.findMany({select: {userName: true, id: true, role: true}});
	}),
});
