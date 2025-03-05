import React from "react"; 
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login";
import Axios from "../axios/Axios";

// Mock de Axios para evitar llamadas reales
jest.mock("../axios/Axios");

describe("Login Component", () => {
    test("Renderiza el formulario de login correctamente", () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        expect(screen.getByText("INICIAR SESIÓN")).toBeInTheDocument();
    });
});
