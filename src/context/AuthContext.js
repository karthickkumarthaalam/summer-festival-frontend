const { createContext, useState, useEffect, useContext } = require("react");

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        setLoading(false);
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
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