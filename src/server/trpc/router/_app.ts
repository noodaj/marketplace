import { router } from "../trpc";
import { ItemsRouter } from "./itemsRouter";
import { CartRouter } from "./cartRouter";
import { authRouter } from "./auth";

export const appRouter = router({
	items: ItemsRouter,
	cart: CartRouter,
	auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
