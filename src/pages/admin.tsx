import { Item, Role } from "@prisma/client";
import { NextPage } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import {
	HiOutlineLockClosed,
	HiOutlinePencil,
	HiOutlineX,
} from "react-icons/hi";
import { EditModal } from "../components/admin/editModal";
import { OpenModal } from "../components/admin/openModal";
import { Header } from "../components/header";
import { trpc } from "../utils/trpc";

const AdminPage: NextPage<{ user: Session }> = ({ user }) => {
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [deletedPopup, setDeletedPopup] = useState<boolean>(false);
	const [editModal, setEditModal] = useState<boolean>(false);
	const [items, setItems] = useState<Item[]>([]);
	const [users, setUsers] = useState<
		{
			id: string;
			userName: string | null;
			role: Role;
		}[]
	>([]);
	const [editItem, setEditItem] = useState<Item>();

	const deleteItem = trpc.items.deleteItem.useMutation();

	trpc.items.getAllItems.useQuery(undefined, {
		onSuccess(data) {
			setItems(data);
		},
	});

	trpc.auth.getUsers.useQuery(undefined, {
		onSuccess(data) {
			setUsers(data);
		},
	});

	const removeItem = (id: string) => {
		deleteItem.mutate(
			{ itemID: id },
			{
				onSuccess(data) {
					setItems(data);
				},
			}
		);
		setDeletedPopup(true);
	};

	const closeModal = () => {
		setTimeout(() => {
			setDeletedPopup(false);
		}, 500);
	};

	return (
		<>
			<header>
				<title>Admin</title>
				<link rel="icon" href="favicon.ico"></link>
			</header>
			<div className="base">
				{user.role === "USER" ? (
					<div className="flex flex-col items-center justify-center">
						<HiOutlineLockClosed className="h-20 w-20" />
						<p>
							You are not allowed to access this page. Please
							contact the admin if this is not the case.
						</p>
						<Link
							href={"/"}
							className="hover: cursor-pointer underline"
						>
							Home Page
						</Link>
					</div>
				) : (
					<>
						{openModal && (
							<OpenModal
								setState={setOpenModal}
								setItems={setItems}
							></OpenModal>
						)}
						{editModal && (
							<EditModal
								setState={setEditModal}
								setItems={setItems}
								item={editItem!}
							></EditModal>
						)}
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
						<Header itemCount={0}></Header>
						<div className="flex flex-row justify-between px-28">
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
						<div className="my-5 rounded-md p-2 px-28">
							{items.map((item) => (
								<div
									className="flex flex-row justify-between"
									key={Math.random() * 100}
								>
									<p>{`Name: ${item.name} Quantity: ${item.quantity} Price: ${item.price}`}</p>
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
						<div className="relative mx-28 w-full lg:max-w-sm">
							<p className="text-2xl">Users</p>
							<select className="w-full appearance-none rounded-md border p-2.5 text-gray-500 shadow-sm outline-none focus:border-indigo-600">
								{users.map((user) => (
									<option>{user.userName}</option>
								))}
							</select>
						</div>
					</>
				)}
			</div>
		</>
	);
};
export default AdminPage;

export async function getServerSideProps(context: any) {
	const session = await getSession(context);
	if (!session) {
		return {
			redirect: {
				destination: "/signIn",
				permanent: false,
			},
		};
	}
	return {
		props: { user: session },
	};
}
