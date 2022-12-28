import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const CartRouter = router({
	addToCart: publicProcedure
		.input(
			z.object({
				uID: z.string(),
				itemID: z.string(),
				quantity: z.number(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			//get the cartID which is the same as the userID
			//then we can find the cart with this uniqueID
			//if it doesnt exist we will create a new cart with the userID passed in and connect the itemID to this cart
			//if it exists we will just connect the item to the cart
			//return the cart
			const { itemID, quantity, uID } = input;
			const item = await ctx.prisma.shoppingCart.findFirst({
				where: {
					AND: [
						{ userID: uID },
						{ items: { some: { itemID: itemID } } },
					],
				},
				include: { items: { where: { itemID: itemID } } },
			});

			if (item) {
				await ctx.prisma.shoppingCart.update({
					where: { userID: uID },
					data: {
						items: {
							update: {
								where: { id: item.items[0]?.id },
								data: {
									quantity:
										item.items[0]!.quantity + quantity,
								},
							},
						},
					},
					include: { items: true },
				});
			} else {
				await ctx.prisma.shoppingCart.update({
					where: { userID: uID },
					data: {
						items: {
							create: {
								quantity: quantity,
								item: { connect: { id: itemID } },
							},
						},
					},
					include: { items: true },
				});
			}

			return ctx.prisma.shoppingCart.findFirst({
				where: { userID: uID },
				include: { items: { include: { item: true } } },
			});
		}),

	getCart: publicProcedure
		.input(z.object({ cartID: z.string() }))
		.query(async ({ input, ctx }) => {
			const { cartID } = input;
			const cart = await ctx.prisma.shoppingCart.findFirst({
				where: { userID: cartID },
				include: { items: { include: { item: true } } },
			});

			return cart?.items;
		}),

	deleteCart: publicProcedure
		.input(z.object({ cartID: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const { cartID } = input;
			const cart = await ctx.prisma.shoppingCart.delete({
				where: { userID: cartID },
			});

			return cart;
		}),

	deleteItem: publicProcedure
		.input(z.object({ itemID: z.string(), uID: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const { itemID, uID } = input;
			const item = await ctx.prisma.shoppingCart.findFirst({
				where: { userID: uID },
				select: { items: { where: { itemID: itemID } } },
			});

			const cart = await ctx.prisma.shoppingCart.update({
				where: { userID: uID },
				data: { items: { disconnect: { id: item?.items[0]?.id } } },
				include: { items: { include: { item: true } } },
			});

			return cart;
		}),

	updateItemCount: publicProcedure
		.input(
			z.object({
				uID: z.string(),
				itemID: z.string(),
				quantity: z.number(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { itemID, quantity, uID } = input;
			const item = await ctx.prisma.shoppingCart.findFirst({
				where: { userID: uID },
				select: { items: { where: { itemID: itemID } } },
			});
			
			const cart = await ctx.prisma.shoppingCart.update({
				where: { userID: uID },
				data: {
					items: {
						update: {
							where: { id: item?.items[0]?.id },
							data: { quantity: quantity },
						},
					},
				},
				include: { items: { include: { item: true } } },
			});

			console.log(cart)
			return cart;
		}),
});
