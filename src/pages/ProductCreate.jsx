import Navbar from "../components/Navbar.jsx";
import SlideUp from "../components/SlideUp.jsx";
import Footer from "../components/Footer.jsx";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const DISPLAY_TYPES = {
    Model: { accept: ".glb", exts: ["glb"], maxMb: 10, label: "GLB", icon: "bi-badge-3d", title: "Upload 3D model" },
    Texture: { accept: ".png,.jpg,.jpeg", exts: ["png", "jpg", "jpeg"], maxMb: 5, label: "JPEG, JPG, PNG", icon: "bi-bricks", title: "Upload texture" },
};

function getExt(name) {
    const i = name.lastIndexOf(".");
    return i === -1 ? "" : name.slice(i + 1).toLowerCase();
}

function baseName(name) {
    const i = name.lastIndexOf(".");
    return (i === -1 ? name : name.slice(0, i)).slice(0, 100);
}

function toMb(bytes) {
    return bytes / (1024 * 1024);
}

function sameFile(a, b) {
    return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;
}

let nextId = 1;

function ProductCreate() {
    document.title = "Create your Asset | PixelVault";

    const { isSignedIn, loading } = useAuth();
    const navigate = useNavigate();

    const [dispType, setDispType] = useState("Model");
    const inputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [domain, setDomain] = useState("");

    const displayRef = useRef(null);
    const [newDisplayType, setNewDisplayType] = useState("Model");
    const [displays, setDisplays] = useState([]);

    const downloadRef = useRef(null);
    const [downloads, setDownloads] = useState([]);

    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    function validateDisplay(f, type) {
        const cfg = DISPLAY_TYPES[type];
        if (!cfg.exts.includes(getExt(f.name))) {
            return `"${f.name}" is not a valid ${type.toLowerCase()} file (accepted: ${cfg.label}).`;
        }
        if (toMb(f.size) > cfg.maxMb) {
            return `"${f.name}" is larger than ${cfg.maxMb} MB.`;
        }
        return null;
    }

    function handleClick() {
        inputRef.current.click();
    }

    function handleDragOver(e) {
        e.preventDefault();
        setIsDragging(true);
    }

    function handleDragLeave(e) {
        e.preventDefault();
        setIsDragging(false);
    }

    function acceptMainFile(f) {
        const err = validateDisplay(f, dispType);
        if (err) {
            setError(err);
            return;
        }
        setError("");
        setFile(f);
    }

    function handleDrop(e) {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) acceptMainFile(droppedFile);
    }

    function handleFileChange(e) {
        const selectedFile = e.target.files[0];
        if (selectedFile) acceptMainFile(selectedFile);
        e.target.value = "";
    }

    function handleDispTypeChange(e) {
        setDispType(e.target.value);
        setFile(null);
        setError("");
    }

    function handleDisplaysClick() {
        displayRef.current.click();
    }

    function handleDisplaysChange(e) {
        const selected = Array.from(e.target.files);
        e.target.value = "";

        const errors = [];
        const valid = [];

        selected.forEach(f => {
            const err = validateDisplay(f, newDisplayType);
            if (err) errors.push(err);
            else valid.push(f);
        });

        setDisplays(prev => {
            const fresh = valid
                .filter(f => !prev.some(d => sameFile(d.file, f)))
                .map(f => ({
                    id: nextId++,
                    file: f,
                    displayType: newDisplayType,
                    alt: baseName(f.name),
                }));
            return [...prev, ...fresh];
        });

        setError(errors.join(" "));
    }

    function updateDisplayAlt(id, alt) {
        setDisplays(prev => prev.map(d => (d.id === id ? { ...d, alt: alt.slice(0, 100) } : d)));
    }

    function removeDisplay(id) {
        setDisplays(prev => prev.filter(d => d.id !== id));
    }

    function handleDownloadsClick() {
        downloadRef.current.click();
    }

    function handleDownloadsChange(e) {
        const selected = Array.from(e.target.files);
        e.target.value = "";

        setDownloads(prev => {
            const fresh = selected
                .filter(f => !prev.some(d => sameFile(d.file, f)))
                .map(f => ({ id: nextId++, file: f, label: baseName(f.name) }));
            return [...prev, ...fresh];
        });
    }

    function updateDownloadLabel(id, label) {
        setDownloads(prev => prev.map(d => (d.id === id ? { ...d, label: label.slice(0, 100) } : d)));
    }

    function removeDownload(id) {
        setDownloads(prev => prev.filter(d => d.id !== id));
    }

    useEffect(() => {
        fetch("/domain.json")
            .then((response => response.json()))
            .then((data) => setDomain(data.domain_url))
            .catch(console.error)
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!file) {
            setError("Please upload a main display.");
            return;
        }
        if (downloads.length === 0) {
            setError("Please add at least one downloadable file.");
            return;
        }
        if (processing) {
            return;
        }

        setProcessing(true);
        const form = e.target;
        const fd = new FormData();

        fd.append("name", form.pname.value);
        fd.append("category_id", form.category.value);
        fd.append("description", form.desc.value);
        fd.append("price", form.price.value || "0");

        const displayMeta = [
            {
                alt: form.pname.value.slice(0, 100),
                format: getExt(file.name),
                display_type: dispType,
                position: 0,
                is_cover: 1,
            },
            ...displays.map((d, i) => ({
                alt: d.alt,
                format: getExt(d.file.name),
                display_type: d.displayType,
                position: i + 1,
                is_cover: 0,
            })),
        ];
        fd.append("displays_meta", JSON.stringify(displayMeta));
        fd.append("display_files[]", file);
        displays.forEach(d => fd.append("display_files[]", d.file));

        const downloadMeta = downloads.map(d => ({
            format: getExt(d.file.name),
            label: d.label,
            file_size_mb: Number(toMb(d.file.size).toFixed(2)),
        }));
        fd.append("downloads_meta", JSON.stringify(downloadMeta));
        downloads.forEach(d => fd.append("download_files[]", d.file));

        try {
            const res = await fetch(`${domain}/PixelVault/creator/create_product.php`, {
                method: "POST",
                body: fd,
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message || "Upload failed.");
            navigate("/create");
        } catch (err) {
            setError(err.message);
        } finally {
            setProcessing(false);
        }
    }

    const mainCfg = DISPLAY_TYPES[dispType];

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
                            <h2 className="pv-white font-press-start">UPLOAD A NEW ASSET</h2>
                            <p className="pv-light-gray mb-0">Showcase your work. Add the details, upload your files, and get your asset ready for the marketplace.</p>
                        </SlideUp>
                    </div>
                </section>
                <hr className="pv-gradient-hr my-0" />
                <section className="py-4 py-lg-5 pv-dark-bg">
                    <div className="container">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="pname" className="pv-white">ASSET NAME</label>
                            <div className="pv-input-wrap my-1">
                                <input type="text" className="pv-input" id="pname" name="pname" placeholder="Your asset name" maxLength={220} required />
                            </div>
                            <label htmlFor="category" className="pv-white">CATEGORY</label>
                            <div className="pv-input-wrap my-1">
                                <select name="category" id="category" className="pv-input pv-select">
                                    <option value="1">3D Models</option>
                                    <option value="2">Textures</option>
                                </select>
                            </div>
                            <label htmlFor="desc" className="pv-white">DESCRIPTION</label>
                            <div className="pv-input-wrap my-1">
                                <textarea name="desc" id="desc" className="pv-input" style={{ height: "100px" }} placeholder="Describe your asset."></textarea>
                            </div>
                            <label htmlFor="price" className="pv-white">PRICE</label>
                            <div className="pv-input-wrap my-1">
                                <input type="number" className="pv-input" id="price" name="price" placeholder="Price (in $)" min="0" step="0.01" required />
                            </div>

                            <div className="row g-5 mb-4">
                                <div className="col-6">
                                    <p className="pv-white my-1">MAIN DISPLAY</p>
                                    <div>
                                        <input type="file" ref={inputRef} onChange={handleFileChange} hidden accept={mainCfg.accept} />
                                        <div
                                            className="rounded-2 pv-black-bg text-center p-3"
                                            onClick={handleClick}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleDrop}
                                            style={{
                                                cursor: "pointer"
                                            }}
                                        >
                                            {isDragging ? (
                                                <>
                                                    <h3 className="pv-gradient-fixed"><i className="bi bi-file-plus"></i></h3>
                                                    <h4 className="pv-white mb-0">DROP FILE HERE.</h4>
                                                </>
                                            ) : (
                                                <>
                                                    <h3 className="pv-gradient-fixed"><i className={`bi ${mainCfg.icon}`}></i></h3>
                                                    <h4 className="pv-white">{mainCfg.title}</h4>
                                                    <p className="pv-light-gray mb-0">
                                                        Accepted files: {mainCfg.label}. Must be less than {mainCfg.maxMb} MB.
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {file && (
                                        <div className="d-flex justify-content-between align-items-center mt-2 pv-white">
                                            <span className="text-truncate">
                                                <i className="bi bi-file-earmark-check me-2"></i>
                                                {file.name} ({toMb(file.size).toFixed(2)} MB)
                                            </span>
                                            <button type="button" className="btn btn-sm btn-outline-danger ms-2" onClick={() => setFile(null)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="col-6">
                                    <label htmlFor="display" className="pv-white"> MAIN DISPLAY TYPE</label>
                                    <div className="pv-input-wrap my-1">
                                        <select name="display" id="display" className="pv-input pv-select" value={dispType} onChange={handleDispTypeChange}>
                                            <option value="Model">Model</option>
                                            <option value="Texture">Texture</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <p className="pv-white mb-1">ADDITIONAL DISPLAYS</p>
                            <p className="pv-light-gray">Choose the display type, then pick one or more files.</p>
                            <div className="row g-2 align-items-center mb-3">
                                <div className="col-auto">
                                    <div className="pv-input-wrap">
                                        <select
                                            className="pv-input pv-select"
                                            value={newDisplayType}
                                            onChange={(e) => setNewDisplayType(e.target.value)}
                                            aria-label="Display type for new files"
                                        >
                                            <option value="Model">Model (GLB, max 10 MB)</option>
                                            <option value="Texture">Texture (PNG/JPG, max 5 MB)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <input
                                        type="file"
                                        ref={displayRef}
                                        onChange={handleDisplaysChange}
                                        accept={DISPLAY_TYPES[newDisplayType].accept}
                                        multiple
                                        hidden
                                    />
                                    <button type="button" className="rainbow-fill-button" onClick={handleDisplaysClick}>
                                        <i className="bi bi-upload me-2"></i>Add display file
                                    </button>
                                </div>
                            </div>

                            {displays.length > 0 ? (
                                <div className="table-responsive mb-4">
                                    <table className="table table-dark align-middle">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>File</th>
                                                <th>Type</th>
                                                <th>Format</th>
                                                <th>Size</th>
                                                <th>Alt text</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displays.map((d, i) => (
                                                <tr key={d.id}>
                                                    <td>{i + 1}</td>
                                                    <td className="text-truncate" style={{ maxWidth: "220px" }}>{d.file.name}</td>
                                                    <td>{d.displayType}</td>
                                                    <td>{getExt(d.file.name).toUpperCase()}</td>
                                                    <td>{toMb(d.file.size).toFixed(2)} MB</td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            value={d.alt}
                                                            onChange={(e) => updateDisplayAlt(d.id, e.target.value)}
                                                            maxLength={100}
                                                            required
                                                        />
                                                    </td>
                                                    <td className="text-end">
                                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeDisplay(d.id)} aria-label={`Remove ${d.file.name}`}>
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="pv-light-gray mb-4">No additional displays yet.</p>
                            )}

                            <p className="pv-white mb-1">DOWNLOADABLE FILES</p>
                            <p className="pv-light-gray">Files buyers will receive. Any file type is accepted.</p>
                            <input type="file" ref={downloadRef} onChange={handleDownloadsChange} multiple hidden />
                            <button type="button" className="rainbow-fill-button mb-3" onClick={handleDownloadsClick}>
                                <i className="bi bi-upload me-2"></i>Add download file
                            </button>

                            {downloads.length > 0 ? (
                                <div className="table-responsive mb-4">
                                    <table className="table table-dark align-middle">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>File</th>
                                                <th>Format</th>
                                                <th>Size</th>
                                                <th>Label</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {downloads.map((d, i) => (
                                                <tr key={d.id}>
                                                    <td>{i + 1}</td>
                                                    <td className="text-truncate" style={{ maxWidth: "220px" }}>{d.file.name}</td>
                                                    <td>{getExt(d.file.name).toUpperCase() || "-"}</td>
                                                    <td>{toMb(d.file.size).toFixed(2)} MB</td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            value={d.label}
                                                            onChange={(e) => updateDownloadLabel(d.id, e.target.value)}
                                                            maxLength={100}
                                                        />
                                                    </td>
                                                    <td className="text-end">
                                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeDownload(d.id)} aria-label={`Remove ${d.file.name}`}>
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="pv-light-gray mb-4">No downloadable files yet.</p>
                            )}

                            {error && <p className="text-danger">{error}</p>}

                            <button type="submit" className="rainbow-button" disabled={processing}>
                                {processing ? (<>UPLOADING ASSETS...</>) : (<>PUBLISH ASSET</>)}
                            </button>
                        </form>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default ProductCreate;