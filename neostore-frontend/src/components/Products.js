import React, { useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Navbar from './Navbar';
import Footer from './Footer';
import { FaRupeeSign } from "react-icons/fa";
import ReactStars from 'react-stars';
import Pagination from 'react-js-pagination';
import { fetchProductService, getCatandCol } from '../config/MyProductService'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

function Products() {
    const [state, setstate] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [resultperPage, setresultperPage] = useState(0)
    const [productCount, setproductCount] = useState(0)
    const [sortdata, setSortdata] = useState('all')
    const [categorys, setcategorys] = useState([])
    const [colors, setcolors] = useState([])
    const [fcategorys, setFcategorys] = useState("cate")
    const [fcolor, setFcolor] = useState("color")
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const searchProduct = useSelector(state => state.profileReducer)
    useEffect(() => {
        let prodcount = 0
        let resultPerPage = 0
        let prod = []
        fetchProductService(searchProduct.search, currentPage, sortdata, fcategorys, fcolor)
            .then(res => {
                prod = res.data.products
                prodcount = res.data.productsCount
                resultPerPage = res.data.resultPerPage
                setstate(prod)
                setproductCount(prodcount)
                setresultperPage(resultPerPage)
            })
        getCatandCol()
            .then(res => {
                setcategorys(res.data.category)
                setcolors(res.data.color)
            })

    }, [searchProduct.search, currentPage, sortdata, fcategorys, fcolor])

    //rating
    const rating = (ele) => {
        return {
            edit: false,
            color: "rgba(20,20,20,0.1)",
            activeColor: "tomato",
            size: window.innerWidth < 600 ? 20 : 25,
            value: ele.product_rating,
            isHalf: true,
        };

    }

    //currentpage
    const setCurrentPageNo = (e) => {
        setCurrentPage(e);
    };

    //to show all products
    const alldata = () => {
        setSortdata("all");
        setFcategorys("cate");
        setFcolor("color");
        setCurrentPage(1)
        if (fcategorys !== "cate" || fcolor !== "color") {
            document.getElementById(fcategorys).checked = false;
            document.getElementById(fcolor).checked = false;
        }
        dispatch({ type: "searchRedux", payload: '' })

    };


    //color
    const color = (e) => {
        setFcolor(e);
        setSortdata("alldata");
    };

    //categoies
    const categories = (e) => {
        setFcategorys(e)
        setCurrentPage(1);
      }
    return (
        <>
            <Navbar />
            <div className='container-fluid mt-4 '>

                <div className='row'>
                    <div className='col-sm-12 col-md-12 col-lg-3'>
                        <button className='btn btn-primary mt-5 w-100 p-2' onClick={() => alldata()}>All Products</button>
                        <div className='mt-4'>
                            
                                <Accordion style={{ backgroundColor: 'mintcream' }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography>Category</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            {categorys &&
                                                categorys.map((cat) => (
                                                    <li key={cat._id} style={{ listStyle: 'none' }}>
                                                        <input
                                                            type="radio"
                                                            id={cat._id}
                                                            onClick={(e) => categories(e.target.value)}
                                                            name="categories"
                                                            value={cat._id}
                                                        /> &nbsp;&nbsp; {cat.category_name}
                                                        <br></br>
                                                    </li>
                                                ))}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            <br />
                            {
                                fcategorys != 'cate' && <Accordion style={{ backgroundColor: 'mintcream' }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel2a-content"
                                        id="panel2a-header"
                                    >
                                        <Typography>Colors</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            {colors &&
                                                colors.map((cat) => (
                                                    <li key={cat._id} style={{ listStyle: 'none' }}>
                                                        <input
                                                            type="radio"
                                                            id={cat._id}
                                                            onClick={(e) => color(e.target.value)}
                                                            name="color"
                                                            value={cat._id}
                                                        /> &nbsp;&nbsp;{cat.color_name}
                                                        <br></br>
                                                    </li>
                                                ))}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            }



                        </div>


                    </div>
                    <div className='col-sm-12 col-md-12 col-lg-9 border-left'>
                        <div className=' text-right mt-2' style={{ paddingRight: 70 }}>
                            Sort By : <i className="fa fa-star mx-2" onClick={() => setSortdata("star")} ></i>
                            <span style={{ color: "#1E90FF" }}><FaRupeeSign style={{ fontSize: "0.7rem" }} /><i className="fa fa-arrow-up " onClick={() => setSortdata("assend")}></i></span>
                            <span style={{ color: "#1E90FF" }}><FaRupeeSign style={{ fontSize: "0.7rem" }} /><i className="fa fa-arrow-down" onClick={() => setSortdata("desend")}></i></span>
                        </div>
                        <div className='row'>


                            {
                                state.map(prod =>
                                    <div className='col-sm-12 col-md-6 col-lg-4' key={prod._id}>
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

            </div>
            <div className="paginationBox d-flex justify-content-center mt-5">
                {fcategorys == 'cate' &&
                    <Pagination
                        activePage={currentPage}
                        itemsCountPerPage={resultperPage}
                        totalItemsCount={productCount}
                        onChange={setCurrentPageNo}
                        nextPageText="Next"
                        prevPageText="Prev"
                        firstPageText="1st"
                        itemclassName="page-item"
                        linkclassName="page-link"
                        activeclassName="pageItemActive"
                        activeLinkclassName="pageLinkActive"
                        itemClass="page-item"
                        linkClass="page-link"
                    />}
            </div>
            <Footer />

        </>
    )
}

export default Products
