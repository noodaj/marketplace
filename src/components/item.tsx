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
	let total: number = quantity;
	let itemID: string = id;
	const decrementMutation = trpc.items.decrementItem.useMutation();
	
	const decrementItem = () => {
		decrementMutation.mutate({itemID, total})
		return undefined;
	};
	
	return (
		<div className="min-w-max max-w-xs rounded-md bg-stone-300">
			<div className="flex flex-row gap-3 p-3">
				<p>{name}</p>
				<p>{`$${price.toFixed(2)}`}</p>

				{/*<p>{quantity > 5 ? quantity : <p className="">Remanining {quantity} in stock!</p>}</p>*/}
			</div>
			<div className="flex justify-evenly py-1">
				<button
					onClick={() => {
						total = total - Number(itemCount.current?.value)
						decrementItem()
					}}
				>
					Add to cart
				</button>
				<input
					type={"number"}
					ref={itemCount}
					placeholder="0"
					className="w-1/6 rounded-sm"
				></input>
			</div>
		</div>
	);
};