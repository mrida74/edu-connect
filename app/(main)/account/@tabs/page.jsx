import PersonalDetails from "./_component/PersonalDetails";
import ContactInfo from "./_component/ContactInfo";
import ChangePassword from "./_component/ChangePassword";
import { auth } from "@/auth";
import { getUserById } from "@/db/quaries/user";

async function Profile() {
	const session = await auth();
	console.log(session?.user);

	if (!session?.user) {
		redirect("/login");
	}
	
	return (
		<>
			<PersonalDetails />
			<div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900 mt-[30px]">
				<div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
					<ContactInfo />
					{/*end col*/}
					<ChangePassword />
					{/*end col*/}
				</div>
				{/*end row*/}
			</div>
		</>
	);
}

export default Profile;
