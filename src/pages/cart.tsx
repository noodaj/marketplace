import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { Header } from "../components/header";
import { env } from "../env/client.mjs";
import { trpc } from "../utils/trpc";

const ShoppingCart: NextPage = () => {
	const deleteItem = trpc.cart.deleteItem.useMutation();
	const updateItem = trpc.cart.updateItemCount.useMutation();
	const utils = trpc.useContext();
	const { data: session } = useSession();
	const [checked, setChecked] = useState<boolean>(false);
	const [cartLength, setCartLength] = useState<number>(0);
	const [total, setTotal] = useState<{
		tax: number;
		itemTotal: number;
		overall: number;
	}>({ itemTotal: 0, overall: 0, tax: 0 });
	const quantityRef = useRef<HTMLInputElement>(null);

	const cart = trpc.cart.getCart.useQuery(
		{
			cartID: session?.userID || env.NEXT_PUBLIC_DEFAULT_USER,
		},
		{
			onSuccess(data) {
				setCartLength(data!.length);
				getTotal(data)
			},
		}
	);

	const deleteFn = (itemID: string) => {
		deleteItem.mutate(
			{
				uID: session?.userID || env.NEXT_PUBLIC_DEFAULT_USER,
				itemID: itemID,
			},
			{
				onSuccess(data) {
					utils.cart.getCart.setData(
						{
							cartID:
								session?.userID || env.NEXT_PUBLIC_DEFAULT_USER,
						},
						data.items.flat()
					);
					setCartLength(data.items.length);
				},
			}
		);
	};

	const update = (item: string) => {
		updateItem.mutate(
			{
				itemID: item,
				quantity: Number(quantityRef.current?.value),
				uID: session?.userID ?? env.NEXT_PUBLIC_DEFAULT_USER,
			},
			{
				onSuccess(data) {
					utils.cart.getCart.setData(
						{
							cartID:
								session?.userID ?? env.NEXT_PUBLIC_DEFAULT_USER,
						},
						data.items.flat()
					);
				},
			}
		);
	};

	const getTotal = (data: any) => {
		let itemTotal = 0;
		data?.forEach((item) => {
			itemTotal += item.item!.price * item.quantity;
		});

		let tax = itemTotal * 0.0875;
		let total = itemTotal + Number(tax) + (checked ? 10 : 0);

		console.log({itemTotal,tax, total})
		setTotal({itemTotal: itemTotal, tax: tax, overall: total})
	};

	return (
		<>
			<header>
				<title>Cart</title>
				<link rel="icon" href="favicon.ico"></link>
			</header>
			<div className="base">
				<Header itemCount={cartLength}></Header>
				<div className="mx-32 h-[calc(100%_-_8rem)] rounded-md">
					<h1 className="text-lg">Order</h1>
					<div className="grid grid-cols-3">
						{cart.isSuccess && cart.data!.length > 0 ? (
							<div className="col-span-2 min-h-[30rem] divide-slate-300/80">
								{cart.data?.map((item) => (
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
													type={"text"}
													placeholder={item.quantity.toString()}
													className="w-11 rounded border border-black px-1 outline-0"
													ref={quantityRef}
													onChange={() => {
														update(item.itemID!);
														getTotal();
													}}
												></input>
											</div>
											<HiOutlineTrash
												className="text-2xl hover:cursor-pointer "
												onClick={() => {
													deleteFn(item.itemID!);
													getTotal();
												}}
											/>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="col-span-2 min-h-[30rem] w-96">
								{`Your cart is empty :(`}
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
											{`$${total.itemTotal}`}
										</div>
										<div className="paymentText">
											<p>Additional Services</p>
											{checked ? <>$10.00</> : <>$0.00</>}
										</div>
										<div className="paymentText">
											<p>Tax</p>
											{`$${(total.tax).toFixed(2)}`}
										</div>
										<div className="paymentText">
											<p>Total</p>
											{`$${(total.overall).toFixed(2)}`}
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
												className="rounded-full outline-none hover:cursor-pointer"
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
						<div className="col-span-2  text-xl">
							Delivery
							<div className="grid grid-cols-2">
								<div>
									<p className="text-base">
										FedEx Fast Delivery
									</p>
								</div>
								<div>
									<p className="text-base">UPS Delivery</p>
								</div>
							</div>
						</div>
						<div className="col-span-3 text-xl">Payment</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ShoppingCart;
