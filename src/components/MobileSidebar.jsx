import { Link, useLocation } from "react-router-dom";

export default function MobileSidebar({ isOpen, onClose }) {
  const { pathname } = useLocation();

  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Candidates", path: "/candidates" },
    { name: "Interviews", path: "/interviews" },
    { name: "Upcoming Interviews", path: "/upcoming-interviews" },
    { name: "Settings", path: "/settings" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-white" onClick={onClose}></div>
      <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl p-6 overflow-y-auto">
        <button
          className="btn btn-ghost btn-sm mb-4"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          Close
        </button>
        <h1 className="text-xl font-bold mb-6">Interview System</h1>
        {menu.map((item) => (
          <Link key={item.path} to={item.path} onClick={onClose}>
            <div
              className={`p-3 rounded-lg mb-3 cursor-pointer ${
                pathname === item.path ? "bg-blue-100" : "hover:bg-gray-100"
              }
              ${pathname === item.path ? "text-black" : "hover:text-black"}`}
            >
              {item.name}
            </div>
          </Link>
        ))}
      </aside>
    </div>
  );
}
