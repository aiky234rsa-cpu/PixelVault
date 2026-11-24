import Navbar from "../components/Navbar.jsx";
import SlideUp from "../components/SlideUp.jsx";
import Footer from "../components/Footer.jsx";

import "./Contact.css";

import help from "../assets/imgs/help.jfif";

function Contact() {
    document.title = "Contact | PixelVault";

    const items = [
        { q: "How do I download a purchased asset?", a: "Go to your library and click the download button next to the asset." },
        { q: "Which software is supported?", a: "Blender, Maya, 3ds Max, Unity and Unreal Engine are supported." },
        { q: "Can I get a refund?", a: "Refunds are available within 14 days if the asset hasn't been downloaded." },
        { q: "How do asset licenses work?", a: "Each purchase includes a standard license for personal and commercial use." },
    ];

    return (
        <>
            <Navbar />
            <main>
                <section className="py-4 py-lg-5 pv-black-bg">
                    <div className="container">
                        <SlideUp>
                            <h2 className="pv-white font-press-start">LET'S TALK. <span className="pv-blue">WE'RE LISTENING.</span></h2>
                            <p className="pv-light-gray">Have a question, need assistance or want to work with us? Get in touch and we'll help you find the right solution.</p>
                        </SlideUp>
                    </div>
                </section>
                <img src={help} alt="help" className="pv-banner-img" />
                <section className="py-4 py-lg-5 pv-dark-bg">
                    <div className="container">
                        <h5 className="pv-blue">01 - GET IN TOUCH</h5>
                        <SlideUp>
                            <h2 className="pv-white font-press-start my-4">SEND US A MESSAGE.</h2>
                            <p className="pv-light-gray">Fill out the form below and tell us how we can help.</p>
                        </SlideUp>
                        <form>
                            <label htmlFor="name" className="pv-white">YOUR NAME</label>
                            <div className="pv-input-wrap my-1">
                                <input type="text" id="name" className="pv-input" name="name" placeholder="Enter your name" style={{ background: "var(--pv-black)" }} required />
                            </div>
                            <label htmlFor="email" className="pv-white">EMAIL ADDRESS</label>
                            <div className="pv-input-wrap my-1">
                                <input type="email" id="email" className="pv-input" name="email" placeholder="example@email.com" style={{ background: "var(--pv-black)" }} required />
                            </div>
                            <label htmlFor="message" className="pv-white">YOUR MESSAGE</label>
                            <div className="pv-input-wrap my-1">
                                <textarea name="message" id="message" className="pv-input" placeholder="Tell us more about your question." style={{ background: "var(--pv-black)", height: "100px" }} required></textarea>
                            </div>
                            <button className="rainbow-button w-100 mt-2" type="submit">SEND MESSAGE <i className="bi bi-arrow-right"></i></button>
                        </form>
                    </div>
                </section>
                <section className="py-4 py-lg-5 pv-black-bg">
                    <div className="container">
                        <SlideUp>
                            <h5 className="pv-green">02 - OTHER WAYS TO REACH US</h5>
                            <h2 className="pv-white font-press-start my-4">WE'RE JUST A MESSAGE AWAY.</h2>
                        </SlideUp>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="pv-card">
                                    <div className="p-3">
                                        <h4 className="pv-blue"><i className="bi bi-envelope"></i></h4>
                                        <h5 className="pv-white">Email Support</h5>
                                        <p className="pv-light-gray">For general questions and assistance.</p>
                                        <p className="pv-blue mb-0">sup@pixelvault.com</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="pv-card">
                                    <div className="p-3">
                                        <h4 className="pv-green"><i className="bi bi-chat"></i></h4>
                                        <h5 className="pv-white">Social Media</h5>
                                        <p className="pv-light-gray">Follow us and stay up to date.</p>
                                        <p className="pv-green mb-0">@PIXELVAULT</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-4 py-lg-5 pv-dark-bg">
                    <div className="container">
                        <h5 className="pv-purple">03 - FREQUENTLY ASKED QUESTIONS</h5>
                        <SlideUp>
                            <h2 className="pv-white font-press-start my-4">GOT QUESTIONS?</h2>
                        </SlideUp>
                        <div className="accordion faq-accordion" id="faqAccordion">
                            {items.map((item, i) => (
                                <div className="accordion-item" key={i}>
                                    <h2 className="accordion-header">
                                        <button
                                            className="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#faq-${i}`}
                                            aria-expanded="false"
                                            aria-controls={`faq-${i}`}
                                        >
                                            {item.q}
                                        </button>
                                    </h2>
                                    <div
                                        id={`faq-${i}`}
                                        className="accordion-collapse collapse"
                                        data-bs-parent="#faqAccordion"
                                    >
                                        <div className="accordion-body">{item.a}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <section className="py-4 py-lg-5 pv-black-bg">
                    <div className="container">
                        <SlideUp>
                            <div className="text-center">
                                <h2 className="pv-white font-press-start">LET'S BUILD SOMETHING GREAT.</h2>
                                <p className="pv-light-gray">Your next creative project starts here.</p>
                                <button className="rainbow-button w-100">EXPLORE MARKETPLACE <i className="bi bi-arrow-right"></i></button>
                            </div>
                        </SlideUp>
                        <hr className="pv-gradient-hr mt-4" />
                    </div>
                </section>
            </main>
            <Footer/>
        </>
    );
}

export default Contact