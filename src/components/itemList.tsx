import { Item } from "@prisma/client";
import { ItemObj } from "./item";

type ItemListProp = {
	items: Item[];
};

export const ItemList = ({ items }: ItemListProp) => {
	return (
		<div className="">
			<h1 className="px-56 text-2xl">Popular Products</h1>
			<div className="row-span-4 grid grid-cols-3 place-items-center gap-3 py-3">
				{items.map((item) => (
					<ItemObj
						key={Math.random() * 1000}
						id={item.id}
						name={item.name}
						price={item.price !== null ? item.price : 0}
						quantity={item.quantity}
						image={""}
					></ItemObj>
				))}
			</div>
		</div>
	);
};
