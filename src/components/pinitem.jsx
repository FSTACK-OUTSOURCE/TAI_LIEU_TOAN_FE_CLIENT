"use client"
import { Image } from 'antd';
import { useRouter } from 'next/navigation';
import Slider from "react-slick";

const CustomArrow = ({ className, style, onClick, direction }) => (
    <div
        className={className}
        style={{
            ...style,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#fff",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            zIndex: 10,
            [direction === "left" ? "left" : "right"]: "-18px",
        }}
        onClick={onClick}
    >
        <span style={{ color: "#666", fontSize: "16px", lineHeight: "1" }}>
            {direction === "left" ? "❮" : "❯"}
        </span>
    </div>
);

const PinItem = ({ props }) => {
    const router = useRouter();
    const { pin } = props;
    
    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1, // scroll 1 image at a time
        nextArrow: <CustomArrow direction="right" />,
        prevArrow: <CustomArrow direction="left" />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false
                }
            }
        ]
    };

    return (
        <div style={{ padding: '0 25px 20px' }}>
            {pin.documents && pin.documents.length > 0 && (
                <Slider {...settings}>
                    {pin.documents.map((item, index) => (
                        <div key={index} style={{ padding: '10px' }}>
                            <div 
                                style={{ 
                                    margin: '0 10px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: '#fff',
                                    borderRadius: '8px',
                                    border: '1px solid #f0f0f0',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                    overflow: 'hidden',
                                    height: '240px'
                                }}
                                onClick={() => {
                                    router.push(`/${item.ROOT_PARENT_NAME_SLUG}/${item.NAME_SLUG}-${item.IDENTITY_KEY}`, { scroll: false })
                                }}
                            >
                                <div style={{ 
                                    width: '100%', 
                                    height: '160px', 
                                    background: '#f8f9fa',
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center' 
                                }}>
                                    <Image
                                        preview={false}
                                        fallback="/docTaiLieu.png"
                                        src={item.IMAGE_LINK ? `${process.env.NEXT_PUBLIC_API_URL}${item.IMAGE_LINK}` : (item.IS_FOLDER ? "/folder.png" : "/docTaiLieu.png")}
                                        alt={item.NAME}
                                        style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{ 
                                    padding: '12px', 
                                    width: '100%',
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <div className="customLink font12pt boxDocument" title={item.NAME} style={{ 
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        textAlign: 'left',
                                        fontWeight: '600',
                                        color: '#333',
                                        lineHeight: '1.4'
                                    }}>
                                        {item.NAME}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            )}
        </div>
    );
}

export default PinItem;