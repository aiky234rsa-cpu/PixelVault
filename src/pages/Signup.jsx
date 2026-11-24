import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import SlideUp from "../components/SlideUp.jsx";

import login from "../assets/imgs/login.jfif";

function Signup() {
    document.title = "Sign Up | PixelVault";

    const { isSignedIn, setIsSignedIn, setUserId, setMail, setUsername, setCreatedAt, setPfp, setUserType } = useAuth();
    const navigate = useNavigate();

    const [domain, setDomain] = useState("");
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [passwordVisible, setPasswordVisible] = useState(false);

    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [uname, setUname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [agreement, setAgreement] = useState(false);

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

    if (isSignedIn) {
        navigate("/");
        return;
    }

    async function handleSignUp(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!agreement) {
            setError("You must agree to the Terms of Service and Privacy Policy.");
            return;
        }

        if (password !== passwordConfirm) {
            setError("Your passwords do not match.");
            return;
        }

        setProcessing(true);

        await fetch(
            `${domain}/PixelVault/auth/signup.php`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: uname,
                    email: email,
                    password: password
                })
            }
        )
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setSuccess(data.message);
                    setUname("");
                    setEmail("");
                    setPassword("");
                    setPasswordConfirm("");

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
            .catch(error => setError(error))
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
                                    <h6 className="pv-light-gray">ALREADY A MEMBER? <a href="/login" className="pv-gradient-link">LOG IN.</a></h6>
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
                                <h5 className="pv-green">JOIN THE COMMUNITY</h5>
                                <h5 className="my-3 font-press-start pv-white">START YOUR <span className="pv-green">CREATIVE </span> JOURNEY.</h5>
                                <p className="pv-light-gray">Create your account and discover a world of digital assets.</p>
                                <SlideUp>
                                    <form className="p-3 pv-dark-bg rounded-2" onSubmit={handleSignUp}>
                                        <label htmlFor="username" className="pv-white my-1">USERNAME</label>
                                        <div className="pv-input-wrap">
                                            <input className="pv-input" type="text" name="username" id="username" value={uname} onChange={(e) => setUname(e.target.value)} placeholder="Choose a username" required />
                                        </div>
                                        <label htmlFor="email" className="pv-white my-1">EMAIL ADDRESS</label>
                                        <div className="pv-input-wrap">
                                            <input type="email" className="pv-input" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" required />
                                        </div>
                                        <label htmlFor="password" className="pv-white my-1">PASSWORD</label>
                                        <div className="pv-input-wrap">
                                            <input type={`${passwordVisible ? "text" : "password"}`} className="pv-input" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required />
                                            <i className={`bi ${passwordVisible ? "bi-eye-slash" : "bi-eye"} pv-password-toggle`} onClick={() => setPasswordVisible(!passwordVisible)}></i>
                                        </div>
                                        <label htmlFor="cpassword" className="pv-white my-1">CONFIRM PASSWORD</label>
                                        <div className="pv-input-wrap">
                                            <input type={`${passwordVisible ? "text" : "password"}`} className="pv-input" name="cpassword" id="cpassword" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} placeholder="Confirm your password" required />
                                            <i className={`bi ${passwordVisible ? "bi-eye-slash" : "bi-eye"} pv-password-toggle`} onClick={() => setPasswordVisible(!passwordVisible)}></i>
                                        </div>
                                        <div className="form-check my-2">
                                            <input type="checkbox" id="check" className="form-check-input" checked={agreement} onChange={(e) => setAgreement(e.target.checked)} />
                                            <label htmlFor="check" className="form-check-label pv-white">I agree to the Terms of Service and Privacy Policy.</label>
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
                                                <>CREATE ACCOUNT <i className="bi bi-arrow-right"></i></>
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

export default Signup