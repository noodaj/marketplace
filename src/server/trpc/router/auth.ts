import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";
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
	/*
	getUser: publicProcedure.input(z.object({username: z.string(), password: z.string()})).query(async ({ctx,input}) => {
		const {username, password} = input
		const user = await ctx.prisma.user.findUnique({where: {userName: username}})
		if(user !== null){
			if(user?.password === password){
				return {success: true, user}
			}
		}
		return {success: false, user}
	})\
	*/
});
