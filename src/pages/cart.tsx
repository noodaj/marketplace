import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { Header } from "../components/header";
import { trpc } from "../utils/trpc";

const ShoppingCart: NextPage = () => {
	const { data: session } = useSession();
	const items = trpc.cart.getCart.useQuery({
		cartID: session?.userID || "clc2y9alu0002etodpyit1tmm",
	});

	return (
		<>
			<div className="base h-screen">
				<Header></Header>
				<div className="mx-32 h-[calc(100%_-_8rem)] rounded-md border">
					<div className="grid-flow-rows grid grid-rows-2">
						{items.isSuccess && (
							<div>
								{items.data?.map((item) => (
									<p key={Math.random() * 100}>
										{item.item?.name}
									</p>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default ShoppingCart;
