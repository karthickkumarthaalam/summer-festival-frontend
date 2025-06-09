const { createContext, useState, useEffect, useContext } = require("react");

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const loginTime = parsedUser.loginTime;
            const currTime = new Date().getTime();

            if (currTime - loginTime > 30 * 60 * 1000) {
                logout();
            } else {
                setUser(parsedUser);
            }
        }
        setLoading(false);

    }, []);

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };


    return <AuthContext.Provider value={{ user, setUser, logout, loading, setLoading }}>
        {children}
    </AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);