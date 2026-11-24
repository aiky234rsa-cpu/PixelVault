import "./CreatorPage.css";

import Navbar from "../components/Navbar.jsx";
import SlideUp from "../components/SlideUp.jsx";
import Footer from "../components/Footer.jsx";

import cbg1 from "../assets/imgs/cbg1.jfif";
import model from "../assets/imgs/model.jfif";
import texture from "../assets/imgs/texture.jfif";
import material from "../assets/imgs/material.jfif";
import environment from "../assets/imgs/world.jfif";
import asset from "../assets/imgs/asset.jfif";
import script from "../assets/imgs/script.jfif";

import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "bootstrap";
import { useAuth } from "../AuthContext.jsx";

function CreatorPage() {
    document.title = "Become a Creator | PixelVault";

    const navigate = useNavigate();
    const [domain, setDomain] = useState("");
    const { isSignedIn, userType, setUserType } = useAuth();

    const modalRef = useRef(null);
    const agreed = useRef(false);
    const processing = useRef(false);

    function openModal() {
        const modal = Modal.getOrCreateInstance(modalRef.current);
        modal.show();
    }

    function closeModal() {
        const modal = Modal.getInstance(modalRef.current);
        modal.hide();
    }

    useEffect(() => {
        fetch("/domain.json")
            .then((response => response.json()))
            .then((data) => setDomain(data.domain_url))
            .catch(console.error)
    }, []);

    async function handleTypeChange() {
        if (!agreed.current || userType == "creator") {
            return;
        }

        if (!isSignedIn) {
            navigate("/signup");
            return;
        }

        if (!processing.current) {
            processing.current = true;
            await fetch(`${domain}/PixelVault/auth/go_creator.php`, {
                credentials: "include"
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setUserType("creator");
                        navigate("/account");
                    }
                })
                .catch(console.error)
                .finally(() => processing.current = false);
        }
    }

    return (
        <>
            <Navbar />
            <main>
                <section className="py-4 py-lg-5 pv-black-bg">
                    <div className="container">
                        <SlideUp>
                            <h5 className="pv-green">CREATOR PROGRAM</h5>
                            <h2 className="pv-white font-press-start mt-3">CREATE. UPLOAD. EARN.</h2>
                            <h3 className="pv-green font-press-start mb-3">YOUR WORK DESERVES AN AUDIENCE.</h3>
                            <p className="pv-light-gray">Turn your digital creations into products. Join PIXELVAULT and start sharing your assets with creators around the world.</p>
                            <a href="#create"><button className="w-100 rainbow-button">BECOME A CREATOR <i className="bi bi-arrow-right"></i></button></a>
                        </SlideUp>
                    </div>
                </section>
                <img src={cbg1} alt="cbg1" className="pv-banner-img" />
                <section className="py-4 py-lg-5 pv-dark-bg">
                    <div className="container">
                        <SlideUp>
                            <h5 className="pv-red">WHY BECOME A CREATOR?</h5>
                            <h2 className="my-3 pv-white font-press-start">YOUR CREATIONS. YOUR OPPORTUNITY.</h2>
                        </SlideUp>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="pv-card w-100 p-3 h-100">
                                    <h4 className="pv-blue"><i className="bi bi-globe2"></i></h4>
                                    <h5 className="pv-white">Reach More Creators</h5>
                                    <p className="pv-light-gray mb-0">Make your digital assets available to people looking for resources for their projects.</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="pv-card w-100 p-3 h-100">
                                    <h4 className="pv-green"><i className="bi bi-wallet2"></i></h4>
                                    <h5 className="pv-white">Earn From Your Work</h5>
                                    <p className="pv-light-gray mb-0">Sell your creations and earn revenue from successful purchases.</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="pv-card w-100 p-3 h-100">
                                    <h4 className="pv-purple"><i className="bi bi-cloud-arrow-up"></i></h4>
                                    <h5 className="pv-white">Simple Publishing</h5>
                                    <p className="pv-light-gray mb-0">Upload your assets, provide their details, and manage your products.</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="pv-card w-100 p-3 h-100">
                                    <h4 className="pv-red"><i className="bi bi-graph-up"></i></h4>
                                    <h5 className="pv-white">Track Your Progress</h5>
                                    <p className="pv-light-gray mb-0">Keep track of sales, downloads, revenue, and product performance.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-4 py-lg-5 pv-black-bg">
                    <div className="container">
                        <h5 className="pv-blue">WHAT CAN YOU SELL?</h5>
                        <h2 className="pv-white font-press-start my-3">YOUR SKILLS. YOUR ASSETS.</h2>
                        <div className="row g-3">
                            <div className="col-6 col-md-4 pv-col">
                                <SlideUp>
                                    <div className="pv-card">
                                        <img src={model} alt="3D models" className="pv-card-img" />
                                        <div className="p-3">
                                            <h4 className="mb-1 pv-white">3D MODELS</h4>
                                            <p className="mb-2 pv-light-gray">Characters, objects & props</p>
                                            <a href="#" className="pv-gradient-link">EXPLORE <i className="bi bi-arrow-right"></i></a>
                                        </div>
                                    </div>
                                </SlideUp>
                            </div>
                            <div className="col-6 col-md-4 pv-col">
                                <SlideUp>
                                    <div className="pv-card">
                                        <img src={texture} alt="3D models" className="pv-card-img" />
                                        <div className="p-3">
                                            <h4 className="mb-1 pv-white">TEXTURES</h4>
                                            <p className="mb-2 pv-light-gray">Surfaces & PBR maps</p>
                                            <a href="#" className="pv-gradient-link">EXPLORE <i className="bi bi-arrow-right"></i></a>
                                        </div>
                                    </div>
                                </SlideUp>
                            </div>
                            <div className="col-6 col-md-4 pv-col">
                                <SlideUp>
                                    <div className="pv-card">
                                        <img src={material} alt="3D models" className="pv-card-img" />
                                        <div className="p-3">
                                            <h4 className="mb-1 pv-white">MATERIALS</h4>
                                            <p className="mb-2 pv-light-gray">Shaders & surfaces</p>
                                            <a href="#" className="pv-gradient-link">EXPLORE <i className="bi bi-arrow-right"></i></a>
                                        </div>
                                    </div>
                                </SlideUp>
                            </div>
                            <div className="col-6 col-md-4 pv-col">
                                <SlideUp>
                                    <div className="pv-card">
                                        <img src={environment} alt="3D models" className="pv-card-img" />
                                        <div className="p-3">
                                            <h4 className="mb-1 pv-white">ENVIRONMENTS</h4>
                                            <p className="mb-2 pv-light-gray">Complete 3D worlds</p>
                                            <a href="#" className="pv-gradient-link">EXPLORE <i className="bi bi-arrow-right"></i></a>
                                        </div>
                                    </div>
                                </SlideUp>
                            </div>
                            <div className="col-6 col-md-4 pv-col">
                                <SlideUp>
                                    <div className="pv-card">
                                        <img src={asset} alt="3D models" className="pv-card-img" />
                                        <div className="p-3">
                                            <h4 className="mb-1 pv-white">ASSET PACKS</h4>
                                            <p className="mb-2 pv-light-gray">Complete collections</p>
                                            <a href="#" className="pv-gradient-link">EXPLORE <i className="bi bi-arrow-right"></i></a>
                                        </div>
                                    </div>
                                </SlideUp>
                            </div>
                            <div className="col-6 col-md-4 pv-col">
                                <SlideUp>
                                    <div className="pv-card">
                                        <img src={script} alt="3D models" className="pv-card-img" />
                                        <div className="p-3">
                                            <h4 className="mb-1 pv-white">GAME SCRIPTS</h4>
                                            <p className="mb-2 pv-light-gray">Ready-to-use scripts</p>
                                            <a href="#" className="pv-gradient-link">EXPLORE <i className="bi bi-arrow-right"></i></a>
                                        </div>
                                    </div>
                                </SlideUp>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-4 py-lg-5 pv-dark-bg">
                    <div className="container">
                        <h5 className="pv-purple">HOW IT WORKS</h5>
                        <h2 className="pv-white my-3 font-press-start">THREE STEPS. THAT'S IT.</h2>
                        <SlideUp>
                            <h4 className="pv-red"><i className="bi bi-1-circle"></i> - Become a Creator</h4>
                            <p className="pv-light-gray">Activate your creator account with one click. No lengthy application process.</p>
                        </SlideUp>
                        <SlideUp>
                            <h4 className="pv-green"><i className="bi bi-2-circle"></i> - Upload Your Assets</h4>
                            <p className="pv-light-gray">Access your creator dashboard, upload your files, add previews, descriptions, formats and pricing.</p>
                        </SlideUp>
                        <SlideUp>
                            <h4 className="pv-blue"><i className="bi bi-3-circle"></i> - Publish & Earn</h4>
                            <p className="pv-light-gray">Submit your products for any required marketplace checks, publish them, and start selling once approved.</p>
                        </SlideUp>
                    </div>
                </section>
                <section className="py-4 py-lg-5 pv-black-bg" id="create">
                    <div className="container">
                        <h5 className="pv-green">ONE-CLICK ACTIVATION</h5>
                        <SlideUp>
                            <div className="text-center my-3">
                                <h2 className="pv-white font-press-start">READY TO START CREATING?</h2>
                                <p className="pv-light-gray">Your PIXELVAULT account is all you need. Activate your creator status and unlock your creator dashboard.</p>
                            </div>
                        </SlideUp>
                        <SlideUp>
                            <div className="w-100 rounded-2 pv-dark-bg p-3" style={{ border: "1px solid var(--pv-border)" }}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="pv-white mb-0">
                                        <span className={`${isSignedIn ? "pv-green" : "pv-red"}`}>
                                            <i className={`bi ${isSignedIn ? "bi-person-check" : "bi-person-exclamation"}`}></i>
                                        </span> Your account
                                    </h5>
                                    {isSignedIn ? (
                                        <p className="pv-green mb-0">Signed in</p>
                                    ) : (
                                        <p className="pv-red mb-0">Not Signed in</p>
                                    )}
                                </div>
                                <hr className="pv-white my-3" />
                                <div className="d-flex justify-content-between">
                                    <h6 className="pv-white">Creator status</h6>
                                    {userType == "creator" ? (
                                        <h6 className="pv-green">Activated</h6>
                                    ) : (
                                        <h6 className="pv-red">Not activated</h6>
                                    )}
                                </div>
                                <p className="mb-0 pv-light-gray">
                                    {`${userType == "creator" ? "User is already eligible to create." : "No additional personal information required."}`}
                                </p>
                            </div>
                            {userType != "creator" ? (
                                <button className="w-100 rainbow-button my-2" onClick={openModal}>BECOME A CREATOR <i className="bi bi-arrow-right"></i></button>
                            ) : (
                                <button className="w-100 rainbow-button my-2">START CREATING <i className="bi bi-arrow-right"></i></button>
                            )}
                            {userType != "creator" && (
                                <div className="text-center">
                                    <p className="mb-0 pv-light-gray">By activating, you agree to the Creator Terms and Marketplace policies.</p>
                                </div>
                            )}
                        </SlideUp>
                    </div>
                </section>
                <div className="modal fade" ref={modalRef} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content w-100 rounded-2 pv-dark-bg p-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="pv-white font-press-start mb-0">BECOME A CREATOR?</h5>
                                <h6 className="pv-light-gray mb-0" style={{ cursor: "pointer" }} onClick={closeModal}><i className="bi bi-x"></i></h6>
                            </div>
                            <p className="pv-light-gray">You're one step away from accessing your creator dashboard and uploading your own digital assets.</p>
                            <div className="w-100 rounded-2 pv-dark-light-bg p-3">
                                <p className="pv-white"><span className="pv-green"><i className="bi bi-check-circle"></i></span> Immediate creator access</p>
                                <p className="pv-white"><span className="pv-green"><i className="bi bi-check-circle"></i></span> Upload and manage your products</p>
                                <p className="pv-white mb-0"><span className="pv-green"><i className="bi bi-check-circle"></i></span> Track your sales and earnings</p>
                            </div>
                            <p className="pv-light-gray my-1">You must accept the Creator Terms and Marketplace Policies to continue.</p>
                            <div className="form-check my-2">
                                <input type="checkbox" className="form-check-input" id="check" onChange={() => agreed.current = !agreed.current} />
                                <label htmlFor="check" className="form-check-label pv-white">I agree to the Creator Terms.</label>
                            </div>
                            <button className="rainbow-button w-100" onClick={handleTypeChange}>ACTIVATE MY CREATOR ACCOUNT</button>
                            <div className="text-center">
                                <p className="pv-light-gray mt-1 mb-0" style={{ cursor: "pointer" }} onClick={closeModal}>Maybe later</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default CreatorPage