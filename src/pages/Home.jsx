import "./Home.css";

import Navbar from "../components/Navbar.jsx";
import SlideUp from "../components/SlideUp.jsx";
import Footer from "../components/Footer.jsx";

import geometry_image from "../assets/imgs/geometry.jpg";
import model from "../assets/imgs/model.jfif";
import texture from "../assets/imgs/texture.jfif";
import material from "../assets/imgs/material.jfif";
import environment from "../assets/imgs/world.jfif";
import asset from "../assets/imgs/asset.jfif";
import script from "../assets/imgs/script.jfif";
import weapon from "../assets/imgs/weapon.jfif";
import factory from "../assets/imgs/factory.jfif";
import concrete from "../assets/imgs/concrete.jfif";
import village from "../assets/imgs/village.jfif";

function Home() {
    document.title = "PixelVault";

    return (
        <>
            <Navbar />
            <main>
                <section className="py-4 py-lg-5 pv-black-bg">
                    <div className="container">
                        <SlideUp>
                            <h6 className="pv-white"><span className="pv-red"><i className="bi bi-dot"></i></span> THE ULTIMATE 3D MARKETPLACE</h6>
                            <h2 className="pv-white font-press-start">YOUR IMAGINATION.</h2>
                            <h2 className="pv-white font-press-start">OUR <span className="pv-red">ASSETS.</span></h2>
                            <p className="pv-light-gray">Discover premium 3D models, realistic textures, materials and environments to bring your creative vision to life.</p>
                            <button className="rainbow-button">EXPLORE NOW <i className="bi bi-arrow-up-right"></i></button>
                            <a href="#collection"><button className="rainbow-fill-button ms-2">OUR COLLECTION</button></a>
                        </SlideUp>
                    </div>
                </section>
                <img src={geometry_image} alt="geometry" className="pv-banner-img" />
                <section className="py-4 pv-dark-bg" id="collection">
                    <div className="container">
                        <SlideUp>
                            <h6 className="pv-white"><span className="pv-green"><i className="bi bi-dot"></i></span> SHOP BY CATEGORY</h6>
                            <h2 className="pv-white font-press-start">EXPLORE THE <span className="pv-green">VAULT.</span></h2>
                        </SlideUp>
                        <hr className="my-4 pv-gradient-hr" />
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
                <section className="py-4 pv-black-bg">
                    <div className="container">
                        <SlideUp>
                            <h6 className="pv-white"><span className="pv-blue"><i className="bi bi-dot"></i></span> FEATURED ASSETS</h6>
                            <h2 className="pv-white font-press-start mb-3">FIND WHAT YOU <span className="pv-blue">NEED.</span></h2>
                            <div className="d-flex justify-content-between align-items-center">
                                <h6 className="pv-light-gray mb-0">Selected creations from the vault.</h6>
                                <a href="#" className="pv-gradient-link">VIEW ALL <i className="bi bi-arrow-up-right"></i></a>
                            </div>
                        </SlideUp>
                        <hr className="my-4 pv-gradient-hr" />
                        <div className="row g-3">
                            <div className="col-6 col-md-3 pv-col">
                                <SlideUp>
                                    <a href="#" className="pv-card-link">
                                        <div className="pv-card">
                                            <img src={weapon} alt="image" className="pv-card-img" />
                                            <div className="p-3">
                                                <h5 className="mb-1 pv-white">Tactical Weapon Pack</h5>
                                                <h6 className="pv-light-gray">BLEND · FBX · 3D MODELS</h6>
                                                <div className="d-flex justify-content-between">
                                                    <h5 className="pv-white">$24.99</h5>
                                                    <h5 className="pv-white"><i className="bi bi-heart"></i></h5>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </SlideUp>
                            </div>
                            <div className="col-6 col-md-3 pv-col">
                                <SlideUp>
                                    <a href="#" className="pv-card-link">
                                        <div className="pv-card">
                                            <img src={factory} alt="image" className="pv-card-img" />
                                            <div className="p-3">
                                                <h5 className="mb-1 pv-white">Abandoned Factory</h5>
                                                <h6 className="pv-light-gray">BLEND · ENVIRONMENT</h6>
                                                <div className="d-flex justify-content-between">
                                                    <h5 className="pv-white">$39.99</h5>
                                                    <h5 className="pv-white"><i className="bi bi-heart"></i></h5>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </SlideUp>
                            </div>
                            <div className="col-6 col-md-3 pv-col">
                                <SlideUp>
                                    <a href="#" className="pv-card-link">
                                        <div className="pv-card">
                                            <img src={concrete} alt="image" className="pv-card-img" />
                                            <div className="p-3">
                                                <h5 className="mb-1 pv-white">Concrete Surface Pack</h5>
                                                <h6 className="pv-light-gray">4K · PBR TEXTURES</h6>
                                                <div className="d-flex justify-content-between">
                                                    <h5 className="pv-white">$4.99</h5>
                                                    <h5 className="pv-white"><i className="bi bi-heart"></i></h5>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </SlideUp>
                            </div>
                            <div className="col-6 col-md-3 pv-col">
                                <SlideUp>
                                    <a href="#" className="pv-card-link">
                                        <div className="pv-card">
                                            <img src={village} alt="image" className="pv-card-img" />
                                            <div className="p-3">
                                                <h5 className="mb-1 pv-white">Fantasy Village Pack</h5>
                                                <h6 className="pv-light-gray">FBX · BLEND · ASSET PACK</h6>
                                                <div className="d-flex justify-content-between">
                                                    <h5 className="pv-white">$29.99</h5>
                                                    <h5 className="pv-white"><i className="bi bi-heart"></i></h5>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </SlideUp>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-4 py-lg-5 pv-dark-bg">
                    <div className="container">
                        <SlideUp>
                            <h6 className="pv-white"><span className="pv-red"><i className="bi bi-dot"></i></span> SPECIAL COLLECTION</h6>
                            <h2 className="pv-white font-press-start">RENDER YOUR NEXT WORLD.</h2>
                            <h2 className="pv-green font-press-start">SAVE UP TO 35%.</h2>
                            <p className="pv-light-gray">Discover our curated collection of premium environment assets.</p>
                            <button className="rainbow-button">SHOP COLLECTION <i className="bi bi-arrow-up-right"></i></button>
                        </SlideUp>
                        <hr className="mt-4 pv-gradient-hr" />
                    </div>
                </section>
                <section className="py-4 py-lg-5 pv-black-bg">
                    <div className="container">
                        <SlideUp>
                            <h1 className="pv-white font-press-start mb-4">WHY <span className="pv-red">PIXELVAULT?</span></h1>
                        </SlideUp>
                        <div className="row g-3">
                            <div className="col-6 pv-col">
                                <div className="pv-card">
                                    <div className="p-3">
                                        <h4 className="pv-red"><i className="bi bi-shield-check"></i></h4>
                                        <h5 className="pv-white">Premium Quality</h5>
                                        <p className="pv-light-gray mb-0">Carefully curated assets.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 pv-col">
                                <div className="pv-card">
                                    <div className="p-3">
                                        <h4 className="pv-green"><i className="bi bi-download"></i></h4>
                                        <h5 className="pv-white">Instant Downloads</h5>
                                        <p className="pv-light-gray mb-0">Access your purchases anytime.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 pv-col">
                                <div className="pv-card">
                                    <div className="p-3">
                                        <h4 className="pv-blue"><i className="bi bi-layers-half"></i></h4>
                                        <h5 className="pv-white">Multiple Formats</h5>
                                        <p className="pv-light-gray mb-0">Assets for different workflows.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 pv-col">
                                <div className="pv-card">
                                    <div className="p-3">
                                        <h4 className="pv-purple"><i className="bi bi-arrow-repeat"></i></h4>
                                        <h5 className="pv-white">Regular Updates</h5>
                                        <p className="pv-light-gray mb-0">Keep your assets up to date.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-4 py-lg-5 pv-dark-bg">
                    <div className="container">
                        <SlideUp>
                            <h2 className="font-press-start"><span className="pv-red">JOIN </span><span className="pv-green">THE </span> <span className="pv-blue">VAULT</span></h2>
                            <p className="pv-light-gray">Get the latest 3D assets, new releases and exclusive offers.</p>
                            <form>
                                <div className="pv-input-wrap">
                                    <input type="email" className="pv-input" placeholder="Your email address" />
                                </div>
                                <button className="rainbow-button w-100 mt-3" type="submit">SUBSCRIBE <i className="bi bi-arrow-up-right"></i></button>
                            </form>
                        </SlideUp>
                    </div>
                </section>
            </main>
            <Footer/>
        </>
    );
}

export default Home