import { useRef } from "react";
import { trpc } from "../utils/trpc";

type Props = {
	id: string;
	name: string;
	price: number;
	quantity: number;
	image: string;
};

export const ItemObj = ({ id, name, price, quantity, image }: Props) => {
	const itemCount = useRef<HTMLInputElement>(null);
	//let total: number = quantity;
	let itemID: string = id;
	const decrementMutation = trpc.items.decrementItem.useMutation();
	const addMutation = trpc.cart.addToCart.useMutation();

	const decrementItem = (total: number) => {
		decrementMutation.mutate({ itemID, total });
	};

	const addToCart = () => {
		addMutation.mutate({
			cartID: "clbvzbkcf0010ethei8ez5r4h",
			quantity: Number(itemCount.current?.value),
			itemID: id,
			userID: "",
		});
	};
	return (
		<div className="w-72 rounded-md bg-stone-300">
			<div className="flex flex-row items-center gap-3 p-3">
				<img
					className="h-20 w-24 border-spacing-9 rounded-md border"
					src={image}
				></img>
				<p>{`${name} $${price.toFixed(2)}`}</p>
			</div>
			<div className="flex justify-evenly py-1">
				<button
					onClick={() => {
						decrementItem(
							quantity - Number(itemCount.current?.value)
						);
						addToCart();
					}}
				>
					Add to cart
				</button>
				<input
					type={"number"}
					ref={itemCount}
					placeholder="0"
					className="w-1/6 rounded-md border-2 border-gray-600"
				></input>
			</div>
		</div>
	);
};
