import { Item } from "@prisma/client";
import { number } from "zod";
import ItemArr from "../testItems/data";
import { ItemObj } from "./item";

type ItemListProp = {
	items: Item[];
};
export const ItemList = ({ items }: ItemListProp) => {
	return (
		<div className="bg-">
			<h1 className="px-56 text-2xl">Popular Products</h1>
			<div className="row-span-4 grid grid-cols-3 place-items-center gap-3 py-3">
				{items.map((item) => (
					<ItemObj
						key={Math.random() * 1000}
						name={item.name}
						price={item.price !== null ? item.price : 0}
						image={""}
					></ItemObj>
				))}
				{/*
				{ItemArr.map((item) => (
					<Item
						key={Math.random() * 1000}
						name={item.Name}
						price={item.Price}
						image={item.Image}
					/>
				))}
				*/}
			</div>
		</div>
	);
};
