import React from 'react'

const SuccessAlert = ({ error, message }) => {
    return (
        <div
            className={`p-4 rounded-md ${error ? "" : "bg-green-100 text-green-700"
                }`}
            role="alert"
        >
            <p className="font-bold">{error ? "" : "Exitoso"}</p>
            <p>{message}</p>
        </div>
    )
}

export default SuccessAlert
