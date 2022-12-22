import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

type HeaderProp = {
	itemCount: number;
};

type UserProps = {
	userName: string;
	pfp: string;
};
export const Header = ({ itemCount }: HeaderProp) => {
	const {data: session} = useSession()
	return (
		<>
			<div className="relative px-32">
				<div className="top-3 flex flex-row justify-between py-5">
					<div className="flex flex-row gap-5 text-xl">
						<Link href="/">
							<h3>Clothing</h3>
						</Link>
						<a href="">New</a>
						<a href="">Special Offers</a>
					</div>

					<div className="flex flex-row">
						<div className="flex flex-row px-8 hover:cursor-pointer">
							<Link href="/cart">
								<img
									className="px-2"
									src="shoppingCart.png"
									alt="shoppingCart image"
								></img>
							</Link>

							<div className="flex h-0.5 flex-col">
								<p>
									My <Link href="/cart">Cart</Link>
								</p>
								<Link href="/cart">{`${itemCount} items`}</Link>
							</div>
						</div>

						{session
							? user({
									userName: "test",
									pfp: "profilePic.png",
							  })
							: guest()}
					</div>
				</div>
			</div>
		</>
	);
};

const user = ({ userName, pfp }: UserProps) => {
	return (
		<div className="flex flex-row gap-5">
			<div className="flex items-center justify-center gap-4">
				<h1>Welcome {userName}</h1>
				<img className="h-10 w-10 rounded-full " src={pfp}></img>
			</div>
		</div>
	);
};
const guest = () => {
	return (
		<div className="flex flex-row gap-5">
			<Link href="/createAcct">
				<button
					type="button"
					className="rounded-lg bg-blue-400 p-2 px-5 text-white"
				>
					Sign Up
				</button>
			</Link>
			<Link href="/signin">
				<button
					type="button"
					className="rounded-lg bg-blue-500 p-2 px-5 text-white"
				>
					Log In
				</button>
			</Link>
		</div>
	);
};
