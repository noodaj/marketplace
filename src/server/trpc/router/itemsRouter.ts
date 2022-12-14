import { z } from "zod";
import { router, publicProcedure } from "../trpc";

//input is created from z object passing in the name price and quantity
//then we call mutation passing in the object and create it in the db
export const addItemsRouter = router({
	addItemsRouter: publicProcedure
		.input(
			z.object({
				name: z.string(),
				quantity: z.number(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { name, quantity } = input;
			const item = await ctx.prisma.item.create({
				data: {
					name,
					quantity,
				},
			});
			return item;
		}),
	
	getAllItems: publicProcedure.query(async ({ctx}) => {
		const items = await ctx.prisma.item.findMany()
		return items
	})
});
