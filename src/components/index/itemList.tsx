import { Item } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";
import { ItemObj } from "./item";

type ItemListProp = {
	items: Item[];
	setLength: Dispatch<SetStateAction<number>>
};

export const ItemList = ({ items, setLength }: ItemListProp) => {
	return (
		<>
			<h1 className="px-32 text-2xl">Popular Products</h1>
			<div className="my-auto w-full px-12">
				<div className="grid 2xl:grid-cols-4 md:grid-cols-2 place-items-center gap-2 gap-y-6 py-4">
					{items.map((item) => (
						<ItemObj
							key={Math.random() * 1000}
							id={item.id}
							name={item.name}
							price={item.price}
							quantity={item.quantity}
							image={item.image || ""}
							setLength={setLength}
						></ItemObj>
					))}
				</div>
			</div>
		</>
	);
};
