import { useEffect, useRef, useState } from "react";
import "./SlideUp.css";

function SlideUp({children}) {
    const [isVisible,setIsVisible] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.3
            }
        );
        observer.observe(elementRef.current);

        return () => observer.disconnect();
    },[]);

     return (
        <div
            ref={elementRef}
            className={`slide-up ${isVisible ? "show" : ""}`}
        >
            {children}
        </div>
    );
}

export default SlideUp