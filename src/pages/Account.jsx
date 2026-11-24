import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import SlideUp from "../components/SlideUp.jsx";
import Footer from "../components/Footer.jsx";

import "./Account.css";

function Account() {
    document.title = "My Account | PixelVault";

    const [pfpHover, setPfpHover] = useState(false);
    const [pfpEdit, setPfpEdit] = useState(false);

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [message, setMessage] = useState("");

    const [domain, setDomain] = useState("");
    const navigate = useNavigate();
    const { isSignedIn, setIsSignedIn, userId, setUserId, mail, setMail, username, setUsername, createdAt, setCreatedAt, pfp, setPfp, userType, setUserType, loading } = useAuth();

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetch("/domain.json")
            .then((response => response.json()))
            .then((data) => setDomain(data.domain_url))
            .catch(console.error)
    }, []);

    async function handleLogout() {
        if (!processing) {
            setProcessing(true);
            await fetch(
                `${domain}/PixelVault/auth/logout.php`,
                {
                    method: "POST",
                    credentials: "include"
                }
            )
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setIsSignedIn(false);
                        setUserId(0);
                        setMail("");
                        setUsername("");
                        setCreatedAt("");
                        setPfp(null);
                        setUserType("");
                        navigate("/");
                    }
                })
                .catch(console.error)
                .finally(() => setProcessing(false));
        }
    }

    function handleFileChange(event) {
        setFile(null);
        setMessage("");
        setPreview("");

        const selectedFile = event.target.files[0];

        if (!selectedFile) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(selectedFile.type)) {
            setMessage("Invalid file type!");
            setFile(null);
            setPreview("");
            return;
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setMessage("");
    }

    async function handleUpload() {
        if (!file) {
            setMessage("Please select an image first.");
            return;
        }

        const formData = new FormData();

        formData.append("image", file);

        try {
            const response = await fetch(
                "http://localhost/PixelVault/functionality/upload_pfp.php",
                {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage("Image uploaded successfully!");
                setPfp(data.pfp);
                navigate("/account");
            } else {
                setMessage(data.message);
            }

        } catch (error) {
            setMessage("Something went wrong.");
        }
    }

    if (!loading && !isSignedIn) {
        navigate("/");
        return;
    }

    return (
        <>
            <Navbar />
            {!loading && (
                <main>
                    <section className="py-4 pv-black-bg">
                        <div className="container">
                            <SlideUp>
                                <div className="d-flex justify-content-between align-items-center gap-2">
                                    <div
                                        className="flex-shrink-0 d-flex flex-column justify-content-center text-center"
                                        style={{
                                            height: "100px",
                                            width: "100px",
                                            background: `${preview ? `url(${preview})` : pfp ? `url(${domain}/PixelVault${pfp})` : "var(--pv-dark)"} center / cover no-repeat`,
                                            borderRadius: "50%"
                                        }}
                                        onMouseEnter={() => setPfpHover(true)}
                                        onMouseLeave={() => setPfpHover(false)}
                                    >
                                        {!pfpHover && !pfp && !preview ? (
                                            <h1 className="pv-white mb-0" style={{ cursor: "pointer" }} onClick={() => setPfpEdit(!pfpEdit)}><i className="bi bi-person"></i></h1>
                                        ) : pfpHover && (
                                            <h1 className="pv-white mb-0" style={{ cursor: "pointer" }} onClick={() => setPfpEdit(!pfpEdit)}><i className="bi bi-pencil"></i></h1>
                                        )}
                                    </div>
                                    <div className="w-100 d-flex flex-column justify-content-center">
                                        <h5 className="pv-white mb-0">{username}</h5>
                                        <p className="pv-light-gray mb-0">{mail}</p>
                                        <h6 className="pv-green mb-0">{userType.toUpperCase()}</h6>
                                    </div>
                                </div>
                            </SlideUp>
                            {pfpEdit && (
                                <>
                                    <div className="mt-4">
                                        <input type="file" id="imageUpload" accept=".jpg,.jpeg,.png,.webp" onChange={handleFileChange} hidden />
                                        <label htmlFor="imageUpload" className="rainbow-button">Choose/edit image</label>
                                    </div>
                                    {preview && (
                                        <button className="rainbow-button mt-2" onClick={handleUpload}>UPLOAD IMAGE</button>
                                    )}
                                    {message && (
                                        <p className="pv-red mt-2">{message}</p>
                                    )}
                                </>
                            )}
                        </div>
                    </section>
                    <section className="py-4 pv-dark-bg">
                        <div className="container">
                            <h5 className="pv-red">ACCOUNT OVERVIEW</h5>
                            <div className="row g-2">
                                <div className="col-4">
                                    <div className="pv-card">
                                        <div className="p-2">
                                            <h5 className="pv-red"><i className="bi bi-bag"></i></h5>
                                            <h2 className="pv-white">0</h2>
                                            <p className="mb-0 pv-light-gray">Purchases</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="pv-card">
                                        <div className="p-2">
                                            <h5 className="pv-green"><i className="bi bi-download"></i></h5>
                                            <h2 className="pv-white">0</h2>
                                            <p className="mb-0 pv-light-gray">Downloads</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="pv-card">
                                        <div className="p-2">
                                            <h5 className="pv-blue"><i className="bi bi-heart"></i></h5>
                                            <h2 className="pv-white">0</h2>
                                            <p className="mb-0 pv-light-gray">Wishlist</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="py-4 pv-black-bg">
                        <div className="container">
                            <h5 className="pv-blue">PERSONAL INFORMATION</h5>
                            <h4 className="pv-white mb-3">YOUR PROFILE</h4>
                            <div>
                                <p className="pv-light-gray mb-0">USERNAME</p>
                                <p className="pv-white">{username}</p>
                                <hr className="pv-gradient-hr" />
                            </div>
                            <div>
                                <p className="pv-light-gray mb-0">EMAIL ADDRESS</p>
                                <p className="pv-white">{mail}</p>
                                <hr className="pv-gradient-hr" />
                            </div>
                            <div>
                                <p className="pv-light-gray mb-0">MEMBER SINCE</p>
                                <p className="pv-white">{createdAt}</p>
                                <hr className="pv-gradient-hr" />
                            </div>
                        </div>
                    </section>
                    <section className="py-4 pv-dark-bg">
                        <div className="container">
                            <h5 className="pv-green mb-4">QUICK ACCESS</h5>
                            <div>
                                <a href="#">
                                    <div className="d-flex justify-content-between align-items-center gap-2">
                                        <h3 className="pv-light-gray"><i className="bi bi-bag"></i></h3>
                                        <div className="w-100 d-flex flex-column justify-content-center">
                                            <h5 className="pv-white mb-0">My Purchases</h5>
                                            <p className="pv-light-gray mb-0">View your purchased assets.</p>
                                        </div>
                                        <h3 className="pv-light-gray"><i className="bi bi-chevron-right"></i></h3>
                                    </div>
                                </a>
                                <hr className="pv-gradient-hr" />
                            </div>
                            <div>
                                <a href="#">
                                    <div className="d-flex justify-content-between align-items-center gap-2">
                                        <h3 className="pv-light-gray"><i className="bi bi-download"></i></h3>
                                        <div className="w-100 d-flex flex-column justify-content-center">
                                            <h5 className="pv-white mb-0">My Downloads</h5>
                                            <p className="pv-light-gray mb-0">Access your downloadable files.</p>
                                        </div>
                                        <h3 className="pv-light-gray"><i className="bi bi-chevron-right"></i></h3>
                                    </div>
                                </a>
                                <hr className="pv-gradient-hr" />
                            </div>
                            <div>
                                <a href="/wishlist">
                                    <div className="d-flex justify-content-between align-items-center gap-2">
                                        <h3 className="pv-light-gray"><i className="bi bi-heart"></i></h3>
                                        <div className="w-100 d-flex flex-column justify-content-center">
                                            <h5 className="pv-white mb-0">My Wishlist</h5>
                                            <p className="pv-light-gray mb-0">Your saved products.</p>
                                        </div>
                                        <h3 className="pv-light-gray"><i className="bi bi-chevron-right"></i></h3>
                                    </div>
                                </a>
                                <hr className="pv-gradient-hr" />
                            </div>
                            {userType == "creator" && (
                                <div>
                                    <a href="/create">
                                        <div className="d-flex justify-content-between align-items-center gap-2">
                                            <h3 className="pv-light-gray"><i className="bi bi-tools"></i></h3>
                                            <div className="w-100 d-flex flex-column justify-content-center">
                                                <h5 className="pv-white mb-0">My Creations</h5>
                                                <p className="pv-light-gray mb-0">Your created assets.</p>
                                            </div>
                                            <h3 className="pv-light-gray"><i className="bi bi-chevron-right"></i></h3>
                                        </div>
                                    </a>
                                    <hr className="pv-gradient-hr" />
                                </div>
                            )}
                        </div>
                    </section>
                    <section className="py-4 pv-black-bg">
                        <div className="container">
                            <h5 className="pv-red" onClick={handleLogout} style={{ cursor: "pointer" }}><i className="bi bi-door-open"></i> LOG OUT</h5>
                            <p className="pv-light-gray">Sign out of your PIXELVAULT account on this device.</p>
                            <hr className="pv-gradient-hr mt-4" />
                        </div>
                    </section>
                </main>
            )}
            <Footer />
        </>
    );
}

export default Account