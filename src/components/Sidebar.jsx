import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Candidates", path: "/candidates" },
    { name: "Interviews", path: "/interviews" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    // hidden on small screens, show on md and larger; sticky for scroll
    <aside className="hidden md:block w-64 fixed h-screen shadow-md p-6 overflow-y-auto">
      <h1 className="text-xl font-bold mb-10">Interview System</h1>

      {menu.map((item) => (
        <Link key={item.path} to={item.path}>
          <div
            className={`p-3 rounded-lg mb-3 cursor-pointer ${
              pathname === item.path ? "bg-blue-100" : "hover:bg-base-200"}
              ${pathname === item.path ? "text-base-content" : "hover-text-base-content"}
              `}
          >
            {item.name}
          </div>
        </Link>
      ))}
    </aside>
  );
}