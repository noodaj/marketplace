import { FC } from "react";

export const Delivery: FC = () => {
	return (
		<div className="col-span-2 text-xl mb-5">
			Delivery
			<div className="grid grid-cols-2 gap-5">
				<div className="flex max-w-sm items-center justify-between">
					<p className="text-base">FedEx Fast Delivery</p>
					<input type={"checkbox"}></input>
				</div>
				<div className="flex max-w-sm items-center justify-between">
					<p className="text-base">UPS Delivery</p>
					<input type="checkbox"></input>
				</div>
			</div>
		</div>
	);
};
