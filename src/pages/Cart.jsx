import Navbar from "../components/Navbar.jsx";
import SlideUp from "../components/SlideUp.jsx";
import Footer from "../components/Footer.jsx";

import { useState, useEffect, useMemo, Suspense, Component } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { Canvas } from "@react-three/fiber";
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

function Cart() {
    document.title = "Cart | PixelVault";

    const { isSignedIn, loading } = useAuth();
    const navigate = useNavigate();

    const [domain, setDomain] = useState("");
    const [cart, setCart] = useState(null);
    const [cartLoading, setCartLoading] = useState(true);
    const [totalPrice,setTotalPrice] = useState(0);
    const [processing,setProcessing] = useState(false);

    useEffect(() => {
        fetch("/domain.json")
            .then((response => response.json()))
            .then((data) => setDomain(data.domain_url))
            .catch(console.error)
    }, []);

    useEffect(() => {
        if (!domain) return;
        fetch(`${domain}/PixelVault/functionality/get_cart.php`, {
            credentials: "include"
        })
            .then(response => response.json())
            .then(data => {
                setCart(data);
                console.log(data);
            })
            .catch(console.error)
            .finally(() => setCartLoading(false));
    }, [domain]);

    useEffect(() => {
        if (cart) {
            const total = cart.reduce((tot, item) => {
                return tot + Number(item.price);
            },0);
            setTotalPrice(total);
        }
    },[cart]);

    async function removeFromCart(pid,index) {
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
                    product_id: pid
                })
            }
            )
                .then(response => response.json())
                .then(data => {
                    if (data.success && !data.in_cart) {
                        setCart((prev) => prev.filter((item,i) => i !== index));
                    }
                })
                .catch(console.error)
                .finally(() => setProcessing(false));
        }
    } 

    if (!isSignedIn && !loading) {
        navigate("/");
        return;
    }

    return (
        <>
            <Navbar />
            <main>
                <section className="py-5 pv-dark-bg">
                    <div className="container">
                        {cartLoading ? (
                            <h1 className="pv-white font-press-start">Loading...</h1>
                        ) : !cart || cart.length === 0 ? (
                            <div className="text-center">
                                <SlideUp>
                                    <h1 className="pv-light-gray"><i className="bi bi-cart"></i></h1>
                                    <h2 className="pv-white font-press-start">Your cart is empty.</h2>
                                    <p className="pv-light-gray">Looks like you haven't added anything to your cart yet. Explore our marketplace and find something worth creating with.</p>
                                    <a href="/catalog"><button className="rainbow-button">EXPLORE ASSETS <i className="bi bi-arrow-right"></i></button></a>
                                </SlideUp>
                            </div>
                        ) : (
                            <>
                                <SlideUp>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="pv-white">YOUR CART</h5>
                                        <h6 className="pv-blue">{cart.length} items</h6>
                                    </div>
                                    <p className="pv-light-gray mt-2">Review your selected assets before checkout.</p>
                                </SlideUp>
                                <hr className="pv-gradient-hr my-3" />
                                {cart.map((product,index) => (
                                    <div key={index}>
                                        <div className="d-flex justify-content-between align-items-center gap-3">
                                            <a href={`/product/${product.product_id}`}>
                                                <ModelViewer url={`${domain}/PixelVault/var/${product.url}`} display_type={product.display_type}/>
                                            </a>
                                            <div className="w-100 d-flex flex-column">
                                                <h5 className="pv-white">{product.name}</h5>
                                                <p className="pv-light-gray">{product.category_name}</p>
                                                <h6 className="pv-white font-press-start mb-0">${Number(product.price).toFixed(2)}</h6>
                                            </div>
                                            <h4 className="pv-red" style={{cursor:"pointer"}} onClick={() => removeFromCart(product.product_id,index)}><i className="bi bi-trash"></i></h4>
                                        </div>
                                        <hr className="pv-gradient-hr my-3" />
                                    </div>
                                ))}
                                <div className="d-flex justify-content-between align-items-center my-2">
                                    <h5 className="pv-white">TOTAL</h5>
                                    <h5 className="pv-white font-press-start">${totalPrice.toFixed(2)}</h5>
                                </div>
                                <button className="rainbow-button w-100">PROCEED TO CHECKOUT <i className="bi bi-arrow-right"></i></button>
                                <div className="text-center mt-1">
                                    <p className="pv-light-gray mb-0">Secure checkout · Digital products · No shipping required</p>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </main>
            <Footer/>
        </>
    );
}

export default Cart