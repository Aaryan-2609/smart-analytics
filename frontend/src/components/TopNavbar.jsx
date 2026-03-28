import React, { useState } from "react";
import {
  IconMenu2,
  IconX,
  IconBrandTabler,
  IconUpload,
  IconHistory,
  IconShieldCheck,
  IconLogout,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const TopNavbar = ({ username = "Rajat" }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Dashboard", href: "/dashboard", icon: <IconBrandTabler size={20} /> },
    { label: "Upload", href: "/upload", icon: <IconUpload size={20} /> },
    { label: "History", href: "/history", icon: <IconHistory size={20} /> },
    { label: "Admin", href: "/admin", icon: <IconShieldCheck size={20} /> },
    { label: "Logout", href: "/login", icon: <IconLogout size={20} /> },
  ];

  return (
    <>
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 z-50 w-full bg-neutral-900 text-white px-4 h-14 flex items-center justify-between shadow border-b border-neutral-800">
        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:text-purple-400"
          >
            {mobileMenuOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
          </button>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => navigate(link.href)}
              className="flex items-center gap-1 text-sm text-white hover:text-purple-400 transition"
              title={link.label}
            >
              {link.icon}
              <span className="hidden xl:inline">{link.label}</span>
            </button>
          ))}
        </div>

        {/* Right Avatar */}
        <div className="flex items-center gap-2">
          <span className="text-sm hidden sm:inline text-purple-300">
            Welcome, <span className="font-semibold text-white">{username}</span>
          </span>
          <img
            src={`https://ui-avatars.com/api/?name=${username}&background=7e22ce&color=fff`}
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-14 left-0 w-full bg-neutral-900 z-40 border-b border-neutral-800 flex flex-col text-sm text-white shadow-lg">
          {navLinks.map((link, idx) => (
            <button
              key={idx}
              onClick={() => {
                navigate(link.href);
                setMobileMenuOpen(false); // close menu on click
              }}
              className="w-full px-6 py-3 text-left hover:bg-neutral-800 flex items-center gap-3"
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default TopNavbar;
