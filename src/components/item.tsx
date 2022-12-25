import { useSession } from "next-auth/react";
import { FC, useRef, useState } from "react";
import { trpc } from "../utils/trpc";

type Props = {
	id: string;
	name: string;
	price: number;
	quantity: number;
	image: string;
};

export const ItemObj: FC<Props> = ({ id, name, price, quantity, image }) => {
	const itemCount = useRef<HTMLInputElement>(null);
	const [invalidCount, setInvalidCount] = useState<boolean>(false);
	const decrementMutation = trpc.items.decrementItem.useMutation();
	const addMutation = trpc.cart.addToCart.useMutation();
	const { data: session } = useSession();
	const addToCart = () => {
		if (Number(itemCount.current?.value) > 0) {
			addMutation.mutate({
				itemID: id,
				quantity: Number(itemCount.current?.value),
				uID: session!.userID,
			});

			decrementMutation.mutate({
				itemID: id,
				total: quantity - Number(itemCount.current?.value),
			});
		}
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
			{invalidCount && <p className="flex justify-center text-red-600">Invalid Count</p>}
			<div className="flex justify-evenly py-1">
				<button
					onClick={() => {
						if (Number(itemCount.current?.value) <= 0) {
							setInvalidCount(true);
						} else {
							addToCart();
							setInvalidCount(false)
						}
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
