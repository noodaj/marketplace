import Items from "../testItems/data";
import { Item } from "./item";

export const ItemList = () => {
	return (
		<div className="bg-">
			<h1 className="px-56 text-2xl">Popular Products</h1>
			<div className = "grid row-span-4 grid-cols-3 gap-3 place-items-center py-3">
				{Items.map((item) => (
					<Item
						name={item.Name}
						price={item.Price}
						image={item.Image}
					/>
				))}
			</div>
		</div>
	);
};
