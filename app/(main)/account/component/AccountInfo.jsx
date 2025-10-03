import { auth } from "@/auth";
import Image from "next/image"
import { redirect } from "next/navigation";

async function AccountInfo() {
    const  session = await auth();
    if (!session?.user) {
        redirect('/login');
    }
  return (
    <div className="profile-pic text-center mb-5">
            <input
              id="pro-img"
              name="profile-image"
              type="file"
              className="hidden"
            />
            <div>
              <div className="relative size-28 mx-auto">
                <Image
                  src={session?.user?.image || '/assets/images/profile.jpg'}
                  className="rounded-full shadow dark:shadow-gray-800 ring-4 ring-slate-50 dark:ring-slate-800"
                  id="profile-banner"
                  alt="profile-image"
                  width={112}
                  height={112}
                />
                <label
                  className="absolute inset-0 cursor-pointer"
                  htmlFor="pro-img"
                />
              </div>
              <div className="mt-4">
                <h5 className="text-lg font-semibold">{session?.user?.name}</h5>
                <p className="text-slate-400">{session?.user?.email}</p>
              </div>
            </div>
          </div>
  )
}

export default AccountInfo