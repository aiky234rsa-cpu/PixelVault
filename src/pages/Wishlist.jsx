import Navbar from "../components/Navbar.jsx";
import SlideUp from "../components/SlideUp.jsx";
import Footer from "../components/Footer.jsx";
import WishCard from "../components/WishCard.jsx";

import { useAuth } from "../AuthContext.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Wishlist() {
    document.title = "Wishlist | PixelVault";

    const { isSignedIn, loading } = useAuth();
    const navigate = useNavigate();

    const [domain, setDomain] = useState("");
    const [processing, setProcessing] = useState(true);
    const [wishlist, setWishlist] = useState(null);
    const [wishProc, setWishProc] = useState(false);

    useEffect(() => {
        fetch("/domain.json")
            .then((response => response.json()))
            .then((data) => setDomain(data.domain_url))
            .catch(console.error)
    }, []);

    useEffect(() => {
        if (!domain) return;

        fetch(`${domain}/PixelVault/functionality/get_wishlist.php`, {
            credentials: "include"
        })
            .then(response => response.json())
            .then(data => {
                if (!data.message) {
                    console.log(data);
                    setWishlist(data);
                }
            })
            .catch(console.error)
            .finally(() => setProcessing(false));
    }, [domain]);

    async function deleteWish(pid, index) {
        if (!wishProc) {
            setWishProc(true);
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
                    if (data.success && !data.wished) {
                        setWishlist((prev) => prev.filter((item, i) => i !== index));
                    }
                })
                .catch(console.error)
                .finally(() => setWishProc(false));
        }
    }

    async function clearWishlist() {
        if (!wishProc) {
            setWishProc(true);
            await fetch(
                `${domain}/PixelVault/functionality/clear_wishlist.php`, {
                    credentials: "include"
                }
            )
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setWishlist(null);
                    }
                })
                .catch(console.error)
                .finally(() => setWishProc(false));
        }
    }

    async function toCart(prod_id) {
        if (!wishProc) {
            setWishProc(true);
            await fetch(
                `${domain}/PixelVault/functionality/cart.php`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    product_id: prod_id
                })
            }
            )
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        navigate("/cart");
                    }
                })
                .catch(console.error)
                .finally(() => setWishProc(false)); //Next time use useRef duh
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
                <section className="py-4 py-lg-5 pv-black-bg">
                    <div className="container">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="w-100">
                                <SlideUp>
                                    <h6 className="pv-light-gray">HOME / ACCOUNT / WISHLIST</h6>
                                    <h3 className="pv-white font-press-start my-3">MY WISHLIST</h3>
                                    <p className="pv-light-gray">Your favorite assets, all in one place.</p>
                                </SlideUp>
                            </div>
                            <h1 className="pv-gradient-fixed"><i className="bi bi-heart"></i></h1>
                        </div>
                    </div>
                </section>
                <hr className="pv-gradient-hr my-0" />
                <section className="py-4 pv-dark-bg">
                    <div className="container">
                        {processing ? (
                            <h1 className="pv-white font-press-start">Loading...</h1>
                        ) : !wishlist || wishlist.length == 0 ? (
                            <div className="text-center">
                                <h1 className="pv-red"><i className="bi bi-heart"></i></h1>
                                <h3 className="pv-white font-press-start">YOUR WISHLIST IS EMPTY.</h3>
                                <p className="pv-light-gray">You haven't saved any assets yet. Explore the marketplace and add your favorite resources to your wishlist.</p>
                                <a href="/catalog"><button className="rainbow-button">EXPLORE ASSETS <i className="bi bi-arrow-right"></i></button></a>
                            </div>
                        ) : (
                            <>
                                <div className="d-flex justify-content-between mb-4">
                                    <h5 className="pv-white">SAVED ASSETS ({wishlist.length})</h5>
                                    <h5 className="pv-red" style={{cursor:"pointer"}} onClick={clearWishlist}>CLEAR WISHLIST</h5>
                                </div>
                                <div className="row g-2 g-lg-5">
                                    {wishlist.map((product, index) => (
                                        <div className="col-6 col-md-4" key={index}>
                                            <WishCard
                                                url={`${domain}/PixelVault/var/${product.url}`}
                                                display_type={product.display_type}
                                                name={product.name}
                                                category={product.category_name}
                                                author={product.author}
                                                price={Number(product.price)}
                                                link={`/product/${product.product_id}`}
                                                onDel={() => deleteWish(product.product_id,index)}
                                                onAddCart={() => toCart(product.product_id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default Wishlist