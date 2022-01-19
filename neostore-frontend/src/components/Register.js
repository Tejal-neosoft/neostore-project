import React, { useState } from 'react'
import { addPost } from '../config/Myservice';
import { useNavigate } from "react-router";
import SocialButton from './SocialButton';
import Footer from './Footer'
import Navbaar from './Navbar'
import Swal from 'sweetalert2';
const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForName = RegExp(/^[A-Za-z]{3,30}$/);
const regForContact = RegExp(/^[6-9][0-9]{9}/);
const regForpassword = RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

export default function Register() {
    const [errors, seterrors] = useState({errfirstname:'', errlastname:'', erremail:'', errcontact:'', errpassword:'', errcpassword:'', errgender:'', pass: null})
    const [data, setdata] = useState({firstname:'', lastname:'', email:'', contact:'',password:'', cpassword:'', gender:''})
    const navigate = useNavigate()

    //handler for handling errors
    const handler = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case "firstname":
                let error1 = regForName.test(value) ? "" : "Invalid Name";
                seterrors({ ...errors, errfirstname: error1 });
                break;

            case "lastname":
                let error2 = regForName.test(value) ? "" : "Invalid Name";
                seterrors({ ...errors, errlastname: error2 });
                break;

            case "email":
                let error3 = regForEmail.test(value) ? "" : "Invalid Email";
                seterrors({ ...errors, erremail: error3 });
                break;

            case "contact":
                let error4 = regForContact.test(value) ? "" : "Invalid Contact";
                seterrors({ ...errors, errcontact: error4 });
                break;

            case "password":
                let error5 = regForpassword.test(value) ? "" : "Invalid Password";
                seterrors({ ...errors, errpassword: error5, pass: value });
                break;

            case "cpassword":
                let error6 = value === errors.pass ? "" : "Password does not match";
                seterrors({ ...errors, errcpassword: error6 });
                break;
        }
        setdata({...data, [name]: value})
    }

    //validate funtion for submiting data
    const validate = async () => {
        if(data.firstname != '' && data.lastname != '' && data.email != '' && data.contact != '' && data.password != '' && data.cpassword != '' && data.gender != ''){
            let formData = {
                firstname:data.firstname,
                lastname:data.lastname,
                email:data.email,
                contact:data.contact,
                password:data.password,
                cpassword:data.cpassword,
                gender:data.gender
            }
            await addPost(formData) 
            .then(res =>{
                if (res.data.err == 0){
                    Swal.fire({
                        icon: 'success',
                        title: res.data.msg,
                        showConfirmButton: false,
                        timer: 1500,
                        width: 600,
                      })
                    navigate("/")
                }
                else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.data.msg,

                      })
                }
            })
        }
        else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Enter All User Details!!",

              })
        }
    }

    //social login
    const handleSocialLogin = async (user) => {
    
            let formData = {
                firstname: user._profile.firstName,
                lastname: user._profile.lastName,
                email: user._profile.email,
                contact: 9999999999,
                password: user._profile.id,
                gender: 'undefined'
              };
             await addPost(formData)
             .then(res =>{
                if (res.data.err == 0){
                    Swal.fire({
                        icon: 'success',
                        title: res.data.msg,
                        showConfirmButton: false,
                        timer: 1500,
                        width: 600,
                      })
                    navigate("/")
                }
                else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.data.msg,

                      })
                }
             })
      };

    const handleSocialLoginFailure = (err) => {
        console.error(err);
      };

    return (
        <>
       
        <Navbaar/>
      
        <div className='registerdiv mb-4'>
            <div className='container-fluid'>
                {/* Social Register */}
            <div className='mt-2 d-flex justify-content-center'>
            <SocialButton
                provider="facebook"
                appId="2171649733000264"
                onLoginSuccess={handleSocialLogin}
                onLoginFailure={handleSocialLoginFailure} 
                className="btn btn-primary mb-3 mr-4">
                <i className="fa fa-facebook mr-2"></i>
                Continue With facebook
            </SocialButton>

            <SocialButton 
                provider="google"
                appId="420321224046-je2rf4df9mqcua73ve0usqqvrsoqvdi5.apps.googleusercontent.com" 
                onLoginSuccess={handleSocialLogin}
                onLoginFailure={handleSocialLoginFailure}
                className="btn btn-danger mb-3">
                <i className="fa fa-google mr-2"></i>
              Continue With Google
            </SocialButton>
            </div>
            <div className='container-fluid justify-content-center form-div mt-1'>
            <div className='container p-4 '>
               
                <h4 className='text-center '>Register to Neo<span style={{color:'red'}}>STORE</span></h4>
                {/* Register */}
                <div className='container mt-4'>
                    <input type="text" id='firstname' className='form-control mt-3' name='firstname' value={data.firstname} onChange={handler} placeholder='First Name' />
                    <span className="text-danger">{errors.errfirstname}</span>

                    <input type="text" id='lastname' className='form-control mt-3' name='lastname' value={data.lastname} onChange={handler} placeholder='Last Name' />
                    <span className="text-danger">{errors.errlastname}</span>

                    <input type="text" id='email' className='form-control mt-3' name='email' value={data.email} onChange={handler} placeholder='Email Address' />
                    <span className="text-danger">{errors.erremail}</span>

                    <input type="text" id='contact' className='form-control mt-3' name='contact' value={data.contact} onChange={handler} placeholder='Contact' />
                    <span className="text-danger">{errors.errcontact}</span>

                    <input type="password" id='password' className='form-control mt-3' name='password' value={data.password} onChange={handler} placeholder='Password'/>
                    <span className="text-danger">{errors.errpassword}</span>

                    <input type="password" id='cpassword' className='form-control mt-3' name='cpassword' value={data.cpassword} onChange={handler} placeholder='Confirm Password'/>
                    <span className="text-danger">{errors.errcpassword}</span> <br/>
                    
                    <input type="radio" id="male" name="gen" value="male" onClick={e=> setdata({...data, gender: e.target.value})} defaultChecked/> Male  &nbsp;&nbsp;
                    <input type="radio" id="female" name="gen" value="female" onClick={e=> setdata({...data, gender: e.target.value})}/> Female <br/>

                    <button className='btn btn-success mt-3 w-75 ml-5' onClick={validate}>Register</button>
                </div>
              
            </div>
            </div>
            </div>
          
        </div>
        <Footer/>
        </>
      
    )
}