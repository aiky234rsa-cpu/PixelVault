import { Suspense, Component, useState, useEffect } from "react";
import { useAuth } from "../AuthContext.jsx";
import {  useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Environment, Html, useProgress, useTexture } from "@react-three/drei";
import { useGLTF, Stage } from "@react-three/drei";

import "./DisplayCard.css";
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
    return <primitive object={scene} />
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
            <div style={{ width: "100%", height: "200px", backgroundColor: "var(--pv-gray)" }}>
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
            <div style={{ width: "100%", height: "200px", backgroundColor: "var(--pv-gray)" }}>
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

function DisplayCard({ url, display_type, name, author, price, link, pid, wishlisted = false }) {
    const [domain, setDomain] = useState("");
    const [wished, setWished] = useState(wishlisted);
    const [processing, setProcessing] = useState(false);

    const { isSignedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetch("/domain.json")
            .then((response => response.json()))
            .then((data) => setDomain(data.domain_url))
            .catch(console.error)
    }, []);

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
                    product_id: pid
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

    return (
        <div className="pv-card w-100">
            <div className="pv-card-content">
                <a href={link}><ModelViewer url={url} display_type={display_type} /></a>
                <div className="p-2">
                    <h5 className="pv-white t-overflow mt-2">{name}</h5>
                    <p className="pv-light-gray t-overflow">By {author}</p>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="pv-white">${price.toFixed(2)}</h5>
                        <h5 className="pv-white">
                            {wished ? (
                                <i className="bi bi-heart-fill" onClick={wish} style={{cursor:"pointer"}}></i>
                            ) : (
                                <i className="bi bi-heart" onClick={wish} style={{cursor:"pointer"}}></i>
                            )}
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DisplayCard