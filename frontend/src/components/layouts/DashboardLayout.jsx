import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "./../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import ProfileEditModal from "../ProfileEditModal";

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext);
    const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);

    return (
        <div className="">
            <Navbar
                activeMenu={activeMenu}
                onProfileEdit={() => setIsProfileEditOpen(true)}
            />

            {user && (
                <div className="flex">
                    <div className="max-[1080px]:hidden">
                        <SideMenu
                            activeMenu={activeMenu}
                            onProfileEdit={() => setIsProfileEditOpen(true)}
                        />
                    </div>
                    <div className="grow mx-5">{children}</div>
                </div>
            )}

            {/* ProfileEditModal خارج SideMenu ليظهر في الموبايل */}
            <ProfileEditModal
                isOpen={isProfileEditOpen}
                onClose={() => setIsProfileEditOpen(false)}
            />
        </div>
    );
};

export default DashboardLayout;
