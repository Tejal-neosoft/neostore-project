import React, { useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode'
import ReactToPdf from 'react-to-pdf';
import { FaRupeeSign } from "react-icons/fa";
import { Navigate, useLocation,useNavigate } from 'react-router-dom'

const options = {
    orientation: 'potrait',
    unit: 'in',
    format: 'A4'
};

export default function Invoice() {
    const [state, setstate] = useState({})
    const location = useLocation()
    const navigate = useNavigate()
    const ref = React.createRef();

    useEffect(()=>{
        let token = localStorage.getItem('_token');
        let decode = jwtDecode(token)
        setstate(decode)
    },[])

  
    return (
        <>  
        {localStorage.getItem('_token') != undefined ? <>
            <div className='container mt-3 d-flex justify-content-between'> 
                <button className='btn btn-danger' onClick={()=> navigate("/account/order")}>Go back</button>
                <ReactToPdf targetRef={ref} filename={`neostore_invoice.pdf`} options={options}>
                            {({ toPdf }) => (
                                <button className='btn btn-info' onClick={() => {
                                    toPdf();
                                }} variant="contained">
                                    Download
                                </button>
                            )}
                        </ReactToPdf> 
            </div>
            <div  className="container-fluid my-4 ">
                <div ref={ref} id='divToPrint' className="container p-5 page">
            <section className="top-content bb d-flex justify-content-between">
                <div className="logo">
                    <img src="images/logo.PNG" alt="" className="img-fluid"/>
                </div>
                <div className="top-left">
                    <div className="position-relative">
                        <p>Invoice No. <span>XXXX</span></p>
                    </div>
                </div>
            </section>

            <div className="store-user mt-5">
                <div className="container">
                    <div className="row bb pb-3">
                        <div className="col-7">
                            <p>Supplier,</p>
                            <h2 className='text-dark'>NEO<span className='text-danger'>STORE</span></h2>
                            <p className="address"> 4th Floor, The Ruby, <br/> 29 Senapati Bapat Marg <br/>Dadar West ,<br/>Mumbai , Maharashtra - 400028</p>
                        </div>
                        <div className="col-5">
                            <p>Client,</p>
                            <h2>{state.firstname}{' '}{state.lastname}</h2>
                            {location.state.addresses.map(ele=>
                            <p className="address">{ele.address}, <br/> {ele.city}{" "}{ele.states}- {ele.pincode} <br/>{ele.country}</p>
                            )}
                        </div>
                    </div>
                    <div className="row extra-info pt-3">
                        <div className="col-7">
                            <p>Payment Method: <span>Online Mode</span></p>
                            <p>Order Number: <span>#868</span></p>
                        </div>
                        <div className="col-5">
                           
                            <p>Order Date: <span>{location.state.created_at}</span></p>
                           
                        </div>
                    </div>
                </div>
            </div>

            <section className="product-area mt-4">
                <table className="table table-hover mt-4">
                    <thead className='bg-danger text-white'>
                        <tr>
                            <th>Item Description</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                     {location.state.totalCart.map((ele,id)=>
                        <tr key={id}> 
                            <td  key={id}>
                                <div className="media">
                                    <img className="mr-3 img-fluid" src={`./images/${ele.product_image}`} alt="Product 01"/>
                                    <div className="media-body">
                                        <p className="mt-0 title">{ele.product_name}</p>
                                    </div>
                                </div>
                            </td>
                            <td> <FaRupeeSign/>{ele.product_cost}</td>
                            <td>{ele.quantity}</td>
                            <td>{ele.product_cost * ele.quantity} Rs.</td>
                        </tr>
                       )}
                    </tbody>
                </table>
            </section>
<hr/>
            <section className="balance-info">
                <div className="row">
                    <div className="col-7">
                      
                    </div>
                    <div className="col-5">
                        <table className="table border-0 table-hover">
                            <tr>
                                <td>Sub Total:</td>
                                <td> <FaRupeeSign/>{location.state.subtotal}</td>
                            </tr>
                            <tr>
                                <td>GST(5%):</td>
                                <td>{location.state.gst}</td>
                            </tr>
                            <tfoot>
                                <tr>
                                    <td>Total:</td>
                                    <td>{location.state.subtotal + location.state.gst}</td>
                                </tr>
                            </tfoot>
                        </table>

                    
                    </div>
                </div>
            </section>

         
        </div>
    </div>
    </>: <Navigate to='/login'></Navigate>}
        </>
    )
}