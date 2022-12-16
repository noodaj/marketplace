import { Item } from "@prisma/client";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { Modal } from "../components/modal";
import { trpc } from "../utils/trpc";

const AdminPage: NextPage = () => {
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [items, setItems] = useState<Item[]>([]);

    const deleteItem = trpc.items.deleteItem.useMutation();
	const getItems = trpc.items.getAllItems.useQuery();

    const removeItem = () => {

    }

	useEffect(() => {
		if (getItems.data) {
			setItems(getItems.data);
		}
	}, [getItems.data]);

	return (
		<>
            {openModal && <Modal setState={setOpenModal}></Modal>}
			<div className="base p-10">
                <div className="flex flex-row justify-between">
				    <h1 className="text-3xl font-semibold">Items in Inventory</h1>
                    <button type='button' onClick={() => setOpenModal(true)}>Add New Item</button>
                </div>
				{items.map((item) => (
					<div className="flex flex-row justify-between">
						<p>{`Name: ${item.name} Quantity: ${item.quantity}`}</p>
                        <button onClick={removeItem}>Button</button>
					</div>
				))}
			</div>
		</>
	);
};

export default AdminPage;
