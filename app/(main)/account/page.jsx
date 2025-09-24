import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();
  
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Name</label>
                <p className="text-lg">{session.user?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-lg">{session.user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Role</label>
                <p className="text-lg capitalize">{session.user?.role}</p>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Account Status</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium">
                  {new Date(session.user?.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Courses</span>
                <span className="font-medium">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a 
              href="/courses" 
              className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-blue-600 font-medium">Browse Courses</div>
              <div className="text-sm text-gray-600 mt-1">Explore available courses</div>
            </a>
            
            <a 
              href="/account/profile" 
              className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-green-600 font-medium">Edit Profile</div>
              <div className="text-sm text-gray-600 mt-1">Update your information</div>
            </a>
            
            <a 
              href="/account/courses" 
              className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-purple-600 font-medium">My Courses</div>
              <div className="text-sm text-gray-600 mt-1">View enrolled courses</div>
            </a>
            
            <a 
              href="/account/settings" 
              className="bg-orange-50 hover:bg-orange-100 p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-orange-600 font-medium">Settings</div>
              <div className="text-sm text-gray-600 mt-1">Account preferences</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}