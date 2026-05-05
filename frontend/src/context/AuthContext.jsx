import {
    Children,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import {
    getAccessTokenFromLocalStorage,
    getUserFromLocalStorage,
    removeLoginData,
} from "../services/LocalStorageService";
import {useNavigate} from "react-router";
import {toast} from "react-toastify";

const AuthContent = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    const [dashboardData, setDashboardData] = useState(null);
    const [loadingDashboardData, setLoadingDashboardData] = useState(false);

    useEffect(() => {
        setAccessToken(getAccessTokenFromLocalStorage());
        setUser(getUserFromLocalStorage());
    }, []);

    function logoutUser() {
        setUser(null);
        setAccessToken(null);
        removeLoginData();
        setDashboardData(null)
        setLoadingDashboardData(false)
    }

    return (
        <AuthContent.Provider
            value={{user, accessToken, setUser, setAccessToken, logoutUser, dashboardData, setDashboardData, loadingDashboardData, setLoadingDashboardData}}
        >
            {children}
        </AuthContent.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContent);
