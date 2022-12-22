import { Item } from "@prisma/client";
import { ItemObj } from "./item";

type ItemListProp = {
	items: Item[];
};

export const ItemList = ({ items }: ItemListProp) => {
	return (
		<>
			<h1 className="px-32 text-2xl">Popular Products</h1>
			<div className="mx-64 my-auto flex w-lg flex-col">
				<div className="grid grid-cols-4 place-items-center gap-6 gap-x-96 py-3">
					{items.map((item) => (
						<ItemObj
							key={Math.random() * 1000}
							id={item.id}
							name={item.name}
							price={item.price}
							quantity={item.quantity}
							image={item.image || ""}
						></ItemObj>
					))}
				</div>
			</div>
		</>
	);
};
