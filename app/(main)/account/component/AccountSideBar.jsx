import Menu from "./account-menu";
import AccountInfo from "./AccountInfo";

function AccountSideBar() {
  return (
    <div className="lg:w-1/4 md:px-3">
      <div className="relative">
        <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900">
          <AccountInfo />
          <div className="border-t border-gray-100 dark:border-gray-700">
            <Menu />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSideBar;
