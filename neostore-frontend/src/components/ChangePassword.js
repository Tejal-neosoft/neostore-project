import React, { useState, useEffect } from 'react'
import jwtdecode from 'jwt-decode';
import { changePasswordService } from '../config/Myservice'
import bcrypt from 'bcryptjs'
import Swal from 'sweetalert2';
import { Navigate, useNavigate } from 'react-router-dom';

export default function ChangePassword() {
    const [state, setstate] = useState({ oldpassword: "", newpassword: "", confpassword: "" })
    const [pass, setpass] = useState({ password: '', email: '' })
    const navigate = useNavigate()
    const handler = (event) => {
        const { name, value } = event.target
        setstate({ ...state, [name]: value })
    }
    useEffect(() => {
        if (localStorage.getItem('_token') !== undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwtdecode(token)
            setpass({ password: decode.password, email: decode.email })
        }
    }, [])

    //for changing password
    const submit = () => {
        if (state.oldpassword !== '' && bcrypt.compareSync(state.oldpassword, pass.password)) {
            if (state.newpassword !== '' && state.confpassword !== '' && state.newpassword === state.confpassword) {
                changePasswordService({ email: pass.email, password: state.newpassword })
                    .then(res => {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: res.data.ms,
                            showConfirmButton: false,
                            timer: 1500
                          })
                        localStorage.setItem("_token", res.data.token);
                        setstate({ oldpassword: "", newpassword: "", confpassword: "" })

                    })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Password does not match!!!',
                  })
            }
        }
        else {
            Swal.fire(
                'The Feilds are Empty?',
                'Please Enter the data!!!',
                'question'
              )
        }
    }

    return (
        <div>
        {localStorage.getItem('_token')!=undefined ?
        <>
            <h4 className='ml-4 ' style={{ letterSpacing: '1px' }} > <i className="fa fa-lock mr-2 p-1" style={{ fontSize: '1.2em' }}></i>Change Password</h4>
            <hr />
            <div className='container-justify mt-4' style={{marginLeft:'5rem'}}>
                <span>Old Password:</span>
                <input type="password" className="form-control mb-2  mt-2" id="oldpassword" placeholder="Old password" name="oldpassword" onChange={handler}
                    value={state.oldpassword} style={{ marginBottom: '2rem',width:'85%' }} />

                <span>New Password:</span>
                <input type="password" className="form-control mb-2 mt-2" id="newpassword"
                    placeholder="New password" name="newpassword"
                    value={state.newpassword} onChange={handler} style={{ marginBottom: '2rem',width:'85%' }} />

                <span>Confirm Password:</span>
                <input type="password" className="form-control mt-2  mb-2" id="confpassword"
                    placeholder="Confirm password" name="confpassword" onChange={handler}
                    value={state.confpassword} style={{ marginBottom: '2rem',width:'85%' }}/>

                <button className="btn btn-primary mt-4" style={{marginLeft:'16rem'}} onClick={() => submit()}>Submit</button>

            </div>

            </>
                : <Navigate to='/login'></Navigate>}
        </div>
    )
}