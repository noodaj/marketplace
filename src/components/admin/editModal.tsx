import { Item } from "@prisma/client";
import { Dispatch, FC, SetStateAction, useRef } from "react";
import { trpc } from "../../utils/trpc";

type ModalProps = {
	setState: Dispatch<SetStateAction<boolean>>;
	setItems: Dispatch<SetStateAction<Item[]>>;
	item: Item;
};

export const EditModal: FC<ModalProps> = ({
	setState,
	item,
	setItems,
}: ModalProps) => {
	const editItemRouter = trpc.items.editItem.useMutation();

	const itemName = useRef<HTMLInputElement>(null);
	const itemPrice = useRef<HTMLInputElement>(null);
	const itemQuantity = useRef<HTMLInputElement>(null);
	const itemImage = useRef<HTMLInputElement>(null);

	const editItem = () => {
		editItemRouter.mutate(
			{
				itemID: item.id,
				name: itemName.current?.value || item.name,
				price: Number(itemPrice.current?.value) || item.price!,
				quantity: Number(itemQuantity.current?.value) || item.quantity,
				image: itemImage.current?.value || item.image!,
			},
			{
				onSuccess(data) {
					setItems(data);
					setState(false);
				},
			}
		);
	};

	return (
		<div className="absolute inset-0 flex items-center justify-center bg-black/75">
			<div className="space-y-5 rounded-md bg-white p-5">
				<h1 className="text-2xl font-medium">Edit Item</h1>
				<form className="flex flex-col gap-5">
					<input
						className="addItemBase"
						type="text"
						ref={itemName}
						placeholder={item.name}
					></input>
					<input
						className="addItemBase"
						type="number"
						ref={itemPrice}
						placeholder={item.price!.toString()}
					></input>
					<input
						className="addItemBase"
						type="number"
						ref={itemQuantity}
						placeholder={item.quantity.toString()}
					></input>
					<input
						className="addItemBase"
						type="text"
						ref={itemImage}
						placeholder={item.image!}
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
							editItem();
						}}
					>
						Update
					</button>
				</div>
			</div>
		</div>
	);
};
