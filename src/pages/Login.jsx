import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import SlideUp from "../components/SlideUp.jsx";

import login from "../assets/imgs/login.jfif";


function Login() {
    document.title = "Log In | PixelVault";

    const [domain, setDomain] = useState("");
    const navigate = useNavigate();

    const { isSignedIn, setIsSignedIn, setUserId, setMail, setUsername, setCreatedAt, setPfp, setUserType } = useAuth();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [processing, setProcessing] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetch("/domain.json")
            .then((response => response.json()))
            .then((data) => setDomain(data.domain_url))
            .catch(console.error)
    }, []);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    async function handleLogin(event) {
        event.preventDefault();
        setError("");
        setSuccess("");
        setProcessing(true);

        await fetch(
            `${domain}/PixelVault/auth/login.php`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    remember: remember
                })
            }
        )
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setSuccess(data.message);
                    setPassword("");
                    setEmail("");
                    setRemember(false);

                    setIsSignedIn(true);
                    setUserId(data.user.id);
                    setMail(data.user.email);
                    setUsername(data.user.username);
                    setCreatedAt(data.user.created_at);
                    setPfp(data.user.pfp);
                    setUserType(data.user.user_type);
                    navigate("/");
                } else {
                    setError(data.message);
                }
            })
            .catch(setError)
            .finally(() => setProcessing(false));
    }

    if (isSignedIn) {
        navigate("/");
        return;
    }

    return (
        <main>
            <section className="pv-black-bg">
                <div className="container-fluid">
                    <div className="row">
                        <div className={`col-md-6 d-flex flex-column justify-content-center ${windowWidth < 768 && "my-3"}`} style={{ minHeight: `${windowWidth < 768 ? "100%" : "100vh"}` }}>
                            <div>
                                <div className="d-flex justify-content-between">
                                    <a href="/" className="pv-white">
                                        <h6 className="font-press-start"><span className="pv-gradient">PIXELVAULT</span></h6>
                                    </a>
                                    <h6 className="pv-light-gray">NEW HERE? <a href="/signup" className="pv-gradient-link">CREATE ACCOUNT.</a></h6>
                                </div>
                                <hr className="my-3 pv-gradient-hr" />
                                <SlideUp>
                                    <h5 className="pv-blue">YOUR CREATIVE UNIVERSE.</h5>
                                    <h4 className="font-press-start pv-white my-3">CREATE WITHOUT LIMITS.</h4>
                                    <p className="pv-light-gray">Discover the resources that bring your ideas to life.</p>
                                    <img src={login} alt="login" className="rounded-2 pv-banner-img" style={{ height: "250px", border: "2px solid var(--pv-border)" }} />
                                </SlideUp>
                            </div>
                        </div>
                        <div className={`col-md-6 d-flex flex-column justify-content-center ${windowWidth < 768 && "my-3"}`} style={{ minHeight: `${windowWidth < 768 ? "100%" : "100vh"}` }}>
                            <div>
                                <h5 className="pv-red">WELCOME BACK</h5>
                                <h5 className="my-3 font-press-start pv-white">GOOD TO SEE YOU <span className="pv-red">AGAIN.</span></h5>
                                <p className="pv-light-gray">Sign in to access your assets, downloads and personal collection.</p>
                                <SlideUp>
                                    <form className="p-3 pv-dark-bg rounded-2" onSubmit={handleLogin}>
                                        <label htmlFor="email" className="pv-white my-1">EMAIL ADDRESS</label>
                                        <div className="pv-input-wrap">
                                            <input type="email" className="pv-input" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" required />
                                        </div>
                                        <label htmlFor="password" className="pv-white my-1">PASSWORD</label>
                                        <div className="pv-input-wrap">
                                            <input type="password" className="pv-input" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
                                            <i className="bi bi-eye pv-password-toggle"></i>
                                        </div>
                                        <div className="form-check my-2">
                                            <input type="checkbox" id="check" className="form-check-input" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                                            <label htmlFor="check" className="form-check-label pv-white">Remember me.</label>
                                        </div>
                                        {error && (
                                            <p className="pv-red">{error}</p>
                                        )}
                                        {success && (
                                            <p className="pv-green">{success}</p>
                                        )}
                                        <button className="rainbow-button w-100" type="submit" disabled={processing}>
                                            {processing ? (
                                                <>PROCESSING...</>
                                            ) : (
                                                <>SIGN IN <i className="bi bi-arrow-right"></i></>
                                            )}
                                        </button>
                                    </form>
                                </SlideUp>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Login