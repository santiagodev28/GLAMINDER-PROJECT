import { Link } from "react-router-dom";
import React from "react";

const NewAppointmentButton = () => {
    return (

        <div className="ml-auto">
            <Link
                to="/cliente/nueva-cita"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
            >
                <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
                Nueva Cita
            </Link>
        </div>
    );
}

export default NewAppointmentButton;