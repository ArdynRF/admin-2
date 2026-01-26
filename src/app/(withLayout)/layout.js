import { getUserData } from "@/actions/authActions";
import Sidebar from "@/components/Sidebar";

export default async function WithLayout({ children }) {
  const userData = await getUserData();

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12">
      {/* Sidebar untuk desktop - col-span-3 berarti 3/12 = 25% */}
      <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
        <Sidebar userData={userData} />
      </div>

      {/* Mobile sidebar toggle area */}
      <div className="lg:hidden">
        {/* Mobile toggle button sudah ada di Sidebar component */}
      </div>

      {/* Main content - col-span-9 berarti 9/12 = 75% */}
      <div className="lg:col-span-9 xl:col-span-10">
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
