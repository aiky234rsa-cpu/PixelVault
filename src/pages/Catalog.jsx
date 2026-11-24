import { useState, useEffect } from "react";

import Navbar from "../components/Navbar.jsx";
import SlideUp from "../components/SlideUp.jsx";
import DisplayCard from "../components/DisplayCard.jsx";
import Footer from "../components/Footer.jsx";

import bgcat from "../assets/imgs/bgcat.jfif";

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));

        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

function Catalog() {
    document.title = "Catalog | PixelVault";

    const [domain, setDomain] = useState("");

    const [displays, setDisplays] = useState(null);

    const [models, setModels] = useState(null);
    const [textures,setTextures] = useState(null);

    useEffect(() => {
        fetch("/domain.json")
            .then((response => response.json()))
            .then((data) => setDomain(data.domain_url))
            .catch(console.error)
    }, []);

    useEffect(() => {
        if (!domain) return;

        fetch(`${domain}/PixelVault/functionality/get_displays.php`, {
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setDisplays(data);

                let model_arr = data.find(display => display.name === "3D Models");
                setModels(shuffleArray(model_arr.products).slice(0, 4));

                let texture_arr = data.find(display => display.name === "Textures")
                setTextures(shuffleArray(texture_arr.products).slice(0,4));
            })
            .catch(console.error);
    }, [domain]);

    return (
        <>
            <Navbar />
            <main>
                <section className="py-4 py-lg-5 pv-black-bg">
                    <div className="container">
                        <SlideUp>
                            <h5 className="pv-blue">THE PIXELVAULT LIBRARY</h5>
                            <h2 className="pv-white font-press-start my-4">EXPLORE THE UNIVERSE.</h2>
                            <h3 className="pv-blue font-press-start">BUILT FOR CREATORS.</h3>
                            <p className="pv-light-gray">Discover 3D models, textures, materials and digital resources designed to bring your creative ideas to life.</p>
                        </SlideUp>
                    </div>
                </section>
                <img src={bgcat} alt="bgcat" className="pv-banner-img" />
                <section className="py-4 pv-dark-bg">
                    <div className="container">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="pv-white">3D Models</h5>
                            <a href="/catalog/3d-models" className="pv-gradient-link">VIEW ALL <i className="bi bi-arrow-right"></i></a>
                        </div>
                        <div className="row g-2">
                            {displays && models.map((model, index) => (
                                <div className="col-6 col-md-3" key={index}>
                                    <DisplayCard 
                                        url={`${domain}/PixelVault/var/${model.url}`} 
                                        display_type={model.display_type}
                                        name={model.name}
                                        author={model.username}
                                        price={model.price}
                                        pid={model.id}
                                        wishlisted={model.wishlisted}
                                        link={`/product/${model.id}`}
                                    />
                                </div>
                            ))}
                        </div>
                        <hr className="pv-gradient-hr my-4" />

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="pv-white">Textures</h5>
                            <a href="/catalog/textures" className="pv-gradient-link">VIEW ALL <i className="bi bi-arrow-right"></i></a>
                        </div>
                        <div className="row g-2">
                            {displays && textures.map((diff, index) => (
                                <div className="col-6 col-md-3" key={index}>
                                    <DisplayCard
                                        url={`${domain}/PixelVault/var/${diff.url}`}
                                        display_type={diff.display_type}
                                        name={diff.name}
                                        author={diff.username}
                                        price={diff.price}
                                        pid={diff.id}
                                        wishlisted={diff.wishlisted}
                                        link={`/product/${diff.id}`}
                                    />
                                </div>
                            ))}
                        </div>
                        <hr className="pv-gradient-hr my-4" />
                    </div>
                </section>
                <section className="py-4 py-lg-5 pv-black-bg">
                    <div className="container">
                        <div className="text-center">
                            <h5 className="pv-purple">PIXELVAULT MARKETPLACE</h5>
                            <h2 className="pv-white font-press-start my-4">CREATE SOMETHING EXTRAORDINARY.</h2>
                            <p className="pv-light-gray">Your next project deserves the right resources. Discover the full PIXELVAULT collection.</p>
                            <hr className="pv-gradient-hr mt-4 w-75 mx-auto" />
                        </div>
                    </div>
                </section>
            </main>
            <Footer/>
        </>
    );
}


export default Catalog