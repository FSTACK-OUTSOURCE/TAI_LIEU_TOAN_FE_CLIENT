'use client'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const slides = [
    { src: "/banner.png", alt: "Tài liệu toán.vn" },
    { src: "/banner.png", alt: "Tài liệu toán.vn" },
];

const Banner = () => {
    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3500,
        pauseOnHover: true,
    };

    return (
        <div
            style={{
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                marginBottom: 16,
            }}
        >
            <Slider {...settings}>
                {slides.map((s, i) => (
                    <div key={i}>
                        <img
                            src={s.src}
                            alt={s.alt}
                            style={{
                                width: "100%",
                                height: "auto",
                                display: "block",
                                objectFit: "cover",
                            }}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default Banner;
