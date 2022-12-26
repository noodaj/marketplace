import { Item } from "@prisma/client";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { Header } from "../components/header";
import { env } from "../env/client.mjs";
import { trpc } from "../utils/trpc";

const ShoppingCart: NextPage = () => {
	const { data: session } = useSession();
	const [checked, setChecked] = useState<boolean>(false);
	const [curItem, setItems] = useState<Item[]>([]);
	const items = trpc.cart.getCart.useQuery(
		{
			cartID: session?.userID || env.NEXT_PUBLIC_DEFAULT_USER,
		},
		{
			onSuccess(data) {
				data?.forEach((item) => {
					setItems([...curItem, item.item!]);
					console.log(item)
				});
			},
		}
	);

	let getTotal = () => {
		let itemTotal = 0;
		items.data?.forEach((item) => {
			itemTotal += item.item!.price * item.quantity;
		});

		let tax = Number((itemTotal * 0.0875).toFixed(2));
		let total = itemTotal + tax + (checked ? 10 : 0);
		return { itemTotal, tax, total };
	};

	let deleteItem = () => {};
	return (
		<>
			<div className="base">
				<Header></Header>
				<div className="mx-32 h-[calc(100%_-_8rem)] rounded-md">
					<h1 className="text-lg">Order</h1>
					<div className="grid grid-cols-3">
						{items.isSuccess && (
							<div className="col-span-2 min-h-[30rem] divide-slate-300/80">
								{items.data?.map((item) => (
									<div
										key={Math.random() * 100}
										className="grid max-w-7xl grid-cols-2 p-4"
									>
										<div className="flex items-center gap-5">
											<img
												src={item.item?.image!}
												className="h-24 w-28 rounded-md border-2 border-gray-400"
											></img>
											<p>{item.item?.name}</p>
										</div>
										<div className="flex items-center justify-center gap-5">
											<p>{`$${item.item?.price}`}</p>
											<div className="flex items-center justify-center gap-2">
												<p className="text-sm text-gray-400">
													Quantity:
												</p>
												<input
													type={"number"}
													placeholder={item.quantity.toString()}
													className="w-11 rounded border border-black px-1 outline-0"
												></input>
											</div>
											<HiOutlineTrash
												className="text-2xl hover:cursor-pointer "
												onClick={deleteItem}
											/>
										</div>
									</div>
								))}
							</div>
						)}
						<div className="col-span-1">
							<h1 className="text-xl">Payment Summary</h1>
							<div className="grid grid-rows-3 gap-7 divide-y divide-slate-300/80">
								<div className="row-span-2 flex flex-col">
									{session ? (
										<p className="text-center text-lg">
											Welcome {session.user?.name}
										</p>
									) : (
										<p className="text-center text-lg">
											Unregistered Account
										</p>
									)}
									<div className="flex flex-col gap-2">
										<div className="paymentText">
											<p>Order Summary</p>
											{`$${getTotal().itemTotal}`}
										</div>
										<div className="paymentText">
											<p>Additional Services</p>
											{checked ? <>$10.00</> : <>$0.00</>}
										</div>
										<div className="paymentText">
											<p>Tax</p>
											{`$${getTotal().tax}`}
										</div>
										<div className="paymentText">
											<p>Total</p>
											{`$${getTotal().total}`}
										</div>
									</div>
								</div>
								<div className="col-span-1 row-span-1 flex flex-col gap-2">
									<h1 className="text-xl">
										Additional Services
									</h1>
									<div className="paymentText flex justify-between">
										<p>2 Day Shipping</p>
										<div className="flex gap-1">
											<p>$10.00</p>
											<input
												type={"checkbox"}
												className="rounded-md outline-none hover:cursor-pointer"
												defaultChecked={false}
												onChange={() =>
													setChecked(!checked)
												}
											></input>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-span-2 text-xl">Delivery</div>
						<div className="col-span-3 text-xl">Payment</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ShoppingCart;
