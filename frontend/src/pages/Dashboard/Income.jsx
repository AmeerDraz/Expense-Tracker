import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from "../../components/Income/IncomeOverview";
import axiosInstance from "./../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import AddIncomeForm from "../../components/Income/AddIncomeForm";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { toast } from "react-toastify";
import IncomeList from "../../components/Income/IncomeList";
import DeleteAlert from './../../components/DeleteAlert';

const Income = () => {
    useUserAuth(); // Only for side effects
    const { user } = useContext(UserContext);
    const isAuthenticated = !!user;
    const [incomeData, setIncomeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
    });

    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

    // Get All Income Details
    const fetchIncomeDetails = async () => {
        if (loading || !isAuthenticated || !user) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get(
                `${API_PATHS.INCOME.GET_ALL_INCOME}`
            );

            if (response.data) {
                setIncomeData(response.data);
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Failed to fetch income data";
            console.error("Error fetching income data:", error);
            setError(errorMessage);
            setIncomeData([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle Add Income
    const handleAddIncome = async (income) => {
        const { source, amount, date, icon } = income;

        // Validation Checks
        if (!source.trim()) {
            toast.error("Source is required.");
            return;
        }

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Amount should be valid number greater than 0.");
            return;
        }

        if (!date) {
            toast.error("Date is required.");
            return;
        }

        try {
            await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
                source,
                amount,
                date,
                icon,
            });
            setOpenAddIncomeModal(false);
            toast.success("Income added successfully");
            fetchIncomeDetails();
        } catch (error) {
            console.error(
                "Error adding income",
                error.response?.data.message || error.message
            );
        }
    };


    // Delete Income
    const deleteIncome = async (id) => {
        try {
            await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));

            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Income details deleted successfully");
            fetchIncomeDetails();
        } catch (error) {
            console.error(
                "Error deleting income:",
                error.response?.data?.message || error.message
            );
        }
    };

    // Handle Download Income Details
    const handleDownloadIncomeDetails = async () => {};

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchIncomeDetails();
        }
    }, [isAuthenticated, user]);

    return (
        <DashboardLayout activeMenu="Income">
            {loading && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <Loader className="w-full" />
                </div>
            )}
            <div className="my-5 mx-auto">
                {error ? (
                    <div
                        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
                        role="alert"
                    >
                        <p className="font-medium">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        <div className="">
                            <IncomeOverview
                                transactions={incomeData}
                                onAddIncome={() =>
                                    isAuthenticated
                                        ? setOpenAddIncomeModal(true)
                                        : null
                                }
                            />
                        </div>

                        <IncomeList
                            transactions={incomeData}
                            onDelete={(item) => {
                                setOpenDeleteAlert({ show: true, data: item });
                            }}
                            onDownload={handleDownloadIncomeDetails}
                        />
                    </div>
                )}

                <Modal
                    isOpen={openAddIncomeModal}
                    onClose={() => setOpenAddIncomeModal(false)}
                    title="Add Income"
                >
                    <AddIncomeForm onAddIncome={handleAddIncome} />
                </Modal>

                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() =>
                        setOpenDeleteAlert({ show: false, data: null })
                    }
                    title="Delete Income"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this income detail?"
                        onDelete={() => deleteIncome(openDeleteAlert.data)}
                    />
                </Modal>
            </div>
        </DashboardLayout>
    );
};

export default Income;
