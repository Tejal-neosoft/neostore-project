import React, { useState, useEffect } from 'react'
import { useLocation , Navigate} from 'react-router-dom'
import { checkOutService } from '../config/MyProductService'
import jwtdecode from 'jwt-decode';
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import Navbaar from './Navbar';
import Footer from './Footer';
import Swal from 'sweetalert2';
import { cartSaveService } from '../config/Myservice';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FaShippingFast } from "react-icons/fa";

function Checkout() {
    const location = useLocation();
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [state, setState] = useState({ cardNum: '', cvv: '', name: '', expDate: '', userEmail: '' })
    const [errors, setErrors] = useState({ cardNum: '', cvv: '', name: '', expDate: '' })
    const [isSumbit, setIsSubmit] = useState(false)
    const [addresses, setaddress] = useState([])
    const [value, setValues] = useState([])

    useEffect(() => {
        if (localStorage.getItem('_token') !== undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwtdecode(token)
            setState({ ...state, userEmail: decode.email })
            setaddress(decode.addresses)

        }
        else {
            navigate('/login')
        }
    }, [])


    //for storing data after user purchases the products
    const checkout = () => {
        setErrors(null)
        setIsSubmit(true)
        let temp = validate(state)
        if (state.cardNum != '' && state.cvv != '' && state.expDate != '' && state.name != '' && state.userEmail != '' && temp.length === 0 && value!=null) {
            let formData = {
                user_email: state.userEmail,
                card_name: state.name,
                subtotal: location.state.subTotalState.subTotal,
                gst: location.state.subTotalState.gst,
                totalCart: location.state.cart,
                addresses: addresses[value],
            }
            checkOutService(formData)
                .then(res => {
                    cartSaveService({ data: [], email: state.userEmail })
                        .then(res => {
                            localStorage.setItem('_token', res.data.token)
                        })
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: res.data.msg,
                            showConfirmButton: false,
                            timer: 1500
                          })
                    localStorage.removeItem('cart')
                    dispatch({ type: "emptyCart", payload: 0 })
                    navigate('/')
                })

        }
        else {
            Swal.fire(
                'The Fields are empty?',
                'Please Enter the data!!',
                'question'
              )
        }
    }



//for validation
    const validate = (values) => {
        const e = []
        const errors = {};
        if (!values.cardNum) {
            e.push({ cardNum: "card number required" })
            errors.cardNum = "Card Number is required"
        } else if (values.cardNum.length !== 16) {
            e.push({ cardNum: "Card number should be  16 digits" })
            errors.cardNum = "Card number should be  16 digits"
        }
        if (!values.cvv) {
            e.push({ cvv: "cvv is required" })
            errors.cvv = "CVV  is required"
        } else if (values.cvv.length !== 3) {
            e.push({ cvv: "CVV  should be  3 digits" })
            errors.cvv = "CVV  should be  3 digits"
        }
        if (!values.name) {
            e.push({ name: "Name is required" })
            errors.name = "Name  is required"
        } else if (values.name.length < 3) {
            e.push({ name: "Name  should be greater than 3 letter" })
            errors.name = "Name  should be greater than 3 letter"
        }
        if (!values.expDate) {
            e.push({ expDate: "Expiration Date is required" })
            errors.expDate = "Expiration Date  is required"
        }


        setErrors(errors)
        return e

    }

    useEffect(() => {
        if (Object.keys(errors).length === 0 && isSumbit) {
            console.log(errors);
        }
    }, [errors])
    return (
        <>
        { localStorage.getItem('_token') != undefined ?
        <>
            <Navbaar />
            <div className='container-fluid m-0'>
                <div className='row'>
                    <div className='col-lg-8 container' style={{marginTop:'4rem'}}>
                        <div className='container text-center'>
                                    {errors.cardNum && <p className="alert alert-danger  w-50">{errors.cardNum}</p> || errors.name && <p className="alert alert-danger  w-50">{errors.name}</p> || errors.cvv && <p className="alert alert-danger  w-50">{errors.cvv}</p>|| errors.expDate && <p className="alert alert-danger  w-50">{errors.expDate}</p>}
                                    </div>
                    <div className="card_checkout container-justify " >
                      
                        <img src="https://seeklogo.com/images/V/VISA-logo-62D5B26FE1-seeklogo.com.png" className="logo-card" />

                        <label className='label_check'>Card number:</label>
                        <input id="user" type="text" value={state.cardNum} className="input_ch cardnumber" placeholder="1234 5678 9101 1121" name='cardNum' onChange={e => setState({ ...state, cardNum: e.target.value })}/>

                        <label className='label_check'>Name:</label>
                        <input className="input_ch name_ch" name='name' value={state.name} placeholder="Edgar Pérez" onChange={e => setState({ ...state, name: e.target.value })}/>

                        <label className="toleft label_check">CCV:</label>
                        <input className="input_ch toleft ccv" placeholder="321" name='cvv' value={state.cvv} onChange={e => setState({ ...state, cvv: e.target.value })} /><br /><br/>

                        <label className='text-white d-block' style={{ opacity: '.4' }}>Expiration Date:</label>
                        <input className="input_ch name_ch" type='date' placeholder="Edgar Pérez" name='expDate' value={state.expDate} onChange={e => setState({ ...state, expDate: e.target.value })} />
                    </div>
                    </div>
                 

                    <div className='col-lg-4'>
                        <div className="card container" style={{ height: "34rem" }}>
                            <div className='orderSummary'>
                                <h4 className='mt-5 text-center'>Checkout Summary</h4>
                             
                                <table className='table'>
                                    <tbody className="product_cost">
                                        <tr>
                                            <td>Subtotal</td>
                                            <td>{location.state.subTotalState.subTotal}</td>
                                        </tr>
                                        <tr>
                                            <td>GST (5%)</td>
                                            <td>{location.state.subTotalState.gst}</td>
                                        </tr>
                                        <tr>
                                            <td>Order Total</td>
                                            <td>{location.state.subTotalState.grandTotal}</td>
                                        </tr>


                                    </tbody>
                                </table>

                            </div>

                        <div className='container'>
                            <h5 className='mt-3'><FaShippingFast/>Shipping Address</h5>
                            <Accordion className=" mt-3 w-100" defaultExpanded={true}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                >
                                    <Typography sx={{ width: '30%', flexShrink: 0 }}>
                                        Address
                                    </Typography>

                                </AccordionSummary>
                                <AccordionDetails>
                                    {addresses.length != 0 ?
                                        <Typography>

                                            {addresses.map((ele, index) =>
                                                
                                                    <li key={index} style={{listStyle:'none'}}>
                                                        <input type="radio" name="address" value={index}
                                                            onClick={(e) => setValues(e.target.value)} defaultChecked />
                                                        &nbsp; &nbsp;
                                                        {ele.address + " " + ele.city + " " + ele.pincode + " " + ele.states + " " + ele.country}
                                                 
                                                    </li>

                                                
                                            )}
                                        </Typography>
                                        :
                                        <button className="btn btn-primary" onClick={() => navigate('/account/address')}>Add address</button>}
                                </AccordionDetails>
                            </Accordion>

                        </div>

                            <button className='btn btn-danger mt-2 w-25' style={{ marginLeft: '1rem' }} onClick={() => checkout()}>Pay</button>
                        </div>
                    </div>
                </div>
            </div>


            <Footer />
            </>  
            : 
            <Navigate to='/login'></Navigate>
            }
        </>
    )
}

export default Checkout