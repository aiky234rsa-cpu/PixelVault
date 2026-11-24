import { useAuth } from "../AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import "./Navbar.css";

function Navbar() {
    const { isSignedIn, loading } = useAuth();
    const navigate = useNavigate();

    function seeAccount() {
        if (isSignedIn) {
            navigate("/account");
        }
    }

    function signIn() {
        if (!isSignedIn) {
            navigate("/signup");
        }
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg pv-navbar">
                <div className="container px-3">
                    <a href="/" className="navbar-brand pv-logo font-press-start pv-gradient">PIXELVAULT</a>
                    <div className="pv-mobile-icons d-flex align-items-center gap-2 ms-auto me-3 d-lg-none">
                        <button className="pv-icon-btn pv-gradient" onClick={() => navigate("/wishlist")}><i className="bi bi-heart"></i></button>
                        <button className="pv-icon-btn pv-gradient" onClick={() => navigate("/cart")}><i className="bi bi-cart"></i></button>
                        {loading ? (
                            <button className="pv-icon-btn pv-gradient"><i className="bi bi-person-exclamation"></i></button>
                        ) : isSignedIn ? (
                            <button className="pv-icon-btn pv-gradient" onClick={() => seeAccount()}><i className="bi bi-person-check"></i></button>
                        ) : (
                            <button className="pv-icon-btn pv-gradient" onClick={() => signIn()}><i className="bi bi-person"></i></button>
                        )}
                    </div>
                    <button
                        className="navbar-toggler pv-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#pvNavbarContent"
                        aria-controls="pvNavbarContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <i className="bi bi-list pv-white"></i>
                    </button>
                    <div className="collapse navbar-collapse" id="pvNavbarContent">
                        <ul className="navbar-nav mx-auto align-items-lg-center">
                            <li className="nav-item">
                                <a href="/catalog" className="nav-link"><span className="pv-gradient">CATALOG</span></a>
                                <a href="/about" className="nav-link"><span className="pv-gradient">ABOUT</span></a>
                                <a href="/contact" className="nav-link"><span className="pv-gradient">CONTACT</span></a>
                            </li>
                        </ul>
                        <div className="pv-desktop-icons d-none d-lg-flex align-items-center gap-4">
                            <button className="pv-icon-btn pv-gradient" onClick={() => navigate("/wishlist")}><i className="bi bi-heart"></i></button>
                            <button className="pv-icon-btn pv-gradient" onClick={() => navigate("/cart")}><i className="bi bi-cart"></i></button>
                            {loading ? (
                                <button className="pv-icon-btn pv-gradient"><i className="bi bi-person-exclamation"></i></button>
                            ) : isSignedIn ? (
                                <button className="pv-icon-btn pv-gradient" onClick={() => seeAccount()}><i className="bi bi-person-check"></i></button>
                            ) : (
                                <button className="pv-icon-btn pv-gradient" onClick={() => signIn()}><i className="bi bi-person"></i></button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar