import { router } from "../trpc";
import { ItemsRouter } from "./itemsRouter";
import { CartRouter } from "./cartRouter";

export const appRouter = router({
	items: ItemsRouter,
	cart: CartRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
