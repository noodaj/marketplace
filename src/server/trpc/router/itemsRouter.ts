import { z } from "zod";
import { router, publicProcedure } from "../trpc";

//input is created from z object passing in the name price and quantity
//then we call mutation passing in the object and create it in the db
export const ItemsRouter = router({
	addItems: publicProcedure
		.input(
			z.object({
				name: z.string(),
				price: z.number(),
				quantity: z.number(),
				image: z.string(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { name, price, image, quantity } = input;
			const item = await ctx.prisma.item.create({
				data: {
					name,
					price,
					quantity,
					image,
				},
			});
			return item;
		}),

	getAllItems: publicProcedure.query(async ({ ctx }) => {
		const items = await ctx.prisma.item.findMany();
		return items;
	}),

	decrementItem: publicProcedure
		.input(z.object({ itemID: z.string(), total: z.number() }))
		.mutation(async ({ input, ctx }) => {
			const { itemID, total } = input;
			const item = await ctx.prisma.item.update({
				where: {
					id: itemID,
				},
				data: {
					quantity: total >= 0 ? total : 0,
				},
			});
			return item;
		}),

	deleteItem: publicProcedure
		.input(z.object({ itemID: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const { itemID } = input;
			const item = await ctx.prisma.item.delete({
				where: { id: itemID },
			});
			return item;
		}),

	editItem: publicProcedure
		.input(
			z.object({
				itemID: z.string(),
				name: z.string(),
				price: z.number(),
				quantity: z.number(),
				image: z.string(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { itemID, name, price, quantity, image } = input;
			const item = await ctx.prisma.item.update({
				where: {
					id: itemID,
				},
				data: { 
					name: name,
					price: price,
					quantity: quantity,
					image: image,
				},
			});
			return item
		}),
});
