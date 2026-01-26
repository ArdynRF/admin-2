"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HomeIcon,
  ShoppingBagIcon,
  SwatchIcon,
  UsersIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "../icons";
import { Button } from "../ui/Button";
import { LogoutIcon } from "../icons";
import { logoutUser } from "@/actions/authActions";
import { usePathname } from "next/navigation";

export default function Sidebar({ userData }) {
  const pathname = usePathname();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default false untuk mobile

  const menuItems = [
    { text: "Dashboard", url: "/", icon: <HomeIcon /> },
    { text: "Users", url: "/users", icon: <UsersIcon /> },
    { text: "Products", url: "/products", icon: <ShoppingBagIcon /> },
    { text: "Negotiate", url: "/negotiate", icon: <SwatchIcon /> },
  ];

  const categoryItems = [
    { text: "Product Type", url: "/product-type", icon: <SwatchIcon /> },
    { text: "Technic", url: "/technic", icon: <SwatchIcon /> },
    { text: "Pattern", url: "/pattern", icon: <SwatchIcon /> },
    { text: "Style", url: "/style-type", icon: <SwatchIcon /> },
  ];

  const isActive = (url) => {
    if (url === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(url);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 border-2 bg-white rounded-md border-gray-200 shadow-lg text-gray-500 focus:bg-blue-500 focus:outline-none focus:text-white fixed top-4 left-4 z-50 lg:hidden"
      >
        <svg
          className="w-5 h-5 fill-current"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>

      {/* Desktop Sidebar - TANPA fixed/absolute */}
      <div className="hidden lg:block h-full sticky top-0">
        <div className="bg-white h-screen shadow-xl px-4 py-6 w-full overflow-y-auto">
          <div className="space-y-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <h1 className="font-bold text-3xl text-gray-800 mb-1">
                eStore<span className="text-blue-600">.</span>
              </h1>
              <p className="text-sm text-gray-500">B2B E-Commerce Platform</p>
            </div>

            {/* Profile Section */}
            <div className="space-y-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center space-x-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src="/user.svg"
                    alt="User Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-lg text-gray-800">
                    {userData.userName}
                  </h2>
                  <p className="text-sm text-gray-600">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {userData.userType}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex flex-col space-y-2">
              {menuItems.map((menuItem) => (
                <Link
                  key={menuItem.text}
                  href={menuItem.url}
                  className={`text-base font-medium py-3 px-4 rounded-lg transition-all duration-200 ease-in-out flex items-center ${
                    isActive(menuItem.url)
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md"
                  }`}
                >
                  <span className="mr-4 text-xl">{menuItem.icon}</span>
                  <span className="font-medium">{menuItem.text}</span>
                  {isActive(menuItem.url) && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              ))}

              {/* Categories Dropdown */}
              <div className="mt-4">
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className={`w-full text-base font-medium py-3 px-4 rounded-lg transition-all duration-200 ease-in-out flex items-center justify-between ${
                    categoriesOpen
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-4 text-xl">
                      <SwatchIcon />
                    </span>
                    <span className="font-medium">Categories</span>
                  </div>
                  <span className="text-blue-600">
                    {categoriesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  </span>
                </button>

                {/* Dropdown Content */}
                {categoriesOpen && (
                  <div className="ml-6 mt-2 space-y-2 border-l-2 border-blue-200 pl-4 py-2">
                    {categoryItems.map((item) => (
                      <Link
                        key={item.text}
                        href={item.url}
                        className={`text-sm font-medium py-2.5 px-4 rounded-md transition-all duration-150 ease-in-out flex items-center ${
                          isActive(item.url)
                            ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 font-semibold"
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        <span className="mr-3 text-lg">{item.icon}</span>
                        <span>{item.text}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <div className="pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={() => logoutUser()}
                className="w-full text-base font-medium text-gray-700 py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200 ease-in-out flex items-center justify-center group shadow-sm hover:shadow-md"
              >
                <span className="mr-3 text-xl group-hover:text-red-600">
                  <LogoutIcon className="h-6 w-6" />
                </span>
                <span className="font-medium group-hover:text-red-600">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="fixed left-0 top-0 h-full w-72 bg-white shadow-xl z-50 lg:hidden overflow-y-auto">
            <div className="p-6">
              {/* Mobile Sidebar Content - sama dengan desktop tapi tanpa logo besar */}
              <div className="mb-8">
                <h1 className="font-bold text-2xl text-gray-800">
                  eStore<span className="text-blue-600">.</span>
                </h1>
              </div>

              {/* Profile Section Mobile */}
              <div className="space-y-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <Image
                      src="/user.svg"
                      alt="User Avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-lg text-gray-800">
                      {userData.userName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {userData.userType}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Items */}
              <div className="flex flex-col space-y-2">
                {menuItems.map((menuItem) => (
                  <Link
                    key={menuItem.text}
                    href={menuItem.url}
                    onClick={() => setSidebarOpen(false)}
                    className={`text-base font-medium py-3 px-4 rounded-lg transition-all duration-200 ease-in-out flex items-center ${
                      isActive(menuItem.url)
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md"
                    }`}
                  >
                    <span className="mr-4 text-xl">{menuItem.icon}</span>
                    <span className="font-medium">{menuItem.text}</span>
                  </Link>
                ))}

                {/* Categories Dropdown Mobile */}
                <div className="mt-4">
                  <button
                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                    className={`w-full text-base font-medium py-3 px-4 rounded-lg transition-all duration-200 ease-in-out flex items-center justify-between ${
                      categoriesOpen
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-md"
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-4 text-xl">
                        <SwatchIcon />
                      </span>
                      <span className="font-medium">Categories</span>
                    </div>
                    <span className="text-blue-600">
                      {categoriesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </span>
                  </button>

                  {categoriesOpen && (
                    <div className="ml-6 mt-2 space-y-2 border-l-2 border-blue-200 pl-4 py-2">
                      {categoryItems.map((item) => (
                        <Link
                          key={item.text}
                          href={item.url}
                          onClick={() => setSidebarOpen(false)}
                          className={`text-sm font-medium py-2.5 px-4 rounded-md transition-all duration-150 ease-in-out flex items-center ${
                            isActive(item.url)
                              ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 font-semibold"
                              : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                          }`}
                        >
                          <span className="mr-3 text-lg">{item.icon}</span>
                          <span>{item.text}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Logout Button Mobile */}
              <div className="pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    logoutUser();
                    setSidebarOpen(false);
                  }}
                  className="w-full text-base font-medium text-gray-700 py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200 ease-in-out flex items-center justify-center group shadow-sm hover:shadow-md"
                >
                  <span className="mr-3 text-xl group-hover:text-red-600">
                    <LogoutIcon className="h-6 w-6" />
                  </span>
                  <span className="font-medium group-hover:text-red-600">
                    Logout
                  </span>
                </button>
              </div>

              {/* Close Button Mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="mt-8 w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close Menu
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
