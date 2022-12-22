import { Item } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Header } from "../components/header";
import { ItemList } from "../components/itemList";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
	const getItems = trpc.items.getAllItems.useQuery();
	const [items, setItems] = useState<Item[]>([]);
	const session = useSession()

	console.log(session)
	//get id from user
	const cart = trpc.cart.getCart.useQuery(
		{ cartID: "clbvzbkcf0010ethei8ez5r4h" },
	);

	//useEffect when doing fetch requests is usually finished after the rendering of the ui
	//dependency array uses the data queried to set the items and to rerender the ui
	//is still done after the initial rendering of ui but we have our items now
		
	useEffect(() => {
		if (getItems.data) {
			setItems(getItems.data);
		}
	}, [getItems.data]);
	
	return (
		<>
			<header>
				<title>Marketplace</title>
				<meta name="description" content="Generated by create-t3-app" />
				<link rel="icon" href="favicon.ico" />
			</header>

			<main className="base">
				<Header itemCount={cart.data?.length ?? 0} />
				<ItemList items={items}></ItemList>
			</main>
		</>
	);
};
export default Home;
