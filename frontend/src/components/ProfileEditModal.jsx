// import React, { useState, useContext, useRef } from "react";
// import Modal from "./Modal";
// import Input from "./Inputs/Input";
// import { UserContext } from "../context/userContext";
// import axiosInstance from "../utils/axiosInstance";
// import { API_PATHS } from "../utils/apiPaths";
// import toast from "react-hot-toast";
// import { LuUser, LuUpload, LuTrash, LuEye, LuEyeOff } from "react-icons/lu";

// const ProfileEditModal = ({ isOpen, onClose }) => {
//     const { user, updateUser } = useContext(UserContext);
//     const inputRef = useRef(null);

//     const [formData, setFormData] = useState({
//         fullName: user?.fullName || "",
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//     });

//     const [profileImage, setProfileImage] = useState(null);
//     const [previewUrl, setPreviewUrl] = useState(user?.profileImageUrl || null);
//     const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//     const [showNewPassword, setShowNewPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [errors, setErrors] = useState({});

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));

//         // Clear error when user starts typing
//         if (errors[name]) {
//             setErrors((prev) => ({
//                 ...prev,
//                 [name]: "",
//             }));
//         }
//     };

//     const handleImageChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             setProfileImage(file);
//             const preview = URL.createObjectURL(file);
//             setPreviewUrl(preview);
//         }
//     };

//     const handleRemoveImage = () => {
//         setProfileImage(null);
//         setPreviewUrl(null);
//     };

//     const onChooseFile = () => {
//         inputRef.current.click();
//     };

//     const validateForm = () => {
//         const newErrors = {};

//         if (!formData.fullName.trim()) {
//             newErrors.fullName = "Full name is required";
//         }

//         if (formData.newPassword) {
//             if (!formData.currentPassword) {
//                 newErrors.currentPassword =
//                     "Current password is required to change password";
//             }
//             if (formData.newPassword.length < 6) {
//                 newErrors.newPassword =
//                     "New password must be at least 6 characters";
//             }
//             if (formData.newPassword !== formData.confirmPassword) {
//                 newErrors.confirmPassword = "Passwords do not match";
//             }
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const uploadImage = async (imageFile) => {
//         const formData = new FormData();
//         formData.append("image", imageFile);

//         try {
//             const response = await axiosInstance.post(
//                 API_PATHS.IMAGE.UPLOAD_IMAGE,
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 }
//             );
//             return response.data.imageUrl;
//         } catch (error) {
//             throw new Error("Failed to upload image");
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) {
//             return;
//         }

//         setIsLoading(true);

//         try {
//             let profileImageUrl = user?.profileImageUrl;

//             // Upload new image if selected
//             if (profileImage) {
//                 profileImageUrl = await uploadImage(profileImage);
//             } else if (previewUrl === null) {
//                 // User removed the image
//                 profileImageUrl = null;
//             }

//             const updateData = {
//                 fullName: formData.fullName,
//                 profileImageUrl,
//             };

//             // Add password data if user wants to change password
//             if (formData.newPassword) {
//                 updateData.currentPassword = formData.currentPassword;
//                 updateData.newPassword = formData.newPassword;
//             }

//             const response = await axiosInstance.put(
//                 API_PATHS.AUTH.UPDATE_PROFILE,
//                 updateData
//             );

//             // Update user context with new data
//             updateUser(response.data.user);

//             toast.success("Profile updated successfully!");
//             onClose();

//             // Reset form
//             setFormData({
//                 fullName: response.data.user.fullName,
//                 currentPassword: "",
//                 newPassword: "",
//                 confirmPassword: "",
//             });
//             setProfileImage(null);
//             setPreviewUrl(response.data.user.profileImageUrl || null);
//         } catch (error) {
//             const errorMessage =
//                 error.response?.data?.message || "Failed to update profile";
//             toast.error(errorMessage);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleClose = () => {
//         // Reset form to original values
//         setFormData({
//             fullName: user?.fullName || "",
//             currentPassword: "",
//             newPassword: "",
//             confirmPassword: "",
//         });
//         setProfileImage(null);
//         setPreviewUrl(user?.profileImageUrl || null);
//         setErrors({});
//         onClose();
//     };

//     return (
//         <Modal
//             className="fixed inset-0 z-[1000] sm:z-auto sm:relative"
//             isOpen={isOpen}
//             onClose={handleClose}
//             title="Edit Profile"
//         >
//             <form onSubmit={handleSubmit} className="">
//                 {/* Profile Photo Section */}
//                 <div className="flex flex-col items-center">
//                     <input
//                         type="file"
//                         accept="image/*"
//                         ref={inputRef}
//                         onChange={handleImageChange}
//                         className="hidden"
//                     />

//                     <div className="relative">
//                         {!previewUrl ? (
//                             <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 rounded-full relative shadow-sm">
//                                 <LuUser className="text-2xl sm:text-3xl text-primary" />
//                                 <button
//                                     type="button"
//                                     className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-primary hover:bg-primary/90 text-white rounded-full absolute -bottom-1 -right-1 shadow-sm transition-all duration-200"
//                                     onClick={onChooseFile}
//                                 >
//                                     <LuUpload className="text-xs" />
//                                 </button>
//                             </div>
//                         ) : (
//                             <div className="relative">
//                                 <img
//                                     src={previewUrl}
//                                     alt="profile photo"
//                                     className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover object-top shadow-sm ring-2 ring-white dark:ring-gray-600"
//                                 />
//                                 <button
//                                     type="button"
//                                     className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full absolute -top-1 -right-1 shadow-sm transition-all duration-200"
//                                     onClick={handleRemoveImage}
//                                 >
//                                     <LuTrash className="text-xs" />
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center bg-primary hover:bg-primary/90 text-white rounded-full absolute -bottom-1 -right-1 shadow-sm transition-all duration-200"
//                                     onClick={onChooseFile}
//                                 >
//                                     <LuUpload className="text-xs" />
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                     <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
//                         Click to upload photo
//                     </p>
//                 </div>

//                 {/* Personal Information Section */}
//                 <div className="space-y-1 sm:space-y-1">
//                     <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-1">
//                         Personal Information
//                     </h3>
//                     <div>
//                         <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-0">
//                             Full Name
//                         </label>
//                         <Input
//                             type="text"
//                             placeholder="Enter your full name"
//                             name="fullName"
//                             value={formData.fullName}
//                             onChange={handleInputChange}
//                         />
//                         {errors.fullName && (
//                             <p className="text-red-500 text-xs mt-1">
//                                 {errors.fullName}
//                             </p>
//                         )}
//                     </div>
//                 </div>

//                 {/* Password Change Section */}
//                 <div className="space-y-1 sm:space-y-1 border-t border-gray-200 dark:border-gray-600 pt-1">
//                     <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
//                         Change Password (Optional)
//                     </h3>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                         Leave blank if you don't want to change password
//                     </p>

//                     {/* Current Password */}
//                     <div>
//                         <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                             Current Password
//                         </label>
//                         <div className="relative">
//                             <Input
//                                 type={showCurrentPassword ? "text" : "password"}
//                                 placeholder="Current password"
//                                 name="currentPassword"
//                                 value={formData.currentPassword}
//                                 onChange={handleInputChange}
//                             />
//                             <button
//                                 type="button"
//                                 className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
//                                 onClick={() =>
//                                     setShowCurrentPassword(!showCurrentPassword)
//                                 }
//                             >
//                                 {showCurrentPassword ? (
//                                     <LuEyeOff size={14} />
//                                 ) : (
//                                     <LuEye size={14} />
//                                 )}
//                             </button>
//                         </div>
//                         {errors.currentPassword && (
//                             <p className="text-red-500 text-xs mt-1">
//                                 {errors.currentPassword}
//                             </p>
//                         )}
//                     </div>

//                     {/* New Password */}
//                     <div>
//                         <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                             New Password
//                         </label>
//                         <div className="relative">
//                             <Input
//                                 type={showNewPassword ? "text" : "password"}
//                                 placeholder="New password"
//                                 name="newPassword"
//                                 value={formData.newPassword}
//                                 onChange={handleInputChange}
//                             />
//                             <button
//                                 type="button"
//                                 className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
//                                 onClick={() =>
//                                     setShowNewPassword(!showNewPassword)
//                                 }
//                             >
//                                 {showNewPassword ? (
//                                     <LuEyeOff size={14} />
//                                 ) : (
//                                     <LuEye size={14} />
//                                 )}
//                             </button>
//                         </div>
//                         {errors.newPassword && (
//                             <p className="text-red-500 text-xs mt-1">
//                                 {errors.newPassword}
//                             </p>
//                         )}
//                     </div>

//                     {/* Confirm Password */}
//                     <div>
//                         <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                             Confirm New Password
//                         </label>
//                         <div className="relative">
//                             <Input
//                                 type={showConfirmPassword ? "text" : "password"}
//                                 placeholder="Confirm new password"
//                                 name="confirmPassword"
//                                 value={formData.confirmPassword}
//                                 onChange={handleInputChange}
//                             />
//                             <button
//                                 type="button"
//                                 className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
//                                 onClick={() =>
//                                     setShowConfirmPassword(!showConfirmPassword)
//                                 }
//                             >
//                                 {showConfirmPassword ? (
//                                     <LuEyeOff size={14} />
//                                 ) : (
//                                     <LuEye size={14} />
//                                 )}
//                             </button>
//                         </div>
//                         {errors.confirmPassword && (
//                             <p className="text-red-500 text-xs mt-1">
//                                 {errors.confirmPassword}
//                             </p>
//                         )}
//                     </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex flex-col sm:flex-row gap-1 sm:gap-1 pt-2 border-t border-gray-200 dark:border-gray-600">
//                     <button
//                         type="button"
//                         onClick={handleClose}
//                         className="w-full sm:flex-1 px-3 sm:px-4 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 font-medium text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                         disabled={isLoading}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         className="w-full sm:flex-1 px-3 sm:px-4 py-1 bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg hover:from-primary/90 hover:to-purple-600/90 transition-all duration-200 font-medium text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                         disabled={isLoading}
//                     >
//                         {isLoading ? (
//                             <span className="flex items-center justify-center">
//                                 <svg
//                                     className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                 >
//                                     <circle
//                                         className="opacity-25"
//                                         cx="12"
//                                         cy="12"
//                                         r="10"
//                                         stroke="currentColor"
//                                         strokeWidth="4"
//                                     ></circle>
//                                     <path
//                                         className="opacity-75"
//                                         fill="currentColor"
//                                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                                     ></path>
//                                 </svg>
//                                 Updating...
//                             </span>
//                         ) : (
//                             "Update Profile"
//                         )}
//                     </button>
//                 </div>
//             </form>
//         </Modal>
//     );
// };

// export default ProfileEditModal;

import React, { useState, useContext, useRef } from "react";
import Modal from "./Modal";
import Input from "./Inputs/Input";
import { UserContext } from "../context/userContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import toast from "react-hot-toast";
import { LuUser, LuUpload, LuTrash, LuEye, LuEyeOff } from "react-icons/lu";

const ProfileEditModal = ({ isOpen, onClose }) => {
    const { user, updateUser } = useContext(UserContext);
    const inputRef = useRef(null);

    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user?.profileImageUrl || null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setProfileImage(null);
        setPreviewUrl(null);
    };

    const onChooseFile = () => inputRef.current.click();

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim())
            newErrors.fullName = "Full name is required";

        if (formData.newPassword) {
            if (!formData.currentPassword)
                newErrors.currentPassword = "Current password required";
            if (formData.newPassword.length < 6)
                newErrors.newPassword = "New password must be at least 6 chars";
            if (formData.newPassword !== formData.confirmPassword)
                newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const uploadImage = async (imageFile) => {
        const formData = new FormData();
        formData.append("image", imageFile);
        try {
            const response = await axiosInstance.post(
                API_PATHS.IMAGE.UPLOAD_IMAGE,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            return response.data.imageUrl;
        } catch {
            throw new Error("Failed to upload image");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);

        try {
            let profileImageUrl = user?.profileImageUrl;
            if (profileImage) profileImageUrl = await uploadImage(profileImage);
            else if (previewUrl === null) profileImageUrl = null;

            const updateData = { fullName: formData.fullName, profileImageUrl };
            if (formData.newPassword) {
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            const response = await axiosInstance.put(
                API_PATHS.AUTH.UPDATE_PROFILE,
                updateData
            );
            updateUser(response.data.user);

            toast.success("Profile updated successfully!");
            onClose();

            setFormData({
                fullName: response.data.user.fullName,
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setProfileImage(null);
            setPreviewUrl(response.data.user.profileImageUrl || null);
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update profile"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            fullName: user?.fullName || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        setProfileImage(null);
        setPreviewUrl(user?.profileImageUrl || null);
        setErrors({});
        onClose();
    };

    return (
        <Modal
            className="fixed inset-0 z-[1000] sm:z-auto sm:relative"
            isOpen={isOpen}
            onClose={handleClose}
            title="Edit Profile"
        >
            <form
                className="space-y-2 text-[10px] sm:text-xs max-h-[85vh] overflow-y-auto p-2"
                onSubmit={handleSubmit}
            >
                {/* Profile Photo */}
                <div className="flex flex-col items-center">
                    <input
                        type="file"
                        accept="image/*"
                        ref={inputRef}
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    <div className="relative">
                        {!previewUrl ? (
                            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 rounded-full shadow-sm">
                                <LuUser className="text-xl text-primary" />
                                <button
                                    type="button"
                                    className="w-5 h-5 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1"
                                    onClick={onChooseFile}
                                >
                                    <LuUpload className="text-[10px]" />
                                </button>
                            </div>
                        ) : (
                            <div className="relative">
                                <img
                                    src={previewUrl}
                                    alt="profile"
                                    className="w-16 h-16 rounded-full object-cover shadow-sm ring-1 ring-white dark:ring-gray-600"
                                />
                                <button
                                    type="button"
                                    className="w-4 h-4 flex items-center justify-center bg-red-500 text-white rounded-full absolute -top-1 -right-1"
                                    onClick={handleRemoveImage}
                                >
                                    <LuTrash className="text-[10px]" />
                                </button>
                                <button
                                    type="button"
                                    className="w-4 h-4 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1"
                                    onClick={onChooseFile}
                                >
                                    <LuUpload className="text-[10px]" />
                                </button>
                            </div>
                        )}
                    </div>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 text-center mt-1">
                        Click to upload photo
                    </p>
                </div>

                {/* Personal Info */}
                <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-1">
                        Personal Information
                    </h3>
                    <div>
                        <label className="block text-[9px] font-medium text-gray-700 dark:text-gray-300 mb-0">
                            Full Name
                        </label>
                        <Input
                            type="text"
                            placeholder="Enter your full name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="py-1 text-[9px] sm:text-xs"
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-[9px] mt-1">
                                {errors.fullName}
                            </p>
                        )}
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-1 border-t border-gray-200 dark:border-gray-600 pt-1">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Change Password (Optional)
                    </h3>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400">
                        Leave blank if you don't want to change
                    </p>

                    {["current", "new", "confirm"].map((type) => (
                        <div key={type}>
                            <label className="block text-[9px] font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {type === "current"
                                    ? "Current Password"
                                    : type === "new"
                                    ? "New Password"
                                    : "Confirm New Password"}
                            </label>
                            <div className="relative">
                                <Input
                                    type={
                                        type === "current"
                                            ? showCurrentPassword
                                                ? "text"
                                                : "password"
                                            : type === "new"
                                            ? showNewPassword
                                                ? "text"
                                                : "password"
                                            : showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name={
                                        type === "current"
                                            ? "currentPassword"
                                            : type === "new"
                                            ? "newPassword"
                                            : "confirmPassword"
                                    }
                                    placeholder={
                                        type === "current"
                                            ? "Current password"
                                            : type === "new"
                                            ? "New password"
                                            : "Confirm new password"
                                    }
                                    value={
                                        type === "current"
                                            ? formData.currentPassword
                                            : type === "new"
                                            ? formData.newPassword
                                            : formData.confirmPassword
                                    }
                                    onChange={handleInputChange}
                                    className="py-1 text-[9px] sm:text-xs"
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                                    onClick={() => {
                                        if (type === "current")
                                            setShowCurrentPassword(
                                                !showCurrentPassword
                                            );
                                        else if (type === "new")
                                            setShowNewPassword(
                                                !showNewPassword
                                            );
                                        else
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            );
                                    }}
                                >
                                    {(type === "current" &&
                                        showCurrentPassword) ||
                                    (type === "new" && showNewPassword) ||
                                    (type === "confirm" &&
                                        showConfirmPassword) ? (
                                        <LuEyeOff size={12} />
                                    ) : (
                                        <LuEye size={12} />
                                    )}
                                </button>
                            </div>
                            {errors[
                                type === "current"
                                    ? "currentPassword"
                                    : type === "new"
                                    ? "newPassword"
                                    : "confirmPassword"
                            ] && (
                                <p className="text-red-500 text-[9px] mt-1">
                                    {
                                        errors[
                                            type === "current"
                                                ? "currentPassword"
                                                : type === "new"
                                                ? "newPassword"
                                                : "confirmPassword"
                                        ]
                                    }
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-1 pt-2 border-t border-gray-200 dark:border-gray-600">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="w-full sm:flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white bg-white dark:bg-gray-700 rounded-lg text-[10px] sm:text-xs"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:flex-1 px-2 py-1 bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg text-[10px] sm:text-xs"
                    >
                        {isLoading ? "Updating..." : "Update Profile"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ProfileEditModal;
