import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { forgetService, resetPassword } from '../config/Myservice';
import Swal from 'sweetalert2';
const regForpassword = RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");


export default function Forgetpassword() {
	const [state, setstate] = useState({ otp: null, flag: false, pass: '', cpass: '' })
	const location = useLocation();
	const navigate = useNavigate()
	const [otp, setOtp] = useState(0)

	//for storing the otp in setotp
	useEffect(()=>{
		setOtp(location.state.otp)

	},[])

	//submit otp function for checking if the otp are matched 
	const submitotp = () => {

		if (state.otp != null) {

			if (state.otp == otp) {
				Swal.fire({
					position: 'top-end',
					icon: 'success',
					title: 'Otp matched!!',
					showConfirmButton: false,
					timer: 1500
				})
				setstate({ ...state, flag: true })
			}
			else {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'Otp Does not match!!!',

				})
			}
		}
		else {
			Swal.fire(
				'Empty!?',
				'Please Enter the OTP!!!?',
				'question'
			)
		}
	}
	//for resend otp
	const resendotp = () => {
		forgetService({ email: location.state.email })
			.then(res => {
				setOtp(res.data.otp)
			})


	}

	//for reset password
	const resetpass = () => {
		if (regForpassword.test(state.pass) && state.pass === state.cpass) {
			resetPassword({ email: location.state.email, password: state.pass })
				.then(res => {
					Swal.fire({
						position: 'top-end',
						icon: 'success',
						title: res.data.msg,
						showConfirmButton: false,
						timer: 1500
					})

					navigate('/login')
				})
		}
		else {
			Swal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Please Enter Strong Password!!!',

			})
		}
	}

	return (
		<>
			<div className='container-fluid'>
				<div className='row'>
					<div className='col-lg-2 fp_image'></div>
					<div className='col-lg-10 fp_bg' >
						{state.flag !== true ?
							<div className="fp_form-container d-flex justify-content-center">
								<div className="fp_form-box " >
									<h4 className="mb-3 fp_heading_reset">Reset Your Password</h4>
									<p className="mb-3 fp_otp">
										An 4 digit OTP is sent to your registered email address
									</p>
									<div className="form-input">
										<input type="email" placeholder="Email Address" value={location.state.email} disabled className="mb-2 fp_input fp_email" />
									</div>
									<div className="form-input">
										<input type="text" value={state.otp} onChange={(e) => setstate({ ...state, otp: e.target.value })} placeholder="Enter OTP"
											className="mb-2 fp_input" />
									</div>
									<div className="mb-3">
										<button className="btn fp_submit" onClick={() => submitotp()}>Submit</button>
										<button className="btn fp_submit" onClick={() => resendotp()}>Resend OTP</button>
									</div>


								</div>
							</div>
							:

							<div className="fp_form-container d-flex justify-content-center">
								<div className="fp_form-box">

									<h4 className="mb-3 fp_heading_reset">Reset Your Password</h4>
									<p className="mb-3 fp_otp1">
										Enter Your New Password
									</p>
									<div className="form-input">

										<input className="mb-2 fp_input fp_email" type="password" placeholder="New Password" onChange={(e) => setstate({ ...state, pass: e.target.value })} value={state.pass} />
									</div>
									<div className="form-input">

										<input className="mb-2 fp_input fp_email" type="password" value={state.cpass} onChange={(e) => setstate({ ...state, cpass: e.target.value })} placeholder="Confirm Password" />
									</div>
									<div className="mb-3">
										<button className="btn fp_submit" onClick={() => resetpass()}>Reset</button>
									</div>
								</div>


							</div>

						}
					</div>
				</div>
			</div>

		</>

	)
}