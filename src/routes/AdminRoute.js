import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { getUser } from "../services/dataService";

export const AdminRoute = ({ children }) => {
    const [isAllowed, setIsAllowed] = useState(false);
    const [checked, setChecked] = useState(false);

    const checkAdminAccess = useCallback(async () => {
        const token = JSON.parse(sessionStorage.getItem("token"));
        const cachedRole = JSON.parse(sessionStorage.getItem("role"));
        const cachedName = JSON.parse(sessionStorage.getItem("name"));
        
        if(!token){
            setChecked(true);
            setIsAllowed(false);
            return;
        }
        
        try{
            let isAdmin = (cachedRole === "admin") || (cachedName === "Admin");
            if(!isAdmin){
                const user = await getUser();
                isAdmin = (user?.role === "admin") || (user?.name === "Admin");
            }
            setIsAllowed(isAdmin);
        }catch(e){
            console.error("Admin check failed:", e);
            setIsAllowed(false);
        }finally{
            setChecked(true);
        }
    }, []);

    useEffect(() => {
        checkAdminAccess();
    }, [checkAdminAccess]);

    const token = JSON.parse(sessionStorage.getItem("token"));
    
    if(!token){
        return <Navigate to="/login" />
    }

    if(!checked){
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return isAllowed ? children : <Navigate to="/" />
}

export default AdminRoute;