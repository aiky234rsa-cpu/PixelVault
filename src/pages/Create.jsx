import Navbar from "../components/Navbar.jsx";
import SlideUp from "../components/SlideUp.jsx";
import Footer from "../components/Footer.jsx";

import { useState, useEffect, useMemo, Suspense, Component } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { useAuth } from "../AuthContext.jsx";
import { useGLTF, Stage, useProgress, Environment, Html, useTexture } from "@react-three/drei";
import { RepeatWrapping } from "three";

class ModelErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="pv-model-error">
                    Unable to load 3D model
                </div>
            );
        }

        return this.props.children;
    }
}

function Loader() {
    const { progress } = useProgress();
    return <Html center>{progress.toFixed(0)}%</Html>;
}

function Model({ url }) {
    const { scene } = useGLTF(url);

    const clonedScene = useMemo(() => {
        return scene.clone(true);
    }, [scene]);

    return <primitive object={clonedScene} />;
}

function TextureBall({ url }) {
    const texture = useTexture(url, (t) => {
        t.wrapS = t.wrapT = RepeatWrapping;
        t.repeat.set(4, 2);
    });

    return (
        <mesh>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial map={texture} />
        </mesh>
    )
}

function ModelViewer({ url, display_type }) {
    if (display_type === "Model") {
        return (
            <div
                style={{
                    width: "150px",
                    height: "150px",
                    border: "2px solid var(--pv-border)",
                    borderRadius: "10px"
                }}
            >
                <ModelErrorBoundary>
                    <Canvas camera={{ fov: 45, position: [0, 1, 5] }}>
                        <Suspense fallback={<Loader />}>
                            <Stage environment="city" intensity={0.6} adjustCamera>
                                <Model url={url} />
                            </Stage>
                        </Suspense>
                    </Canvas>
                </ModelErrorBoundary>
            </div>
        );
    } else if (display_type === "Texture") {
        return (
            <div
                style={{
                    width: "150px",
                    height: "150px",
                    border: "2px solid var(--pv-border)",
                    borderRadius: "10px"
                }}
            >
                <ModelErrorBoundary>
                    <Canvas camera={{ fov: 45, position: [0, 0, 3.5] }}>
                        <Suspense fallback={<Loader />}>
                            <Environment preset="city" />
                            <TextureBall url={url} />
                        </Suspense>
                    </Canvas>
                </ModelErrorBoundary>
            </div>
        );
    }
}

function Create() {
    document.title = "My Creations | PixelVault";

    const [domain, setDomain] = useState("");
    const [processing, setProcessing] = useState(true);
    const [creations, setCreations] = useState([]);
    const [visibleCount, setVisibleCount] = useState(5);
    const [query, setQuery] = useState("");
    const [search, setSearch] = useState("");

    const { isSignedIn, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/domain.json")
            .then((response => response.json()))
            .then((data) => setDomain(data.domain_url))
            .catch(console.error)
    }, []);

    useEffect(() => {
        if (!domain) return;

        fetch(`${domain}/PixelVault/creator/get_cproducts.php`, {
            credentials: "include"
        })
            .then(response => response.json())
            .then(data => {
                setCreations(data);
                console.log(data);
            })
            .catch(console.error)
            .finally(() => setProcessing(false));
    }, [domain]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return creations.filter((prod) => {
            if (q && !String(prod.name ?? "").toLowerCase().includes(q)) {
                return false;
            }

            return true;
        })
    },[creations,search]);

    const products = filtered.slice(0,visibleCount);

    if (!loading && !isSignedIn) {
        navigate("/");
        return;
    }

    return (
        <>
            <Navbar />
            <main>
                <section className="py-4 py-lg-5 pv-black-bg">
                    <div className="container">
                        <SlideUp>
                            <h2 className="pv-white font-press-start">MY PRODUCTS</h2>
                            <p className="pv-light-gray">Manage your creations and share your work with the world.</p>
                            <button className="rainbow-button w-100" onClick={() => navigate("/create/new")}>+ UPLOAD NEW ASSET</button>
                        </SlideUp>
                    </div>
                </section>
                <hr className="my-0 pv-gradient-hr" />
                <section className="py-4 pv-black-bg">
                    <div className="container">
                        {processing ? (
                            <h1 className="pv-white font-press-start">Loading...</h1>
                        ) : creations.length == 0 ? (
                            <div className="text-center">
                                <h1 className="pv-light-gray"><i className="bi bi-box-seam"></i></h1>
                                <h2 className="font-press-start pv-white">NOTHING HERE. YET.</h2>
                                <p className="pv-light-gray">Your creative journey starts with your first upload. Share your work with the PIXELVAULT community.</p>
                                <button className="rainbow-button">UPLOAD YOUR FIRST ASSET <i className="bi bi-arrow-right"></i></button>
                            </div>
                        ) : (
                            <>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="pv-white mb-0">Your Assets</h5>
                                    <p className="pv-light-gray mb-0">{creations.length} Products</p>
                                </div>
                                <div className="pv-input-wrap">
                                    <input type="text" className="pv-input" placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)}/>
                                    <i className="bi bi-search pv-password-toggle" onClick={() => {setSearch(query)}}></i>
                                </div>
                                <hr className="pv-gradient-hr my-3" />
                                {products.map((asset, index) => (
                                    <div key={index}>
                                        <div className="d-flex justify-content-between align-items-center gap-3">
                                            <a href={`/product/${asset.id}`}>
                                                <ModelViewer url={`${domain}/PixelVault/var/${asset.url}`} display_type={asset.display_type}/>
                                            </a>
                                            <div className="w-100 d-flex flex-column">
                                                <h5 className="pv-white">{asset.name}</h5>
                                                <p className="mb-0 pv-light-gray">{asset.category} · ${asset.price}</p>
                                            </div>
                                            <h4 className="pv-white" style={{cursor:"pointer"}} onClick={() => navigate(`/create/edit?pid=${asset.id}`)}><i className="bi bi-pencil"></i></h4>
                                        </div>
                                        <hr className="pv-gradient-hr my-3" />
                                    </div>
                                ))}
                                {visibleCount < creations.length && (
                                    <div className="text-center">
                                        <button className="rainbow-button" onClick={() => setVisibleCount((count) => count + 5)}><i className="bi bi-plus-circle"></i> SHOW MORE</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </main>
            <Footer/>
        </>
    );
}

export default Create