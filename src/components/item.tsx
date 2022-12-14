import { useRef } from "react";
import { trpc } from "../utils/trpc";

type Props = {
	name: string;
	price: number;
	image: string;
};

export const ItemObj = ({ name, price, image }: Props) => {
	const itemCount = useRef<HTMLInputElement>(null);
	let quantity: number = 0;

	const addItemMutation = trpc.items.addItemsRouter.useMutation();
	const addItem = () => {
		addItemMutation.mutate({ name, quantity });
		return undefined;
	};

	return (
		<div className="min-w-max max-w-xs rounded-md bg-stone-300">
			<div className="flex flex-row gap-3 p-3">
				<p>{name}</p>
				<p>{`$${price.toFixed(2)}`}</p>
				{/*<p>{`${quantity}`}</p>*/}
			</div>
			<div className="flex justify-evenly py-1">
				<button
					onClick={() => {
						quantity = Number(itemCount.current?.value);
						addItem();
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