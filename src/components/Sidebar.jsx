import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Candidates", path: "/candidates" },
    { name: "Interviews", path: "/interviews" },
    { name: "Upcoming Interviews", path: "/upcoming-interviews" }, 
    { name: "Settings", path: "/settings" },
  ];

  return (
    <aside className="hidden md:block w-64 fixed h-screen shadow-md p-6 overflow-y-auto bg-white">
      <h1 className="text-xl font-bold mb-10">Interview System</h1>

      {menu.map((item) => (
        <Link key={item.path} to={item.path}>
          <div
            className={`p-3 rounded-lg mb-3 cursor-pointer ${
              pathname === item.path
                ? "bg-base-200 font-semibold"
                : "hover:bg-blue-50"
            }`}
          >
            {item.name}
          </div>
        </Link>
      ))}
    </aside>
  );
}