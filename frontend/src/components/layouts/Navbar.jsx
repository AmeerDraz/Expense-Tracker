import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";

const Navbar = ({ activeMenu, onProfileEdit }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const navigate = useNavigate();
    return (
        <div className="flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
            <button
                className="block min-[1080px]:hidden text-black"
                onClick={() => setOpenSideMenu(!openSideMenu)}
            >
                {openSideMenu ? (
                    <HiOutlineX className="text-2xl" />
                ) : (
                    <HiOutlineMenu className="text-2xl" />
                )}
            </button>
            <h2
                className="text-lg font-medium text-black cursor-pointer select-none"
                onClick={() => navigate("/dashboard")}
            >
                Expense Tracker
            </h2>

            {openSideMenu && (
                <>
                    {/* Overlay للموبايل */}
                    <div
                        className="fixed inset-0 bg-black/20 z-30 min-[1080px]:hidden"
                        onClick={() => setOpenSideMenu(false)}
                    />
                    {/* السايد منيو */}
                    <div className="fixed top-[61px] left-0 bg-white z-40 shadow-lg">
                        <SideMenu
                            activeMenu={activeMenu}
                            onCloseMobile={() => setOpenSideMenu(false)}
                            onProfileEdit={onProfileEdit}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Navbar;
