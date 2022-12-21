import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const CartRouter = router({
	addToCart: publicProcedure
		.input(
			z.object({
				userID: z.string(),
				itemID: z.string(),
				quantity: z.number(),
				cartID: z.string().nullable(),
			})
		)
		.mutation(async ({ input, ctx }) => {
			//get the cartID which is the same as the userID
			//then we can find the cart with this uniqueID
			//if it doesnt exist we will create a new cart with the userID passed in and connect the itemID to this cart
			//if it exists we will just connect the item to the cart
			//return the cart
			const { userID, itemID, quantity, cartID } = input;
			const cart = await ctx.prisma.shoppingCart.findFirst({
				where: { id: cartID! },
			});
			if (cart === null) {
				await ctx.prisma.shoppingCart.create({
					data: {
						userID: userID,
						items: {
							create: {
								quantity: quantity,
								item: { connect: { id: itemID } },
							},
						},
					},
					include: { items: true },
				});
			} else {
				await ctx.prisma.shoppingCart.update({
					where: { id: cartID! },
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
				where: { userID: userID },
				include: { items: true },
			});
		}),

	getCart: publicProcedure
		.input(z.object({ cartID: z.string() }))
		.query(async ({ input, ctx }) => {
			const { cartID } = input;
			const cart = await ctx.prisma.shoppingCart.findFirst({
				where: { id: cartID },
				include: { items: { include: { item: true } } },
			});
			
			return cart?.items;
		}),

	deleteCart: publicProcedure
		.input(z.object({ cartID: z.string() }))
		.mutation(async ({ input, ctx }) => {
			const { cartID } = input;
			const cart = await ctx.prisma.shoppingCart.delete({
				where: { id: cartID },
			});

			return cart;
		}),

	deleteItem: publicProcedure
		.input(z.object({ itemID: z.string(), cartID: z.string() }))
		.mutation(async ({ input, ctx }) => {
			return;
		}),
});
