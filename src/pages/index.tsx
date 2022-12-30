import { Item } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Header } from "../components/header";
import { ItemList } from "../components/index/itemList";
import { env } from "../env/client.mjs";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
	const getItems = trpc.items.getAllItems.useQuery();
	const [items, setItems] = useState<Item[]>([]);
	const [length, setLength] = useState<number>(0);
	const { data: session } = useSession();

	trpc.cart.getCart.useQuery(
		{ cartID: session?.userID ?? env.NEXT_PUBLIC_DEFAULT_USER },
		{
			onSuccess(data) {
				setLength(data!.length);
			},
		}
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
				<div>
					<Header itemCount={length} />
					<ItemList items={items} setLength={setLength}></ItemList>
				</div>
			</main>
		</>
	);
};
export default Home;
