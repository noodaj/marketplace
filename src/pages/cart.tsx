import { NextPage } from "next";
import { Header } from "../components/header";
import { trpc } from "../utils/trpc";

const ShoppingCart: NextPage = () => {
	const itemRouter = trpc.cart.getCart.useQuery({
		cartID: "clbvzbkcf0010ethei8ez5r4h",
	});

	return (
		<div className="base">
			<Header itemCount={itemRouter.data?.length ?? 0}></Header>
			<div className="mx-32 border">
				<h1 className="text-2xl font-semibold">Your Cart</h1>
				<div className="flex justify-center"></div>
			</div>
		</div>
	);
};

export default ShoppingCart;
