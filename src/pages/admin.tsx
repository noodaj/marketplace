import { Item } from "@prisma/client";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { OpenModal } from "../components/openModal";
import { trpc } from "../utils/trpc";
import { HiOutlinePencil, HiOutlineX } from "react-icons/hi";
import { EditModal } from "../components/editModal";

const AdminPage: NextPage = () => {
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [deletedPopup, setDeletedPopup] = useState<boolean>(false);
	const [editModal, setEditModal] = useState<boolean>(false);
	const [editItem, setEditItem] = useState<Item>();
	const [items, setItems] = useState<Item[]>([]);

	const deleteItem = trpc.items.deleteItem.useMutation({
		onSuccess(data) {
			setItems((prev) => prev.filter((item) => item.id !== data.id));
		},
	});

	const getItems = trpc.items.getAllItems.useQuery();
	const removeItem = (id: string) => {
		deleteItem.mutate({ itemID: id });
		setDeletedPopup(true);
	};

	const closeModal = () => {
		setTimeout(() => {
			setDeletedPopup(false);
		}, 500);
	};

	useEffect(() => {
		if (getItems.data) {
			setItems(getItems.data);
		}
	}, [getItems.data]);

	return (
		<>
			<header>
				<title>Admin</title>
				<link rel="icon" href="favicon.ico"></link>
			</header>
			{openModal && (
				<OpenModal
					setState={setOpenModal}
					setItems={setItems}
					items={items}
				></OpenModal>
			)}
			{editModal && (
				<EditModal
					setState={setEditModal}
					setItems={setItems}
					items={items}
					item={editItem!}
				></EditModal>
			)}
			<div className="base p-10">
				{deletedPopup && (
					<div
						className="absolute inset-0 mx-auto my-5 flex max-h-10 max-w-xs justify-center rounded-md bg-white p-2 align-middle"
						onClick={() => closeModal()}
					>
						<p className="text-lg font-medium">
							Item has been successfully deleted!
						</p>
					</div>
				)}
				<div className="flex flex-row justify-between">
					<h1 className="text-3xl font-semibold">
						Items in Inventory
					</h1>
					<button
						type="button"
						onClick={() => setOpenModal(true)}
						className="rounded-md bg-blue-400 p-2 text-xl"
					>
						Add New Item
					</button>
				</div>
				<div className="my-5 rounded-md p-2">
					{items.map((item) => (
						<div
							className="flex flex-row justify-between"
							key={Math.random() * 100}
						>
							<p>{`Name: ${item.name} Quantity: ${item.quantity}`}</p>
							<div className="flex items-center gap-2">
								<HiOutlinePencil
									className="text-xl hover:cursor-pointer"
									onClick={() => {
										setEditItem(item);
										setEditModal(true);
									}}
								/>
								<HiOutlineX
									className="text-2xl text-red-500 hover:cursor-pointer"
									onClick={() => {
										removeItem(item.id);
									}}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default AdminPage;
