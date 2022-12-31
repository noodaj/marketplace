import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Router from "next/router";
import { FormEvent, useRef, useState } from "react";
import { Header } from "../components/header";
import { env } from "../env/client.mjs";
import { trpc } from "../utils/trpc";

type curItemObj = {
	itemID: string | null;
	quantity: number;
};

const CreateAcct: NextPage = () => {
	const { data: session } = useSession();
	const userName = useRef<HTMLInputElement>(null);
	const password = useRef<HTMLInputElement>(null);
	const name = useRef<HTMLInputElement>(null);
	const [errorModal, setErrorModal] = useState<boolean>(false);
	const [items, setItems] = useState<curItemObj[] | undefined>([]);
	const createMutation = trpc.auth.createUser.useMutation();

	trpc.cart.getCart.useQuery(
		{ cartID: session?.userID ?? env.NEXT_PUBLIC_DEFAULT_USER },
		{
			onSuccess(data) {
				const curData = data?.map((item) => {
					const { itemID, quantity } = item;
					const test: curItemObj = {
						itemID: itemID,
						quantity: quantity,
					};
					return test;
				});

				setItems(curData);
			},
		}
	);

	const createUser = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		createMutation.mutate(
			{
				name: name.current?.value!,
				username: userName.current?.value!,
				password: password.current?.value!,
				items: items,
			},
			{
				onError(error) {
					console.log(error.data?.stack);
				},
				onSuccess() {
					Router.push("/");
				},
			}
		);
	};
	return (
		<div className="base h-screen">
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
			<form
				className="m-auto flex max-w-sm flex-col items-center rounded-md bg-stone-200 p-10"
				onSubmit={(e) => createUser(e)}
			>
				{errorModal && <p>Hello</p>}
				<div className="flex flex-col gap-2">
					<label>
						Name:
						<input
							type="text"
							className="paymentInput"
							ref={name}
							required
						></input>
					</label>
					<label>
						Username:
						<input
							type="text"
							className="paymentInput"
							ref={userName}
							required
						></input>
					</label>
					<label>
						Password:
						<input
							type="text"
							className="paymentInput"
							ref={password}
							required
						></input>
					</label>
				</div>
				<button className="mt-3 rounded-md bg-sky-400 p-2 hover:cursor-pointer">
					Create Account
				</button>
			</form>
		</div>
	);
};

export default CreateAcct;
