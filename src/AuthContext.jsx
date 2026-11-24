import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [domain, setDomain] = useState("");

    const [isSignedIn, setIsSignedIn] = useState(false);
    const [userId, setUserId] = useState(0);
    const [mail,setMail] = useState("");
    const [username, setUsername] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [pfp,setPfp] = useState(null);
    const [userType,setUserType] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/domain.json")
            .then((response => response.json()))
            .then((data) => setDomain(data.domain_url))
            .catch(console.error)
    },[]);

    useEffect(() => {
        if (!domain) return;
        fetch(
            `${domain}/PixelVault/auth/me.php`, {
            credentials: "include"
        }
        )
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setIsSignedIn(true);
                    setUserId(data.user.id);
                    setMail(data.user.email);
                    setUsername(data.user.username);
                    setCreatedAt(data.user.created_at);
                    setPfp(data.user.pfp);
                    setUserType(data.user.user_type);
                } else {
                    setIsSignedIn(false);
                    setUserId(0);
                    setUsername("");
                }
            })
            .catch(error => console.error(error))
            .finally(() => setLoading(false));
    }, [domain]);

    return (
        <AuthContext.Provider value={{ isSignedIn, setIsSignedIn, userId, setUserId, mail, setMail, username, setUsername, createdAt, setCreatedAt, pfp, setPfp, userType, setUserType, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}