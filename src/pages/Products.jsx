import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import SlideUp from "../components/SlideUp.jsx";
import DisplayCard from "../components/DisplayCard.jsx";
import Footer from "../components/Footer.jsx";

const PARAM_NAMES = {
    search: "q",
    minPrice: "min",
    maxPrice: "max",
    creator: "creator",
};

function sanitizePrice(value) {
    const cleaned = value.replace(/[^0-9.]/g, "");
    const [whole, ...decimals] = cleaned.split(".");
    return decimals.length ? `${whole}.${decimals.join("")}` : whole;
}

function Products() {
    const { slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const [search, setSearch] = useState("");
    const [productType, setProductType] = useState("");
    const [domain, setDomain] = useState("");
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);

    const filters = {
        search: searchParams.get(PARAM_NAMES.search) ?? "",
        minPrice: searchParams.get(PARAM_NAMES.minPrice) ?? "",
        maxPrice: searchParams.get(PARAM_NAMES.maxPrice) ?? "",
        creator: searchParams.get(PARAM_NAMES.creator) ?? "",
    };

    const updateFilter = (key, value) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (value === "") {
                next.delete(PARAM_NAMES[key]);
            } else {
                next.set(PARAM_NAMES[key], value);
            }
            return next;
        }, { replace: true });
    };

    const clearFilters = () => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            Object.values(PARAM_NAMES).forEach((param) => next.delete(param));
            return next;
        }, { replace: true });
    };

    useEffect(() => {
        if (slug === "3d-models") {
            setProductType("3D models");
        } else {
            setProductType(slug);
        }
    }, [slug]);

    useEffect(() => {
        document.title = productType.toUpperCase() + " | PixelVault";
    }, [productType]);

    useEffect(() => {
        fetch("/domain.json")
            .then((response => response.json()))
            .then((data) => setDomain(data.domain_url))
            .catch(console.error)
    }, []);

    useEffect(() => {
        if (!domain) return;

        fetch(`${domain}/PixelVault/functionality/get_products.php?category=${slug}`,
            {
                credentials: "include"
            }
        )
            .then(response => response.json())
            .then(data => {
                if (!data.message) {
                    setProducts(data);
                } else {
                    setNotFound(true);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [domain, slug]);

    const filteredProducts = useMemo(() => {
        const search = filters.search.trim().toLowerCase();
        const creator = filters.creator.trim().toLowerCase();
        const min = filters.minPrice !== "" ? Number(filters.minPrice) : null;
        const max = filters.maxPrice !== "" ? Number(filters.maxPrice) : null;

        return products.filter((product) => {
            const price = Number(product.price);

            if (search && !String(product.name ?? "").toLowerCase().includes(search)) {
                return false;
            }
            if (creator && !String(product.username ?? "").toLowerCase().includes(creator)) {
                return false;
            }
            if (min !== null && !Number.isNaN(min) && price < min) {
                return false;
            }
            if (max !== null && !Number.isNaN(max) && price > max) {
                return false;
            }
            return true;
        });
    }, [products, filters]);

    const hasActiveFilters = Object.values(filters).some((value) => value !== "");

    return (
        <>
            <Navbar />
            <main>
                <section className="py-4 py-lg-5 pv-dark-bg">
                    <div className="container">
                        {notFound ? (
                            <div className="text-center">
                                <h1 className="font-press-start pv-white">404 Error not found!</h1>
                            </div>
                        ) : (
                            <>
                                <SlideUp>
                                    <h5 className="pv-blue">CATALOG / {productType.toUpperCase()}</h5>
                                    <h2 className="pv-white font-press-start my-3">{productType.toUpperCase()}</h2>
                                    <p className="pv-light-gray">Discover high quality {productType} for your projects.</p>
                                </SlideUp>
                                <div className="pv-input-wrap">
                                    <input
                                        type="text"
                                        className="pv-input"
                                        placeholder={`Search for ${productType}`}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <i className="bi bi-search pv-password-toggle" onClick={() => updateFilter("search", search)}></i>
                                </div>
                            </>
                        )}
                    </div>
                </section>
                <section className="py-4 pv-black-bg">
                    <div className="container-fluid">
                        {!notFound && (
                            <div className="row g-1">
                                <div className="col-md-3">
                                    <div className="w-100 p-2 rounded-2 pv-dark-bg">
                                        <div className="d-flex justify-content-between">
                                            <h6 className="pv-white mb-0">FILTERS</h6>
                                            <h6
                                                className="pv-blue"
                                                role="button"
                                                style={{
                                                    cursor: hasActiveFilters ? "pointer" : "default",
                                                    opacity: hasActiveFilters ? 1 : 0.5,
                                                }}
                                                onClick={clearFilters}
                                            >
                                                CLEAR ALL
                                            </h6>
                                        </div>
                                        <hr className="pv-white my-2" />
                                        <h6 className="pv-white">Price</h6>
                                        <div className="pv-input-wrap my-1">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                className="pv-input"
                                                placeholder="$ Min"
                                                value={filters.minPrice}
                                                onChange={(e) => updateFilter("minPrice", sanitizePrice(e.target.value))}
                                            />
                                        </div>
                                        <div className="pv-input-wrap my-1">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                className="pv-input"
                                                placeholder="$ Max"
                                                value={filters.maxPrice}
                                                onChange={(e) => updateFilter("maxPrice", sanitizePrice(e.target.value))}
                                            />
                                        </div>
                                        <hr className="pv-white my-2" />
                                        <h6 className="pv-white">Creator</h6>
                                        <div className="pv-input-wrap my-1">
                                            <input
                                                type="text"
                                                className="pv-input"
                                                placeholder="Username"
                                                value={filters.creator}
                                                onChange={(e) => updateFilter("creator", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-9 px-2">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="pv-white">All {productType}</h5>
                                        <h6 className="pv-light-gray">
                                            {loading
                                                ? "Loading..."
                                                : `${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"}`}
                                        </h6>
                                    </div>
                                    <hr className="my-2 pv-gradient-hr" />
                                    {loading ? (
                                        <h1 className="pv-white font-press-start">Loading</h1>
                                    ) : filteredProducts.length === 0 ? (
                                        <p className="pv-light-gray">
                                            No products match your filters.{" "}
                                            {hasActiveFilters && (
                                                <span
                                                    className="pv-blue"
                                                    role="button"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={clearFilters}
                                                >
                                                    Clear all filters
                                                </span>
                                            )}
                                        </p>
                                    ) : (
                                        <div className="row g-2">
                                            {filteredProducts.map((product) => (
                                                <div className="col-6 col-md-4" key={product.product_id}>
                                                    <DisplayCard
                                                        url={`${domain}/PixelVault/var/${product.url}`}
                                                        display_type={product.display_type}
                                                        name={product.name}
                                                        author={product.username}
                                                        price={Number(product.price)}
                                                        pid={product.product_id}
                                                        wishlisted={Boolean(product.wishlisted)}
                                                        link={`/product/${product.product_id}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default Products