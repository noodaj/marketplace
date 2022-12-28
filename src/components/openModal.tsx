import { Item } from "@prisma/client";
import { Dispatch, MutableRefObject, SetStateAction, useRef } from "react";
import { trpc } from "../utils/trpc";

type ModalProps = {
	setState: Dispatch<SetStateAction<boolean>>;
};

export const OpenModal = ({ setState}: ModalProps) => {
	const addItemRouter = trpc.items.addItems.useMutation({
	});
	
	const itemName = useRef() as MutableRefObject<HTMLInputElement>;
	const itemPrice = useRef<HTMLInputElement>(null);
	const itemQuantity = useRef<HTMLInputElement>(null);
	const itemImage = useRef() as MutableRefObject<HTMLInputElement>;

	const addItem = () => {
		addItemRouter.mutate({
			name: itemName.current?.value,
			price: Number(itemPrice.current?.value),
			quantity: Number(itemQuantity.current?.value),
			image: itemImage.current?.value,
		});
	};

	return (
		<div className="absolute inset-0 flex items-center justify-center bg-black/75">
			<div className="space-y-5 rounded-md bg-white p-5">
				<h1 className="text-2xl font-medium">New Item</h1>
				<form className="flex flex-col gap-5">
					<input
						className="addItemBase"
						type="text"
						ref={itemName}
						placeholder="Name"
					></input>
					<input
						className="addItemBase"
						type="number"
						ref={itemPrice}
						placeholder="Price"
					></input>
					<input
						className="addItemBase"
						type="number"
						ref={itemQuantity}
						placeholder="Quantity"
					></input>
					<input
						className="addItemBase"
						type="text"
						ref={itemImage}
						placeholder="Image"
					></input>
				</form>
				<div className="grid grid-cols-2 gap-12">
					<button
						className="rounded-md bg-gray-500 p-1 font-semibold"
						onClick={() => {
							setState(false);
						}}
					>
						Cancel
					</button>
					<button
						className="rounded-md bg-violet-400 p-1 font-semibold"
						onClick={() => {
							addItem();
							setState(false);
						}}
					>
						Add
					</button>
				</div>
			</div>
		</div>
	);
};
