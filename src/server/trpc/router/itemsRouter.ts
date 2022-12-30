import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "../trpc";

//input is created from z object passing in the name price and quantity
//then we call mutation passing in the object and create it in the db
export const ItemsRouter = router({
	addItems: adminProcedure
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
			await ctx.prisma.item.create({
				data: {
					name,
					price,
					quantity,
					image,
				},
			});

			const items = await ctx.prisma.item.findMany()
			return items
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
					quantity: total,
				},
			});
			return item;
		}),

	deleteItem: adminProcedure
		.input(z.object({ itemID: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const { itemID } = input;
			await ctx.prisma.item.delete({
				where: { id: itemID },
			});

			const allItems = await ctx.prisma.item.findMany();
			return allItems;
		}),

	editItem: adminProcedure
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
			await ctx.prisma.item.update({
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
			const items = await ctx.prisma.item.findMany();
			return items;
		}),

	getItem: publicProcedure
		.input(z.object({ itemID: z.string() }))
		.query(async ({ input, ctx }) => {
			const { itemID } = input;
			const item = await ctx.prisma.item.findUnique({
				where: { id: itemID },
			});
			return item;
		}),
});
