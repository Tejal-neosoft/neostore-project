import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { Link, Navigate, Outlet } from 'react-router-dom'
import Footer from './Footer'
import jwtdecode from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux'
function Account() {
    const [state, setState] = useState({})
    const profileName = useSelector(state => state.profileReducer) 
    const dispatch = useDispatch();
    useEffect(() => {
        if (localStorage.getItem('_token') != undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwtdecode(token)
            setState(decode)
            dispatch({ type: "updateProfile", payload: decode.firstname + " " + decode.lastname }) //dispatch for updating profile
            dispatch({ type: "updatePicture", payload: decode.profilepic }) //dispatch for updating profile picture
        }
    }, [])
    return (
        <>
        <div>
         
            {localStorage.getItem('_token')!=undefined ? 
            <>
            <Navbar />
            <div className='container-fluid pb-3' style={{ backgroundColor: 'mintcream' }}>
            <div className='container-fluid m-auto' style={{ backgroundColor: 'mintcream' }}>

                <div className='row ml-2 mb-3' style={{ width: '100%', height: '50%' }}>

                    <div className='col-sm-12 col-md-12 col-lg-3 text-center pt-5'  >
                        {profileName.profile == undefined ?
                            <img src='https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg' className='rounded-circle' alt='profile' height='200px'/>
                            : <img src={`../images/${profileName.profile}`} alt='Profile' className='rounded-circle' height='200px' />}

                        <h5 className='mt-2 text-capitalize' >{profileName.name} </h5>
                        <div className='container text-left ml-5  mt-3' >
                            <table>
                                <tbody>
                                    <tr>
                                        <td ><i className="fa fa-map-marker mr-2 p-1 " style={{ fontSize: '1.5em' }}></i></td>

                                        <td><Link to='/account/address' >Address</Link><br /></td>
                                    </tr>

                                    <tr>
                                        <td> <i className="fa fa-id-badge mr-2 p-1" style={{ fontSize: '1.1em' }}></i></td>
                                        <td><Link  to='/account/profile' >Profile</Link><br /></td>
                                    </tr>

                                    <tr>
                                        <td><i className="fa fa-shopping-cart mr-2 p-1" style={{ fontSize: '1.2em' }}></i></td>

                                        <td><Link to='/account/order'>Order</Link><br /></td>
                                    </tr>

                                    <tr>
                                        <td><i className="fa fa-lock mr-2 p-1" style={{ fontSize: '1.2em' }}></i></td>

                                        <td><Link to='/account/changepassword'>Change Password</Link><br /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='container col-sm-12 col-md-12  col-lg-9 border-left' style={{ marginTop: '3em' }}>
                        <div className='container p-4' style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', backgroundColor: 'white' }} >
                          

                            <Outlet />
                        </div>
                    </div>
                </div>

            </div>
            </div>
            <Footer />
            </>
            : <Navigate to='/login'></Navigate>}
         
        </div>
        </>
    )
}

export default Account
