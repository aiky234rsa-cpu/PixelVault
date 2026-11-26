import Navbar from "../components/Navbar.jsx";
import SlideUp from "../components/SlideUp.jsx";
import Footer from "../components/Footer.jsx";
import "./About.css";

import bg1 from "../assets/about_imgs/bg1.jfif";
import bg2 from "../assets/about_imgs/bg2.jfif";

function About() {
    document.title = "About PixelVault";

    return (
        <>
            <Navbar />
            <main>
                <section className="py-4 py-lg-5 pv-black-bg">
                    <div className="container">
                        <SlideUp>
                            <h5 className="pv-blue">BUILT FOR CREATORS</h5>
                            <h2 className="pv-white font-press-start my-4">YOUR VISION. <span className="pv-blue">OUR UNIVERSE.</span></h2>
                            <p className="pv-light-gray">A creative marketplace for high-quality 3D assets, textures, materials and digital resources.</p>
                            <a href="/catalog"><button className="rainbow-button">EXPLORE ASSETS</button></a>
                        </SlideUp>
                    </div>
                </section>
                <img src={bg1} alt="img" className="pv-banner-img" />
                <section className="py-4 py-lg-5 pv-dark-bg">
                    <div className="container">
                        <h5 className="pv-blue">01 - WHO WE ARE</h5>
                        <SlideUp>
                            <h2 className="pv-white font-press-start">MORE THAN AN ASSET STORE.</h2>
                            <p className="pv-light-gray">PIXELVAULT is a digital marketplace designed to connect creators with the resources they need to bring their ideas to life.</p>
                            <p className="pv-light-gray mb-0">From individual 3D models to complete environment packs, we aim to make discovering and accessing creative resources easier.</p>
                        </SlideUp>
                    </div>
                </section>
                <section className="py-4 py-lg-5 pv-black-bg">
                    <div className="container">
                        <h5 className="pv-green">02 - WHAT WE OFFER</h5>
                        <SlideUp>
                            <h2 className="pv-white font-press-start my-4">EVERYTHING YOU NEED TO CREATE.</h2>
                        </SlideUp>
                        <div className="row g-3">
                            <div className="col-6">
                                <div className="pv-card">
                                    <div className="p-3">
                                        <h4 className="pv-blue"><i className="bi bi-box"></i></h4>
                                        <h5 className="pv-white">3D MODELS</h5>
                                        <a href="#" className="pv-gradient-link">EXPLORE <i className="bi bi-arrow-right"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="pv-card">
                                    <div className="p-3">
                                        <h4 className="pv-red"><i className="bi bi-layers"></i></h4>
                                        <h5 className="pv-white">TEXTURES</h5>
                                        <a href="#" className="pv-gradient-link">EXPLORE <i className="bi bi-arrow-right"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="pv-card">
                                    <div className="p-3">
                                        <h4 className="pv-green"><i className="bi bi-palette"></i></h4>
                                        <h5 className="pv-white">MATERIALS</h5>
                                        <a href="#" className="pv-gradient-link">EXPLORE <i className="bi bi-arrow-right"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="pv-card">
                                    <div className="p-3">
                                        <h4 className="pv-purple"><i className="bi bi-triangle"></i></h4>
                                        <h5 className="pv-white">ENVIRONMENTS</h5>
                                        <a href="#" className="pv-gradient-link">EXPLORE <i className="bi bi-arrow-right"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="pv-card">
                                    <div className="p-3">
                                        <h4 className="pv-blue"><i className="bi bi-boxes"></i></h4>
                                        <h5 className="pv-white">ASSET PACKS</h5>
                                        <a href="#" className="pv-gradient-link">EXPLORE <i className="bi bi-arrow-right"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="pv-card">
                                    <div className="p-3">
                                        <h4 className="pv-red"><i className="bi bi-file-earmark-code"></i></h4>
                                        <h5 className="pv-white">GAME SCRIPTS</h5>
                                        <a href="#" className="pv-gradient-link">EXPLORE <i className="bi bi-arrow-right"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-4 py-lg-5 pv-dark-bg">
                    <div className="container">
                        <h5 className="pv-purple">03 - OUR MISSION</h5>
                        <SlideUp>
                            <h2 className="pv-white font-press-start my-4">GREAT IDEAS DESERVE GREAT TOOLS.</h2>
                            <p className="pv-light-gray">Our mission is to help creators spend less time searching for resources and more time creating something remarkable.</p>
                        </SlideUp>
                    </div>
                </section>
                <img src={bg2} alt="bg2" className="pv-banner-img" />
                <section className="py-4 py-lg-5 pv-black-bg">
                    <div className="container">
                        <h5 className="pv-red">04 - WHY PIXELVAULT?</h5>
                        <SlideUp>
                            <h2 className="pv-white font-press-start my-4">MADE FOR YOUR WORKFLOW.</h2>
                        </SlideUp>
                        <SlideUp>
                            <h4 className="pv-white"><span className="pv-green"><i className="bi bi-check-circle"></i></span> Curated Resources</h4>
                            <h5 className="pv-light-gray ms-4">Discover organized digital assets for different creative needs.</h5>
                        </SlideUp>
                        <SlideUp>
                            <h4 className="pv-white"><span className="pv-green"><i className="bi bi-check-circle"></i></span> Quality First</h4>
                            <h5 className="pv-light-gray ms-4">Find assets with useful previews and clear product information.</h5>
                        </SlideUp>
                        <SlideUp>
                            <h4 className="pv-white"><span className="pv-green"><i className="bi bi-check-circle"></i></span> Creator Focused</h4>
                            <h5 className="pv-light-gray ms-4">A platform designed around the needs of digital artists and developers.</h5>
                        </SlideUp>
                        <SlideUp>
                            <h4 className="pv-white"><span className="pv-green"><i className="bi bi-check-circle"></i></span> Easy Access</h4>
                            <h5 className="pv-light-gray ms-4">Keep your purchased resources accessible from your account.</h5>
                        </SlideUp>
                    </div>
                </section>
                <section className="py-4 py-lg-5 pv-dark-bg">
                    <div className="container">
                        <h5 className="pv-blue">05 — JOIN THE COMMUNITY</h5>
                        <SlideUp>
                            <h2 className="pv-white font-press-start my-4">CREATE SOMETHING EXTRAORDINARY.</h2>
                            <p className="pv-light-gray">Whether you're building a game, designing a scene or creating your next project, your next resource might be waiting here.</p>
                            <a href="/catalog"><button className="w-100 rainbow-button">EXPLORE THE MARKETPLACE <i className="bi bi-arrow-right"></i></button></a>
                        </SlideUp>
                        <hr className="my-4 pv-gradient-hr" />
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default About