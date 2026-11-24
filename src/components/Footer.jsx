function Footer() {
    return(
        <footer className="py-4 px-3 pv-black-bg">
            <div className="container-fluid">
                <h4 className="font-press-start pv-white">PIXELVAULT</h4>
                <p className="pv-light-gray">Your creative universe, one asset at a time. Discover premium 3D models, textures, materials and tools to bring your ideas to life.</p>
                <hr className="pv-gradient-hr my-4" />
                <div className="row g-5">
                    <div className="col-6 col-md-3">
                        <h5 className="pv-gradient-fixed">CATALOG</h5>
                        <ul style={{listStyle: "none", padding:0, margin: 0}}>
                            <li><a href="#" className="pv-white"><span className="pv-gradient">3D Models</span></a></li>
                            <li><a href="#" className="pv-white"><span className="pv-gradient">Textures</span></a></li>
                            <li><a href="#" className="pv-white"><span className="pv-gradient">Materials</span></a></li>
                            <li><a href="#" className="pv-white"><span className="pv-gradient">Environments</span></a></li>
                            <li><a href="#" className="pv-white"><span className="pv-gradient">Asset Packs</span></a></li>
                            <li><a href="#" className="pv-white"><span className="pv-gradient">Game Scripts</span></a></li>
                        </ul>
                    </div>
                    <div className="col-6 col-md-3">
                        <h5 className="pv-gradient-fixed">COMPANY</h5>
                        <ul style={{listStyle: "none", padding:0, margin: 0}}>
                            <li><a href="#" className="pv-white"><span className="pv-gradient">About Us</span></a></li>
                            <li><a href="#" className="pv-white"><span className="pv-gradient">Contact</span></a></li>
                            <li><a href="/become-a-creator" className="pv-white"><span className="pv-gradient">Become a Creator</span></a></li>
                            <li><a href="#" className="pv-white"><span className="pv-gradient">Careers</span></a></li>
                        </ul>
                    </div>
                    <div className="col-6 col-md-3">
                        <h5 className="pv-gradient-fixed">SUPPORT</h5>
                        <ul style={{listStyle: "none", padding:0, margin: 0}}>
                            <li><a href="#" className="pv-white"><span className="pv-gradient">Help Center</span></a></li>
                            <li><a href="#" className="pv-white"><span className="pv-gradient">FAQ</span></a></li>
                            <li><a href="#" className="pv-white"><span className="pv-gradient">Licensing</span></a></li>
                            <li><a href="#" className="pv-white"><span className="pv-gradient">Refund Policy</span></a></li>
                        </ul>
                    </div>
                    <div className="col-6 col-md-3">
                        <h5 className="pv-gradient-fixed">YOUR ACCOUNT</h5>
                        <ul style={{listStyle: "none", padding:0, margin: 0}}>
                            <li><a href="#" className="pv-white"><span className="pv-gradient">My Account</span></a></li>
                            <li><a href="#" className="pv-white"><span className="pv-gradient">My Downloads</span></a></li>
                            <li><a href="#" className="pv-white"><span className="pv-gradient">Wishlist</span></a></li>
                            <li><a href="#" className="pv-white"><span className="pv-gradient">Orders</span></a></li>
                        </ul>
                    </div>
                </div>
                <hr className="pv-gradient-hr my-4" />
                <div className="d-flex justify-content-between align-items-center">
                    <p className="pv-light-gray mb-0">© 2026 PIXELVAULT.</p>
                    <div>
                        <a href="#" className="pv-white mx-1"><span className="pv-gradient"><i className="bi bi-instagram"></i></span></a>
                        <a href="#" className="pv-white mx-1"><span className="pv-gradient"><i className="bi bi-youtube"></i></span></a>
                        <a href="#" className="pv-white mx-1"><span className="pv-gradient"><i className="bi bi-twitter-x"></i></span></a>
                        <a href="#" className="pv-white mx-1"><span className="pv-gradient"><i className="bi bi-discord"></i></span></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer