import Navbar from "../components/Navbar.jsx";
import SlideUp from "../components/SlideUp.jsx";
import Footer from "../components/Footer.jsx";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";

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

let nextKey = 1;

function ProductEdit() {
    document.title = "Edit your Asset | PixelVault";

    const { isSignedIn, loading } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const pid = searchParams.get("pid");

    const [domain, setDomain] = useState("");
    const [pageLoading, setPageLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("1");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    const [existingMain, setExistingMain] = useState(null);
    const [dispType, setDispType] = useState("Model");
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef(null);

    const displayRef = useRef(null);
    const [newDisplayType, setNewDisplayType] = useState("Model");
    const [displays, setDisplays] = useState([]);
    const [deletedDisplayIds, setDeletedDisplayIds] = useState([]);

    const downloadRef = useRef(null);
    const [downloads, setDownloads] = useState([]);
    const [deletedDownloadIds, setDeletedDownloadIds] = useState([]);

    useEffect(() => {
        fetch("/domain.json")
            .then((response => response.json()))
            .then((data) => setDomain(data.domain_url))
            .catch(console.error)
    }, []);

    useEffect(() => {
        if (loading || !isSignedIn) return;

        if (!pid) {
            setLoadError("Missing product id.");
            setPageLoading(false);
            return;
        }

        let cancelled = false;

        async function load() {
            try {
                const res = await fetch(`${domain}/PixelVault/creator/get_product.php?pid=${encodeURIComponent(pid)}`, {
                    credentials: "include",
                });
                const data = await res.json();
                if (!res.ok || !data.success) throw new Error(data.message || "Could not load the asset.");
                if (cancelled) return;

                const p = data.product;
                setName(p.name ?? "");
                setCategoryId(String(p.category_id));
                setDescription(p.description ?? "");
                setPrice(p.price ?? "");

                const sorted = [...p.displays].sort((a, b) => a.position - b.position);
                const cover = sorted.find(d => Number(d.is_cover) === 1) || null;

                if (cover) {
                    setExistingMain(cover);
                    setDispType(cover.display_type);
                }

                setDisplays(
                    sorted
                        .filter(d => Number(d.is_cover) !== 1)
                        .map(d => ({
                            key: nextKey++,
                            id: d.id,
                            file: null,
                            url: d.url,
                            format: d.format,
                            displayType: d.display_type,
                            alt: d.alt,
                        }))
                );

                setDownloads(
                    p.downloads.map(d => ({
                        key: nextKey++,
                        id: d.id,
                        file: null,
                        url: d.url,
                        format: d.format,
                        label: d.label ?? "",
                        sizeMb: d.file_size_mb !== null ? Number(d.file_size_mb) : null,
                    }))
                );
            } catch (err) {
                if (!cancelled) setLoadError(err.message);
            } finally {
                if (!cancelled) setPageLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [domain]);

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


    const keepExistingMain = !!existingMain && !file && dispType === existingMain.display_type;
    const hasMain = !!file || keepExistingMain;

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
                .filter(f => !prev.some(d => d.file && sameFile(d.file, f)))
                .map(f => ({
                    key: nextKey++,
                    id: null,
                    file: f,
                    url: "",
                    format: getExt(f.name),
                    displayType: newDisplayType,
                    alt: baseName(f.name),
                }));
            return [...prev, ...fresh];
        });

        setError(errors.join(" "));
    }

    function updateDisplayAlt(key, alt) {
        setDisplays(prev => prev.map(d => (d.key === key ? { ...d, alt: alt.slice(0, 100) } : d)));
    }

    function removeDisplay(row) {
        if (row.id) setDeletedDisplayIds(prev => [...prev, row.id]);
        setDisplays(prev => prev.filter(d => d.key !== row.key));
    }

    function handleDownloadsChange(e) {
        const selected = Array.from(e.target.files);
        e.target.value = "";

        setDownloads(prev => {
            const fresh = selected
                .filter(f => !prev.some(d => d.file && sameFile(d.file, f)))
                .map(f => ({
                    key: nextKey++,
                    id: null,
                    file: f,
                    url: "",
                    format: getExt(f.name),
                    label: baseName(f.name),
                    sizeMb: toMb(f.size),
                }));
            return [...prev, ...fresh];
        });
    }

    function updateDownloadLabel(key, label) {
        setDownloads(prev => prev.map(d => (d.key === key ? { ...d, label: label.slice(0, 100) } : d)));
    }

    function removeDownload(row) {
        if (row.id) setDeletedDownloadIds(prev => [...prev, row.id]);
        setDownloads(prev => prev.filter(d => d.key !== row.key));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!hasMain) {
            setError(
                existingMain && dispType !== existingMain.display_type
                    ? "You changed the main display type, please upload a new main display."
                    : "Please upload a main display."
            );
            return;
        }
        if (downloads.length === 0) {
            setError("Please keep or add at least one downloadable file.");
            return;
        }

        const fd = new FormData();
        fd.append("pid", pid);
        fd.append("name", name);
        fd.append("category_id", categoryId);
        fd.append("description", description);
        fd.append("price", price || "0");

        fd.append("main_meta", JSON.stringify({
            keep_id: keepExistingMain ? existingMain.id : null,
            display_type: dispType,
            alt: name.slice(0, 100),
        }));
        if (file) fd.append("main_file", file);

        fd.append("displays_meta", JSON.stringify(
            displays.map((d, i) => ({
                id: d.id,
                alt: d.alt,
                display_type: d.displayType,
                position: i + 1,
            }))
        ));
        displays.filter(d => d.file).forEach(d => fd.append("display_files[]", d.file));
        fd.append("deleted_display_ids", JSON.stringify(deletedDisplayIds));

        fd.append("downloads_meta", JSON.stringify(
            downloads.map(d => ({ id: d.id, label: d.label }))
        ));
        downloads.filter(d => d.file).forEach(d => fd.append("download_files[]", d.file));
        fd.append("deleted_download_ids", JSON.stringify(deletedDownloadIds));

        setSaving(true);
        try {
            const res = await fetch(`${domain}/PixelVault/creator/update_product.php`, {
                method: "POST",
                body: fd,
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message || "Update failed.");
            navigate("/create");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    function handleCancel() {
        navigate(-1);
    }

    const mainCfg = DISPLAY_TYPES[dispType];
    const fileNameFromUrl = (url) => url.split("/").pop();

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
                            <h2 className="pv-white font-press-start">EDIT YOUR ASSET</h2>
                            <p className="pv-light-gray mb-0">Update the details, replace or add files, and save your changes.</p>
                        </SlideUp>
                    </div>
                </section>
                <hr className="pv-gradient-hr my-0" />
                <section className="py-4 py-lg-5 pv-dark-bg">
                    <div className="container">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="pname" className="pv-white">ASSET NAME</label>
                            <div className="pv-input-wrap my-1">
                                <input type="text" className="pv-input" id="pname" name="pname" placeholder="Your asset name" maxLength={220} required
                                    value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <label htmlFor="category" className="pv-white">CATEGORY</label>
                            <div className="pv-input-wrap my-1">
                                <select name="category" id="category" className="pv-input pv-select"
                                    value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                                    <option value="1">3D Models</option>
                                    <option value="2">Textures</option>
                                </select>
                            </div>
                            <label htmlFor="desc" className="pv-white">DESCRIPTION</label>
                            <div className="pv-input-wrap my-1">
                                <textarea name="desc" id="desc" className="pv-input" style={{ height: "100px" }} placeholder="Describe your asset." required
                                    value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                            </div>
                            <label htmlFor="price" className="pv-white">PRICE</label>
                            <div className="pv-input-wrap my-1">
                                <input type="number" className="pv-input" id="price" name="price" placeholder="Price (in $)" min="0" step="0.01"
                                    value={price} onChange={(e) => setPrice(e.target.value)} />
                            </div>

                            <div className="row g-5 mb-4">
                                <div className="col-6">
                                    <p className="pv-white my-1">MAIN DISPLAY</p>
                                    <div>
                                        <input type="file" ref={inputRef} onChange={handleFileChange} hidden accept={mainCfg.accept} />
                                        <div
                                            className="rounded-2 pv-black-bg text-center p-3"
                                            onClick={() => inputRef.current.click()}
                                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                                            onDrop={handleDrop}
                                            style={{ cursor: "pointer", outline: isDragging ? "2px dashed #fff" : "none" }}
                                        >
                                            <h3 className="pv-gradient-fixed"><i className={`bi ${mainCfg.icon}`}></i></h3>
                                            <h4 className="pv-white">{keepExistingMain ? "Replace main display" : mainCfg.title}</h4>
                                            <p className="pv-light-gray mb-0">
                                                Accepted files: {mainCfg.label}. Must be less than {mainCfg.maxMb} MB.
                                            </p>
                                        </div>
                                    </div>
                                    {file ? (
                                        <div className="d-flex justify-content-between align-items-center mt-2 pv-white">
                                            <span className="text-truncate">
                                                <span className="badge bg-success me-2">New</span>
                                                {file.name} ({toMb(file.size).toFixed(2)} MB)
                                            </span>
                                            <button type="button" className="btn btn-sm btn-outline-danger ms-2" onClick={() => setFile(null)} aria-label="Discard new main display">
                                                <i className="bi bi-x-lg"></i>
                                            </button>
                                        </div>
                                    ) : keepExistingMain ? (
                                        <p className="pv-white mt-2 mb-0 text-truncate">
                                            <i className="bi bi-file-earmark-check me-2"></i>
                                            Current: {fileNameFromUrl(existingMain.url)}
                                        </p>
                                    ) : (
                                        <p className="text-warning mt-2 mb-0">No main display selected, please upload one.</p>
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
                                    {existingMain && dispType !== existingMain.display_type && (
                                        <p className="pv-light-gray">Changing the type requires uploading a new main display.</p>
                                    )}
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
                                    <input type="file" ref={displayRef} onChange={handleDisplaysChange}
                                        accept={DISPLAY_TYPES[newDisplayType].accept} multiple hidden />
                                    <button type="button" className="rainbow-fill-button" onClick={() => displayRef.current.click()}>
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
                                                <th>Alt text</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {displays.map((d, i) => (
                                                <tr key={d.key}>
                                                    <td>{i + 1}</td>
                                                    <td className="text-truncate" style={{ maxWidth: "220px" }}>
                                                        {d.file ? <span className="badge bg-success me-2">New</span> : null}
                                                        {d.file ? d.file.name : fileNameFromUrl(d.url)}
                                                    </td>
                                                    <td>{d.displayType}</td>
                                                    <td>{d.format.toUpperCase()}</td>
                                                    <td>
                                                        <input type="text" className="form-control form-control-sm" value={d.alt}
                                                            onChange={(e) => updateDisplayAlt(d.key, e.target.value)} maxLength={100} required />
                                                    </td>
                                                    <td className="text-end">
                                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeDisplay(d)}
                                                            aria-label={`Remove display ${i + 1}`}>
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="pv-light-gray mb-4">No additional displays.</p>
                            )}

                            <p className="pv-white mb-1">DOWNLOADABLE FILES</p>
                            <p className="pv-light-gray">Files buyers will receive. Any file type is accepted.</p>
                            <input type="file" ref={downloadRef} onChange={handleDownloadsChange} multiple hidden />
                            <button type="button" className="rainbow-button" onClick={() => downloadRef.current.click()}>
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
                                                <tr key={d.key}>
                                                    <td>{i + 1}</td>
                                                    <td className="text-truncate" style={{ maxWidth: "220px" }}>
                                                        {d.file ? <span className="badge bg-success me-2">New</span> : null}
                                                        {d.file ? d.file.name : fileNameFromUrl(d.url)}
                                                    </td>
                                                    <td>{d.format ? d.format.toUpperCase() : "-"}</td>
                                                    <td>{d.sizeMb !== null ? `${d.sizeMb.toFixed(2)} MB` : "-"}</td>
                                                    <td>
                                                        <input type="text" className="form-control form-control-sm" value={d.label}
                                                            onChange={(e) => updateDownloadLabel(d.key, e.target.value)} maxLength={100} />
                                                    </td>
                                                    <td className="text-end">
                                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeDownload(d)}
                                                            aria-label={`Remove download ${i + 1}`}>
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-warning mb-4">No downloadable files, add at least one.</p>
                            )}

                            {error && <p className="text-danger">{error}</p>}

                            <div className="d-flex gap-2">
                                <button type="submit" className="rainbow-button" disabled={saving}>
                                    {saving ? "SAVING..." : "SAVE"}
                                </button>
                                <button type="button" className="rainbow-fill-button" onClick={handleCancel} disabled={saving}>
                                    CANCEL
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default ProductEdit;