import React, { useState } from 'react'
import { useNavigate } from "react-router";
import SocialButton from './SocialButton';
import { Link } from 'react-router-dom';
import { forgetService, loginpage } from '../config/Myservice';
import Swal from 'sweetalert2';
import jwtDecode from 'jwt-decode';
import Navbaar from './Navbar';
import { useDispatch } from 'react-redux'
import Footer from './Footer'

export default function Login() {
    const [state, setstate] = useState({ email: '', password: '' }) //state for email and password
    const navigate = useNavigate(); //navigation
    const dispatch = useDispatch(); //dispatch redux

    //cartdata funtion for adding cart to local storage
    const cartData = (data)=>{   
        let decode = jwtDecode(data)
        if(localStorage.getItem('cart')!=undefined){
            let cart = JSON.parse(localStorage.getItem('cart'))
            let arr = [...cart]
                decode.cart.forEach(element => {
                    if (!cart.find(ele => ele._id === element._id)) {
                        arr.push(element)
                    }
                });
                localStorage.setItem('cart', JSON.stringify([...arr]))
        }
        else{

            if(decode.cart!=null){
                localStorage.setItem('cart',JSON.stringify([...decode.cart]))
            }
            else{
                localStorage.setItem('cart',JSON.stringify([]))

            }

        }
        dispatch({ type: "onLogin", payload:decode.cart})    
        return 10
    }
    
    //passing data to loginpage route 
    const checkdata = () => {
      
        if (state.email != '' && state.password != '') {
          
            loginpage({ email: state.email, password: state.password })
                .then(res => {
                    if (res.data.err == 0) {
                        localStorage.setItem("_token", res.data.token); //setting token in local storage
                        cartData(res.data.token) //calling cartData() 
                        navigate("/")
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: res.data.msg,

                        })

                    }
                })
        }
        else {
            Swal.fire(
                'Empty!?',
                'Please Enter data!!!?',
                'question'
            )
        }
    }
    //forgetpassword
    const forgetpass = () => {
        if (state.email !== '') {
            forgetService({ email: state.email }) //sending email to the forgetservice
                .then(res => {
                    if (res.data.err == 0) {
                        navigate('/forgetpassword', { state: { email: state.email, otp: res.data.otp } }) //navigating to forgetpassword page with props as email and otp

                    }
                    else {

                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: res.data.msg,

                        })
                    }

                })
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please Enter Email!!',

            })
        }

    }

    //social login
    const handleSocialLogin = async(user) => {
       
        loginpage({ email: user._profile.email, password: user._profile.id }) //sending data to login route
            .then(res => {
                if (res.data.err == 0) {
                    localStorage.setItem("_token", res.data.token);
                   cartData(res.data.token)
                    navigate("/")
                    
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please Enter Email!!',
        
                    })
                }
            })
    }

    const handleSocialLoginFailure = (err) => {
        console.error(err);
    };

    return (
        <div>
         
         <Navbaar/>
            <div className='login-div m-auto '>
                <div className='container-fluid  login-inner m-auto'>
                  
                    <div className='login-right text-center m-auto'>
                        <h3 >Login to Neo<span style={{ color: 'red', fontWeight: 'bold' ,fontSize:'2rem'}}>STORE</span></h3>
                        <div className='container pt-2 ' >
                            <input className='form-control mt-4 w-75 ml-5 ' type="text" onChange={e => setstate({ ...state, email: e.target.value })} value={state.email} placeholder='Email Address' /> <br />
                            <input className='form-control w-75 ml-5' type="password" onChange={e => setstate({ ...state, password: e.target.value })} value={state.password} placeholder='Enter Password' />
                        </div>
                        <button className='btn btn-info mt-4 w-25 mb-4' onClick={() => checkdata()}>Login</button><br />
                        <span className='mt-5 '> <hr className='mt-3' /> </span>
                        <div >
                            <SocialButton
                                provider="facebook"
                                appId="2171649733000264"
                                onLoginSuccess={handleSocialLogin}
                                onLoginFailure={handleSocialLoginFailure}
                                className="btn btn-primary mb-3 mt-4">
                                <i className="fa fa-facebook mr-2"></i>
                                Continue With facebook
                            </SocialButton>
                            <br />
                          
                            <SocialButton
                                provider="google"
                                appId="420321224046-je2rf4df9mqcua73ve0usqqvrsoqvdi5.apps.googleusercontent.com"
                                onLoginSuccess={handleSocialLogin}
                                onLoginFailure={handleSocialLoginFailure}
                                className="btn btn-danger mb-3 mt-2">
                                <i className="fa fa-google mr-2"></i>
                                Continue With Google
                            </SocialButton>
                        </div>


                        <div className='text-center mt-3 bottom-login'  >
                            <Link to="/register" style={{ borderRight: "1px solid black", paddingRight: "10px" }}>Register Now</Link>
                            <a onClick={() => forgetpass()} style={{ color: 'blue' }} className='ml-2'>Forgot Password ?</a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
           
        </div>
    )
}
