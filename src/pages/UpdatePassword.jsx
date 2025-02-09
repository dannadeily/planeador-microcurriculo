import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import ErrorAlert from '../components/alerts/ErrorAlert'
import SuccessAlert from '../components/alerts/SuccessAlert'


const UpdatePassword = () => {

    const [ErrorAlert, setErrorAlert] = useState({ error: false, message: "", });
    const [SuccessAlert, setSuccessAlert] = useState({ error: false, message: "", });

    const handleSubmit = async (e) => {
        e.preventDefault();


    };
    return (
        <>
            <div className="py-5">
                <div className=" xl:mx-96 lg:mx-60 md:mx-40 sm:mx-20 my-10 bg-white shadow rounded-lg p-10 border-2 border-red-700 shadow-lg shadow-red-400 ">
                    <form onSubmit={handleSubmit}>
                        <h1 className=" font-bold text-2xl text-center text-gray-900 dark:text-red-500 ">
                            RECUPERAR CONTRASEÑA
                        </h1>
                        {ErrorAlert.error && !SuccessAlert.error && (
                            <ErrorAlert message={ErrorAlert.message} />
                        )}
                        {SuccessAlert.error && (
                            <SuccessAlert message={SuccessAlert.message} />
                        )}

                        <div className="my-5">
                            <label
                                className="uppercase text-gray-600 block  font-bold"
                                htmlFor="email"
                                name="email"
                                type="email"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="Email"
                                className="w-full mt-3 p-3 border rounded-xl bg-gray-50"

                            />
                        </div>

                        <input
                            type="submit"
                            value="enviar"
                            className="bg-red-500 mb-5 w-full py-2 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
                        />
                    </form>
                    <Link to="/">Volver a inicio</Link>
                </div>
            </div>
        </>
    )
}

export default UpdatePassword
