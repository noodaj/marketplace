export const Header = () => {
	return (
		<>
			<div className="relative px-32">
				<div className="flex flex-row justify-between top-3 py-5">
					<div className="flex flex-row gap-5">
						<h3>Clothing</h3>
						<a href="">New</a>
						<a href="">Special Offers</a>
					</div>

					<div className="flex flex-row gap-5">
						{/*<img src = {`${image}`} alt = "shoppingCart image"></img>*/}
						<div className="flex h-0.5 flex-col px-8">
							<p>My Cart</p>
							<p>{`test`}</p>
						</div>
						<button
							type="button"
							className="rounded-lg bg-blue-400 p-1 px-5 text-blue-900"
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
		</>
	);
};
