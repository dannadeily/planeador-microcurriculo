import React from 'react'

const ErrorAlert = ({ error, message }) => {
    return (
        <div
            className={`p-4 rounded-md ${error ? "" : "bg-red-100 text-red-700"}`}
            role="alert"
        >
            <p className="font-bold">{error ? "" : "Error"}</p>
            <p>{message}</p>
        </div>
    )
}

export default ErrorAlert
