import Navbar from "../components/Navbar.jsx";
import SlideUp from "../components/SlideUp.jsx";
import Footer from "../components/Footer.jsx";

import { useState, useEffect, useMemo, Suspense, Component } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage, useProgress, Environment, Html, useTexture } from "@react-three/drei";
import { RepeatWrapping } from "three";
import { useAuth } from "../AuthContext.jsx";

import { useParams, useNavigate } from "react-router-dom";

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

function ModelViewer({ url, display_type, cam_control = false, width, height, is_cover = false, func = () => { }, selected = false }) {
    if (display_type === "Model") {
        return (
            <div
                style={{
                    width: width,
                    height: height,
                    borderRadius: "10px",
                    border: "2px solid",
                    borderColor: `${!is_cover && selected ? "var(--pv-white)" : "var(--pv-border)"}`,
                    backgroundColor: "var(--pv-dark)",
                    cursor: `${!is_cover && "pointer"}`
                }}
                onClick={func}
            >
                <ModelErrorBoundary>
                    <Canvas camera={{ fov: 45, position: [0, 1, 5] }}>
                        <Suspense fallback={<Loader />}>
                            <Stage environment="city" intensity={0.6} adjustCamera>
                                <Model url={url} />
                            </Stage>
                        </Suspense>
                        {cam_control && (
                            <OrbitControls makeDefault autoRotate />
                        )}
                    </Canvas>
                </ModelErrorBoundary>
            </div>
        );
    } else if (display_type === "Texture") {
        return (
            <div
                style={{
                    width: width,
                    height: height,
                    borderRadius: "10px",
                    border: "2px solid",
                    borderColor: `${!is_cover && selected ? "var(--pv-white)" : "var(--pv-border)"}`,
                    backgroundColor: "var(--pv-dark)",
                    cursor: `${!is_cover && "pointer"}`
                }}
                onClick={func}
            >
                <ModelErrorBoundary>
                    <Canvas camera={{ fov: 45, position: [0, 0, 3.5] }}>
                        <Suspense fallback={<Loader />}>
                            <Environment preset="city" />
                            <TextureBall url={url} />
                        </Suspense>
                        {cam_control && (
                            <OrbitControls makeDefault autoRotate enableRotate={true} enableZoom={true} enablePan={false} />
                        )}
                    </Canvas>
                </ModelErrorBoundary>
            </div>
        )
    }
}

function Product() {
    const { id } = useParams();

    const [domain, setDomain] = useState("");
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [displays, setDisplays] = useState(null);
    const [dispPos, setDispPos] = useState(0);
    const [wished, setWished] = useState(false);
    const [inCart, setInCart] = useState(false);
    const [processing, setProcessing] = useState(false);

    const { isSignedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/domain.json")
            .then((response => response.json()))
            .then((data) => setDomain(data.domain_url))
            .catch(console.error)
    }, []);

    useEffect(() => {
        if (!domain) return;

        fetch(`${domain}/PixelVault/functionality/get_product.php?pid=${id}`,{
            credentials: "include"
        })
            .then(response => response.json())
            .then(data => {
                if (!data.message) {
                    console.log(data);
                    setProduct(data);
                    setWished(data.wishlisted);
                    setInCart(data.in_cart);
                } else {
                    setNotFound(true);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [domain, id]);

    useEffect(() => {
        if (product) {
            document.title = product.name + " | PixelVault";

            let disp = product.displays;
            disp.sort((a, b) => a.position - b.position);
            setDisplays(disp);
        }
    }, [product]);

    async function wish() {
        if (!isSignedIn) {
            navigate("/signup");
            return;
        }

        if (!processing) {
            setProcessing(true);
            await fetch(
                `${domain}/PixelVault/functionality/wishlist.php`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    product_id: id
                })
            }
            )
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setWished(data.wished);
                    }
                })
                .catch(console.error)
                .finally(() => setProcessing(false));
        }
    }

    async function toCart() {
        if (!isSignedIn) {
            navigate("/signup");
            return;
        }

        if (!processing) {
            setProcessing(true);
            await fetch(
                `${domain}/PixelVault/functionality/cart.php`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    product_id: id
                })
            }
            )
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setInCart(data.in_cart);
                        if (data.in_cart) {
                            navigate("/cart");
                        }
                    }
                })
                .catch(console.error)
                .finally(() => setProcessing(false));
        }
    } 

    return (
        <>
            <Navbar />
            <main>
                <section className="py-4 pv-black-bg">
                    <div className="container-fluid">
                        {loading ? (
                            <h1 className="pv-white font-press-start">Loading...</h1>
                        ) : notFound ? (
                            <div className="text-center">
                                <h1 className="pv-white font-press-start">404 Error not found</h1>
                            </div>
                        ) : (
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <h6 className="pv-light-gray">CATALOG / {product.category_name.toUpperCase()} / {product.name.toUpperCase()}</h6>
                                    {displays && (
                                        <>
                                            <ModelViewer
                                                url={`${domain}/PixelVault/var/${displays[dispPos].url}`}
                                                display_type={displays[dispPos].display_type}
                                                cam_control
                                                width="100%"
                                                height="350px"
                                                is_cover
                                            />
                                            <div className="row g-2 mt-1">
                                                {displays.map((dispo, index) => (
                                                    <div className="col-4" key={index}>
                                                        <ModelViewer
                                                            url={`${domain}/PixelVault/var/${dispo.url}`}
                                                            display_type={dispo.display_type}
                                                            width="100%"
                                                            height="100%"
                                                            func={() => setDispPos(index)}
                                                            selected={dispPos === index}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="col-md-6">
                                    <SlideUp>
                                        <h4 className="pv-white font-press-start">{product.name}</h4>
                                        <h5 className="pv-white">By {product.author}</h5>
                                        <p className="pv-light-gray">{product.description ? product.description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum veritatis, aliquid totam ea modi voluptatibus."}</p>
                                        <h4 className="pv-white font-press-start">${product.price.toFixed(2)}</h4>
                                        <p className="pv-light-gray">Digital product · Instant download</p>
                                    </SlideUp>
                                    <hr className="my-3 pv-gradient-hr" />
                                    <h5 className="pv-white">FILE FORMATS</h5>
                                    <div className="d-flex flex-wrap gap-2">
                                        {product.formats.map((format, index) => (
                                            <p
                                                className="pv-white"
                                                key={index}
                                                style={{ backgroundColor: "var(--pv-dark)", padding: "3px", borderRadius: "10px" }}
                                            >
                                                {format.toUpperCase()}
                                            </p>
                                        ))}
                                    </div>
                                    <button className="rainbow-button w-100 mb-1" disabled={processing} onClick={toCart}>
                                        {inCart ? (
                                            <><i className="bi bi-dash-circle"></i> REMOVE FROM CART</>
                                        ) : (
                                            <><i className="bi bi-plus-circle"></i> ADD TO CART</>
                                        )}
                                    </button>
                                    {wished ? (
                                        <p className="text-center mb-0 pv-white" style={{cursor:"pointer"}} onClick={wish}><i className="bi bi-heart-fill"></i> Remove from wishlist</p>
                                    ) : (
                                        <p className="text-center mb-0 pv-white" style={{cursor:"pointer"}} onClick={wish}><i className="bi bi-heart"></i> Add to wishlist</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default Product