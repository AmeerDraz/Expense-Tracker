import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import Loader from "../../components/Loader";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { updateUser } = useContext(UserContext);
    const navigate = useNavigate();

    // handle login form submit
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!password) {
            setError("Please enter your password.");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
                email,
                password,
            });
            const { token, user } = response.data;
            if (token) {
                localStorage.setItem("token", token);
                updateUser(user);
                navigate("/dashboard");
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong. please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            {/* شاشة تحميل تغطي الصفحة كلها */}
            {isLoading && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <Loader className="h-12 w-12" />
                </div>
            )}

            <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-black">
                    Welcome Back
                </h3>
                <p className="text-xs text-slate-700 mt-[5px] mb-6">
                    please enter your details to log in
                </p>

                <form onSubmit={handleLogin}>
                    <Input
                        value={email}
                        onChange={({ target }) => setEmail(target.value)}
                        label="Email Address"
                        placeholder="john@example.com"
                        type="text"
                    />
                    <Input
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                        label="Password"
                        placeholder="Min 8 characters"
                        type="password"
                    />
                    {error && (
                        <p className="text-red-500 text-xs pb-2.5">{error}</p>
                    )}
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={isLoading}
                    >
                        LOGIN
                    </button>

                    <p className="text-[13px] text-slate-800 mt-3">
                        Don't have an account?{" "}
                        <Link
                            className="font-medium text-primary underline"
                            to="/signup"
                        >
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </AuthLayout>
    );
};

export default Login;
