type Props = {
	name: string;
	price: Number;
	image: string;
};

export const Item = ({name, price, image}: Props) => {
	return (
		<div className="bg-stone-300 rounded-md max-w-xs">
			<div className="flex flex-row gap-3 p-3">
                <p>{name}</p>
                <p>{`$${price.toFixed(2)}`}</p>
            </div>
		</div>
	);
};
