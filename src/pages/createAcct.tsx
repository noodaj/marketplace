import { NextPage } from "next";
import { Header } from "../components/header";
import { env } from "../env/client.mjs";
import { trpc } from "../utils/trpc";

const CreateAcct: NextPage = () => {
	return (
		<div className="base">
			<header>
				<title>Sign Up</title>
				<link rel="icon" href="favicon.ico"></link>
			</header>
			<Header
				itemCount={
					trpc.cart.getCart.useQuery({
						cartID: env.NEXT_PUBLIC_DEFAULT_USER,
					}).data?.length ?? 0
				}
			></Header>
		</div>
	);
};

export default CreateAcct;
