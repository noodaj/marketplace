import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import { FormEventHandler, useRef } from "react";
import { Header } from "../components/header";
import { authOptions } from "./api/auth/[...nextauth]";

const SignIn: NextPage = () => {
	const userRef = useRef<HTMLInputElement>(null);
	const passRef = useRef<HTMLInputElement>(null);

	const auth: FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		const user = await signIn("credentials", {
			username: userRef.current?.value,
			password: passRef.current?.value,
			redirect: true,
			callbackUrl: "/",
		});
	};

	return (
		<div className="base">
			<Header itemCount={0}></Header>
			<div className="m-auto my-48 flex w-64 flex-col items-center justify-center gap-5 rounded-md border-2 border-black bg-white py-11">
				<h1 className="text-2xl font-semibold">Login</h1>
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
