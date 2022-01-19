import React, { useState, useEffect } from 'react'
import Footer from './Footer'
import Navbar from './Navbar'
import ReactStars from 'react-stars';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { getPopularProduct } from '../config/MyProductService';

export default function Home() {
    const [state, setstate] = useState([])
    const navigate = useNavigate()
    const dispatch = useDispatch();


    useEffect(() => {
        let prod = [];
        getPopularProduct().then((res) => {
            prod = res.data.products;
            setstate(prod);
        });
    }, [])

    //rating products
    const rating = (prod) => {
        return {
            edit: false,
            color: "rgba(20,20,20,0.1)",
            activeColor: "tomato",
            size: window.innerWidth < 600 ? 20 : 25,
            value: prod.product_rating/prod.rated_by,
            isHalf: true,
        };

    }
    return (
        <div>
            {/* Navbar */}
            <Navbar />

            {/* Carousel */}
            <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner">
                    <div style={{ width: "100%", height: "80%" }}>

                        <div className="carousel-item active" >
                            <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/amazon-rivet-furniture-1533048038.jpg?crop=1.00xw:0.502xh;0,0.423xh&resize=1200:*" alt="First slide" style={{ width: "100%", height: "35rem" }} />

                        </div>


                        <div className="carousel-item">
                            <img src="https://ozobags.com/img/1920x1080/04b.jpg" alt="Second slide" style={{ width: "100%", height: "35rem" }} />
                        </div>
                        <div className="carousel-item">
                            <img src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/34f1a475337425.5c49b522d7209.jpg" alt="Third slide" style={{ width: "100%", height: "35rem" }} />


                        </div>
                    </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>

            {/* Popular Products*/}

            <div className='container-justify m-0 p-0'>
                <h6 className='text-center mt-4 heading_dash'>Popular Products</h6>
                <div className='container m-auto'>
                    <div className='row m-auto'>


                        {
                            state.map(prod =>
                                <div className='col-sm-12 col-md-6 col-lg-4 mb-4' key={prod._id}>
                                    <div className='card mt-4 product' style={{ width: '19rem', height: '31rem' }}>
                                        <div className='container ' style={{ height: '20rem' }}>
                                            <img className="card-img-top p-3 " src={"./images/" + prod.product_image} alt="Card image cap" height='300px' onClick={() => navigate('/productdetails', { state: prod })} />
                                        </div>
                                        <div className="card-body bg-light">
                                            <h6 className="card-title">{prod.product_name}</h6>
                                            <span className="card-text">Rs. {prod.product_cost}/-</span>
                                            <ReactStars {...rating(prod)} />
                                            <button className=" fa fa-shopping-cart w-100 mt-4 buttonCss" onClick={() => dispatch({ type: 'addCart', payload: prod })}> Add to Cart</button>
                                        </div>

                                    </div>
                                </div>

                            )
                        }
                        <div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    )
}