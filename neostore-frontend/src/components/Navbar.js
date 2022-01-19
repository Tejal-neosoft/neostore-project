import React, { useEffect, useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import { Button, Form, FormControl, NavDropdown } from 'react-bootstrap'
import {  MdAccountCircle } from 'react-icons/md'
import { BiLogIn, BiLogOut, BiUserPlus } from "react-icons/bi";
import { FiShoppingCart } from "react-icons/fi";
import { FaUserTie } from "react-icons/fa";
import { useSelector,useDispatch } from 'react-redux'
import { cartSaveService } from '../config/Myservice';
import jwtDecode from 'jwt-decode';



export default function Navbaar() {
    const [login, setlogin] = useState(false)
    const [state, setState] = useState({})
    const [search , setSearch] = useState('')
    const cartData = useSelector(state => state.cartData)
     const navigate = useNavigate()
    const dispatch = useDispatch();


    useEffect(() => {
        if (localStorage.getItem('_token') != undefined) {
            setlogin(true)
            let token = localStorage.getItem('_token');
            let decode = jwtDecode(token)
            setState(decode)
        }



    }, [])

    //for searching the prodcuts
    const searchprod = () => {
        dispatch({type:"searchRedux", payload: search})
        navigate("/product")
    }

    //for user logout 
    const logout = () => {
        let data = JSON.parse(localStorage.getItem('cart'))
        cartSaveService({ data: data, email: state.email })
            .then(res => {
                console.log(res.data)
            })
        localStorage.removeItem('_token');
        localStorage.removeItem('cart');
        dispatch({ type: "emptyCart", payload: 0 })

    }
    return (
        <div>
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark" style={{backgroundColor:'black'}}>
                    <div className="container-fluid">
                        <Link className="navbar-brand font-weight-bold" to="/dashboard" style={{ fontSize: "1.6rem" }}>Neo<span style={{ color: "red" }}>STORE</span></Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav">

                                <li className="nav-item">
                                    <Link className="nav-link mr-1" to="/">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link mr-1"  to="/product" >Product</Link>
                                </li>
                                <li className="nav-item">
                                    {login ?
                                        <Link  className="nav-link mr-1" to="/account/order">Order</Link >
                                        :
                                        <Link  className="nav-link mr-1"  to="/login">Order</Link>
                                    }
                                </li>
                            </ul>
                        </div>

                        <Form className="d-flex">
                            <FormControl
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                value={search}
                                onChange={(e)=>setSearch(e.target.value)}
                            />
                            <Button variant="outline-success" onClick={()=>searchprod()} className='ml-2 mr-4'>Search</Button>
                        </Form>

                        <div>
                            <Link to="/cart" style={{ color: "white", textDecoration: "none" }}><FiShoppingCart size='22px' /> <span className='mr-1'>{cartData.count}</span> </Link>
                        </div>
                        {login ?
                            <NavDropdown title={<FaUserTie style={{  color: 'white', width: '30px', height: '27px' }} />} id="navbarScrollingDropdown">
                                <NavDropdown.Item ><Link to="/account/profile" style={{ color: "black", textDecoration: "none" }} ><MdAccountCircle /> My Account</Link></NavDropdown.Item>
                                <NavDropdown.Item ><Link to="/" style={{ color: "black", textDecoration: "none" }} onClick={() => logout()}><BiLogOut />&nbsp;&nbsp; Signout</Link></NavDropdown.Item>
                            </NavDropdown>
                            :
                            <NavDropdown title={<FaUserTie style={{  color: 'white', width: '30px', height: '27px' }} />} id="navbarScrollingDropdown">
                                <NavDropdown.Item ><Link to="/login" style={{ color: "black", textDecoration: "none" }} ><BiLogIn />&nbsp;&nbsp;Login</Link></NavDropdown.Item>
                                <NavDropdown.Item ><Link to="/register" style={{ color: "black", textDecoration: "none" }}><BiUserPlus />&nbsp;&nbsp; Register</Link></NavDropdown.Item>
                            </NavDropdown>
                        }

                    </div>
                </nav>
            </div>
        </div>
    )
}