import React,{useState} from 'react'
import Swal from 'sweetalert2';
import { emailSubscribeService } from '../config/Myservice';


export default function Footer() {
    const [stateemail, setemail] = useState('')

//for email subscription
    const subscribe = () => {
        if (stateemail !== '') {
            emailSubscribeService({ email: stateemail })
                .then(res => {
                    if (res.data.err === 0) {
                        console.log(res.data)
                        Swal.fire({
                            icon: 'success',
                            title: 'Thank you for subscribing!!!',
                            showConfirmButton: false,
                            timer: 1500,
                            width: 600,
                          })
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
                'Empty!!?',
                'Please enter Email!!!',
                'question'
              )
        }
    }
    return (
        <>
            <div className='container-fluid m-0 text-white footer' style={{backgroundColor:'black'}}>
            <div className='container-fluid text-center mx-auto my-auto row'>
            <div className='col-sm-12 col-md-6 col-lg-4  mt-3 '>
                <h5>About Company</h5>
                <ul style={{listStyle:"none"}} className='mt-4'>
                <li><span>NeoSOFT Technologies is here at your quick and easy service for shopping.</span></li>
                <li className='font-weight-bold mt-2'>Contact information</li>
                <li>Email: contact@neosofttech.com</li>
                <li>Phone: +91 0000000000</li>
                <li>MUMBAI, INDIA</li>
                </ul>
                
            </div>
            <div className='col-sm-12 col-md-6 col-lg-4  mt-3'>
                <h5 className='ml-5'>Information</h5>
                <ul style={{listStyle:"none"}} className='mt-4'>
                    <li><a href='images/tc.pdf' target='_blank' style={{color:'white'}}>Terms and Conditions</a></li>
                    <li>Guarantee and Return Policy</li>
                    <li>Contact Us</li>
                    <li>Privacy Policy</li>
                    <li><a href='https://www.google.com/maps/place/NeoSOFT+Technologies/@19.024365,72.844281,15z/data=!4m5!3m4!1s0x0:0x781b6db9b065f3c0!8m2!3d19.024365!4d72.844281' target='_blank' style={{color:'white'}}>Locate Us</a></li>
                </ul>

            </div>
            <div className='col-sm-12 col-md-6 col-lg-4  mt-3'>
                <h5>Newsletter</h5>
                <ul style={{listStyle:"none"}} className='mt-4'>
                    <li>Signup to get exclusive offer from our favourite brand and to well up in the news</li>
                    <li><input className='form-control w-75 ml-5 mt-2' value={stateemail} type="search" placeholder='your email...' onChange={e=>setemail(e.target.value)}/>
                    <button className='btn mt-3' onClick={subscribe}>Subscribe</button></li>
                </ul>
            </div>
            </div>
            <div className='text-white text-center'>© 2022 NeoSOFT Technologies All rights reserved | Designed By <span className='font-weight-bold'>Tejal Supe</span></div>
            </div>
        </>
    )
}
