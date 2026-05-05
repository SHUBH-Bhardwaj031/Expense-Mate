import React from "react";
import {
  FaHome,
  FaPlusCircle,
  FaListUl,
  FaRobot,
} from "react-icons/fa";
import { useState } from "react";
import { Link, useLocation } from "react-router";
import { MdDelete } from "react-icons/md";
import { useAuthContext } from "../context/AuthContext";
import { BiLogOut } from "react-icons/bi";

function SideMenu() {
  const [menuItems, setMenuItems] = useState([
    { name: "Home", icon: <FaHome />, path: "/dashboard" },
    {
      name: "Add Expense",
      icon: <FaPlusCircle />,
      path: "/dashboard/add-expense",
    },
    { name: "View Expense", icon: <FaListUl />, path: "/dashboard/expenses" },
    { name: "Assistant", icon: <FaRobot />, path: "/dashboard/assistant" },
    { name: "Recycle Bin", icon: <MdDelete />, path: "/dashboard/recycle-bin" },
    // { name: "Rohit", icon: <FaUser />, path: "/user" },
    // { name: "Logout", icon: <FaLongArrowAltUp />, path: "/user" },
  ]);

  const { user, accessToken } = useAuthContext();
  console.log(user);
  const location = useLocation();

  const displayName = user?.username || "User";
  const initial = displayName?.charAt(0)?.toUpperCase() || "U";

  // useEffect(() => {
  //   if (user) {
  //     setMenuItems([
  //       ...menuItems,
  //       {
  //         name: user.username,
  //         icon: <FaUser />,
  //         path: "/user",
  //       },
  //       {
  //         name: "Logout",
  //         icon: <BiUserCheck />,
  //         path: "/user",
  //       },
  //     ]);
  //   }
  // }, [user]);

  return (
    <div className="fixed top-16 h-[calc(100vh-4rem)] w-64 bg-gradient-to-b from-gray-950/90 to-gray-900/90 backdrop-blur-xl text-white border-r border-white/10 shadow-xl flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex-col   justify-between gap-5">
          {/* Brand */}
          <div className="flex items-center   gap-3 min-w-0">
            <div className="h-9 w-9 rounded-lg bg-white/10 grid place-items-center ring-1 ring-white/15">
              <span className="text-lg">₹</span>
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold leading-tight">Smart Expense</div>
              <div className="text-[11px] text-gray-400 leading-tight">Track and manage spending</div>
            </div>
          </div>

          {/* User chip */}
          <div className="inline-flex  mt-3 items-center gap-2 rounded-full bg-white/5 px-2.5 py-1.5 ring-1 ring-white/10">
            <div className="h-6 w-6 rounded-full bg-white/10 grid place-items-center text-[11px] font-bold">
              {initial}
            </div>
            <span className="text-xs text-gray-200 max-w-[7rem] truncate">{displayName}</span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={index}
              to={item.path}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
              ${
             isActive
  ? "bg-white/20 text-white ring-1 ring-white/30 shadow-inner"
  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className={`h-9 w-9 rounded-md grid place-items-center ${
                isActive ? "bg-white/15" : "bg-white/5"
              } text-lg`}>
                {item.icon}
              </span>
              <span className="text-sm font-medium truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-white/10">
        <Link
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition"
        >
          <span className="h-9 w-9 rounded-md grid place-items-center bg-white/5">
            <BiLogOut />
          </span>
          <span className="text-sm font-medium">Logout</span>
        </Link>
      </div>
    </div>
  );
}

export default SideMenu;
