import Link from "next/link";

type HeaderProp = {
	itemCount: number;
};
export const Header = ({ itemCount }: HeaderProp) => {
	return (
		<>
			<div className="relative px-32">
				<div className="top-3 flex flex-row justify-between py-5">
					<div className="flex flex-row gap-5 text-xl">
						<Link href="/"><h3>Clothing</h3></Link>
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
						<div className="flex flex-row gap-5">
							<button
								type="button"
								className="rounded-lg bg-blue-400 p-1 px-5 text-white"
							>
								Sign Up
							</button>
							<button
								type="button"
								className="rounded-lg bg-blue-500 p-1 px-5 text-white"
							>
								Log In
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
