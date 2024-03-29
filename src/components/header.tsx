import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FC, useState } from "react";

type Props = {
	itemCount: number;
};
export const Header: FC<Props> = ({ itemCount }) => {
	const { data: session } = useSession();
	const [showDropdown, setDropdown] = useState<boolean>(false);

	return (
		<>
			<div className="relative px-32">
				<div className="top-3 flex flex-row justify-between py-5">
					<div className="flex flex-row gap-5 text-xl">
						<Link href="/">
							<h3>Clothing</h3>
						</Link>
					</div>
					<div className="flex flex-row">
						{session ? (
							<>
								<Link href="/cart">
									<div className="flex flex-row px-8 hover:cursor-pointer">
										<img
											className="px-2"
											src="shoppingCart.png"
											alt="shoppingCart image"
										></img>
										<div className="flex h-0.5 flex-col">
											<p>My Cart</p>
											<>{`${itemCount} items`}</>
										</div>
									</div>
								</Link>
								<div className="flex flex-row gap-5 ">
									<div className="hover: flex cursor-pointer items-center justify-center gap-4">
										<img
											className="h-10 w-10 rounded-full "
											src={
												session.user?.image!
											}
											onClick={() =>
												setDropdown(!showDropdown)
											}
										></img>
									</div>
									{showDropdown && (
										<div className="absolute right-28 my-12 flex h-14 flex-col justify-center rounded-md bg-sky-400 p-3">
											{session.role === "ADMIN" && (
												<Link href={"/admin"}>
													Admin Dashboard
												</Link>
											)}
											<div
												className="hover:cursor-pointer"
												onClick={() => signOut()}
											>
												Logout
											</div>
										</div>
									)}
								</div>
							</>
						) : (
							<>
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
								<div className="flex flex-row gap-5">
									<Link href="/signUp">
										<button
											type="button"
											className="rounded-lg bg-blue-400 p-2 px-5 text-white"
										>
											Sign Up
										</button>
									</Link>
									<Link href="/signIn">
										<button
											type="button"
											className="rounded-lg bg-blue-500 p-2 px-5 text-white"
										>
											Log In
										</button>
									</Link>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
};
