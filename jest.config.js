export default {
    testEnvironment: "jsdom", // Asegúrate de que esté correctamente escrito
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    transform: {
        "^.+\\.jsx?$": "babel-jest"
    },
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    }
};