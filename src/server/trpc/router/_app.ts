import { router } from "../trpc";
import { addItemsRouter } from "./itemsRouter";

export const appRouter = router({
	items: addItemsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
