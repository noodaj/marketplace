import { Item } from "@prisma/client";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { trpc } from "../utils/trpc";

type ModalProps = {
	setState: Dispatch<SetStateAction<boolean>>;
	setItems: Dispatch<SetStateAction<Item[]>>;
	items: Item[];
	item: Item;
};

export const EditModal = (props: ModalProps) => {
	//fix rerender when item has been updated 
	
	const { setState, item, setItems, items} = props;
	const [propState, setPropState] = useState<ModalProps>(props);

	const editItemRouter = trpc.items.editItem.useMutation({
		onSuccess(data) {
			setItems((prev) => prev.filter((old) => old.id !== item.id));
			//setItems([...items, data])
		},
	});

	const itemName = useRef<HTMLInputElement>(null);
	const itemPrice = useRef<HTMLInputElement>(null);
	const itemQuantity = useRef<HTMLInputElement>(null);
	const itemImage = useRef<HTMLInputElement>(null);

	useEffect(() => {
		console.log('changed')
		setPropState(props);
		setItems(items)
	}, [props]);

	const editItem = () => {
		editItemRouter.mutate({
			itemID: item.id,
			name: itemName.current?.value || item.name,
			price: Number(itemPrice.current?.value) || item.price!,
			quantity: Number(itemQuantity.current?.value) || item.quantity,
			image: itemImage.current?.value || item.image!,
		});
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
							setState(false);
						}}
					>
						Update
					</button>
				</div>
			</div>
		</div>
	);
};
