'use client'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Banner = ()=>{
    const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    loop:true,
  };

  return (
    <Slider {...settings}>
        <div>
            {/* TODO */}
            <a href="#"> 
                <img
                    style={{maxWidth:"100%"}}
                    src="https://s1.tailieuchuan.vn/tailieuchuan-prod/public/uploads/xxx108059/T%E1%BB%B0%20TIN%20%282%29-tGRGdJUJe.png"
                    alt="banner"
                   />
            </a>
        </div>
        <div>
            <a href="#">
                <img
                    style={{maxWidth:"100%"}}
                    src="https://s1.tailieuchuan.vn/tailieuchuan-prod/public/uploads/xxx108059/T%E1%BB%B0%20TIN%20%282%29-tGRGdJUJe.png"
                    alt="banner"
                />
            </a>
        </div>
    </Slider>
  );
}


export default Banner