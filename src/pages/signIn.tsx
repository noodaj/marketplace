import { NextPage } from "next";
import { signIn } from "next-auth/react";
import Router from "next/router";
import { FormEventHandler, useRef, useState } from "react";
import { Header } from "../components/header";
import { env } from "../env/client.mjs";
import { trpc } from "../utils/trpc";

const SignIn: NextPage = () => {
	const userRef = useRef<HTMLInputElement>(null);
	const passRef = useRef<HTMLInputElement>(null);
	const [invalidCred, showInvalidCred] = useState<boolean>(false);
	const auth: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		const user = await signIn("credentials", {
			username: userRef.current?.value,
			password: passRef.current?.value,
			redirect: false,
			callbackUrl: "/",
		});

		if (user?.error === "CredentialsSignin") {
			showInvalidCred(true);
		} else {
			Router.push("/");
		}
	};

	return (
		<div className="base">
			<header>
				<title>Log In</title>
				<link rel="icon" href="favicon.ico"></link>
			</header>
			<Header
				itemCount={
					trpc.cart.getCart.useQuery({
						cartID: env.NEXT_PUBLIC_DEFAULT_USER,
					}).data?.length ?? 0
				}
			></Header>
			<div className="m-auto my-48 flex w-64 flex-col items-center justify-center gap-5 rounded-md border-2 border-black bg-white py-11">
				<h1 className="text-2xl font-semibold">Login</h1>
				{invalidCred && (
					<p className="text-red-600">Invalid credentials</p>
				)}
				<form className="flex flex-col gap-4" onSubmit={auth}>
					<input
						className="rounded-md border-2 border-slate-400 px-2"
						type="user"
						placeholder="Username"
						ref={userRef}
					></input>
					<input
						className="rounded-md border-2 border-slate-400 px-2"
						type="password"
						placeholder="*********"
						ref={passRef}
					></input>
					<input
						type="submit"
						value="Login"
						className="rounded-md border-2 border-slate-400 hover:cursor-pointer"
					></input>
				</form>
			</div>
		</div>
	);
};

export default SignIn;
