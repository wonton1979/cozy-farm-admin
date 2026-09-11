export const Auth = {
    save: function (token: string) {
        localStorage.setItem("authToken", token);
    },

    clear: function () {
        localStorage.removeItem("authToken");
    },

    token: function () {
        return localStorage.getItem("authToken");
    },

    isLoggedIn: function () {
        return !!localStorage.getItem("authToken");
    },
};