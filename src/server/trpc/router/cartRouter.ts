import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const CartRouter = router({
	addToCart: publicProcedure
		.input(
			z.object({
				userID: z.string(),
				item: z.object({
					name: z.string(),
					price: z.number(),
					quantity: z.number(),
					image: z.string(),
				}),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { userID, item } = input;
			const { name, price, quantity, image } = item;
			const cart = await ctx.prisma.shoppingCart.findFirst({
				where: { id: userID },
			});
			if (cart == null) {
				const newCart = await ctx.prisma.shoppingCart.create({
					data: {
						id: userID,
						items: {
							create: {
								name: name,
								price: price,
								quantity: quantity,
								image: image,
							},
						},
						userID: "",
					},
				});

				return newCart;
			} else {
				const updatedCart = await ctx.prisma.shoppingCart.update({
					where: { id: userID },
					data: {
						items: {
							update: {
								where: { id: userID },
								data: {
									name: name,
									price: price,
									quantity: quantity,
									image: image,
								},
							},
						},
					},
				});

				return updatedCart;
			}
		}),

	getCart: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ input, ctx }) => {
			const { id } = input;
			const cart = await ctx.prisma.shoppingCart.findFirst({
				where: { id : id},
			});

			return cart;
		}),

	//removeFromCart: publicProcedure.mutation()
});
