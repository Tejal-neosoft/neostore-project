import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import {Modal,Button} from 'react-bootstrap'
import { addAddressService } from '../config/Myservice';
import { IoCloseCircle } from "react-icons/io5";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const regForPincode = RegExp(/^[1-9][0-9]{5}/);
const regForName = RegExp(/^[a-zA-Z]/);

export default function Address() {
    const [add, setadd] = useState({})
    const [state, setstate] = useState({ addresses: [], address: '', city: '', pincode: '', states: '', country: '', flag1: true, flag2: false, index: null })
    const [show, setShow] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [flagProceed,setFlagProceed] = useState(false)
    const [errors, seterrors] = useState({erraddress:'', errpincode:'', errcity:'', errstates:'', errcountry:'',errFull:''})
    const navigate = useNavigate()
    const location = useLocation()
    const handleClose = () => {
        setShow(false);
        setstate({ ...state, address: '', city: '', pincode: '', states: '', country: '' })

    }
    const handleCloseAddresss = () => setShowAddressModal(false);
    //handler for handling errors
    const handler = (event) => {
        const { name, value } = event.target;
        switch(name){
            case "address":
                let error1 = regForName.test(value) ? "" : "Invalid Address";
                seterrors({ ...errors, erraddress: error1 });
                break;

            case "pincode":
                let error2 = regForPincode.test(value) ? "" : "Invalid Pincode";
                seterrors({ ...errors, errpincode: error2 });
                break;

            case "city":
                let error3 = regForName.test(value) ? "" : "Invalid City";
                seterrors({ ...errors, errcity: error3 });
                break;

            case "states":
                let error4 = regForName.test(value) ? "" : "Invalid State";
                seterrors({ ...errors, errstates: error4 });
                break;

            case "country":
                let error5 = regForName.test(value) ? "" : "Invalid Country";
                seterrors({ ...errors, errcountry: error5 });
                break;
        }
        setstate({ ...state, [name]: value })
    }

    useEffect(() => {
        if (localStorage.getItem('_token') != undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwtDecode(token)
            setadd(decode)
            setstate({ ...state, addresses: decode.addresses })
            if(location.state!=null){
                setFlagProceed(true)
            }
        }
    }, [])

    //for updating address
    const updateAddress = () => {
        let data = state.addresses
        let formData = {
            address: state.address,
            city: state.city,
            pincode: state.pincode,
            states: state.states,
            country: state.country
        }
        data[state.index] = formData
        setstate({ ...state, addresses: data, flag2: false, address: '', city: '', pincode: '', states: '', country: '' })
        addAddressService({ data: state.addresses, email: add.email }) 
            .then(res => {
                localStorage.setItem("_token", res.data.token);
            })
            
            setShow(false)
    }
    //for adding new address
    const addAddress = () => {
        const email = add.email;
        if (state.address !== '' && state.city !== '' && state.pincode !== '' && state.states !== '' && state.country !== '') {
            let formData = {
                address: state.address,
                pincode: parseInt(state.pincode),
                city: state.city,
                states: state.states,
                country: state.country,
            }
            //we cannot match one object with another object
            if (state.addresses.find(ele => JSON.stringify(ele) === JSON.stringify(formData)) ===undefined) {
                let data = state.addresses
                data.push(formData)
                setstate({ ...state, addresses: data, flag1: true,address: '', city: '', pincode: '', states: '', country: ''  })
                addAddressService({ data: data, email })
                    .then(res => {
                        localStorage.setItem("_token", res.data.token);
                    })
              
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Address alredy added!',
                  })
            }

            setShowAddressModal(false)
        }
        else{
            seterrors({ ...errors, errFull: 'Please Enter Data' });

       
        }
    }

    //for editing address
    const editAddress = (ele, index) => {
        setShow(true)
        setstate({ ...state, flag2: true, index: index, address: ele.address, city: ele.city, pincode: ele.pincode, states: ele.states, country: ele.country })

    }

    //for deleting address

    const deleteaddress = (index) => {
        let data = state.addresses
        data.splice(index, 1)

        setstate({ ...state, addresses: data,address: '', city: '', pincode: '', states: '', country: ''  })
        addAddressService({ data: data, email: add.email })
            .then(res => {
                localStorage.setItem("_token", res.data.token);
            })
           
    }
    
    return (
        
        <div>
          {localStorage.getItem('_token')!=undefined? <>
            <h4 className='heading_address'>
            <i className="fa fa-map-marker mr-2 p-1" style={{fontSize:'1.5em'}}></i>
                 Address
            </h4>
            <hr />
            <div className='border' style={{width: "100%" ,maxHeight:'50vh',overflow:'auto'}}>
            {state.addresses.map((ele, index) =>
                <div key={index}>
                    <div className='container'  style={{padding:'1rem',letterSpacing:'1px'}} >
                        <h5>{ele.address}</h5>
                        <h6>{ele.city} - {ele.pincode}</h6>
                        <h6>{ele.states} - {ele.country}</h6>
                        <button className="btn btn-info mt-3" onClick={() => editAddress(ele,index)}>Edit</button> &nbsp;&nbsp;
                        <button className="btn btn-danger mt-3" onClick={() => deleteaddress(index)}>delete</button>&nbsp;&nbsp;&nbsp;
                    </div>
                    <hr />
                </div>
            )}
            </div>
                <button className='btn btn-success mt-4 ' onClick={()=>{setShowAddressModal(true)}}>Add Address</button>
            <>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header >
          <Modal.Title style={{letterSpacing:'1px',fontFamily:'cursive'}}>Edit Address</Modal.Title>
          <IoCloseCircle onClick={handleClose} className="close" style={{ width: "5rem", height: "4rem" }} />
        </Modal.Header>
        <Modal.Body style={{padding:'1.6rem'}}>
        {errors.errFull && <p className='alert alert-danger'>{errors.errFull}</p>}

                Address : <input type="text" className='form-control mt-2' name="address" value={state.address} onChange={handler} />
                        {errors.erraddress && <p className='alert alert-danger'> {errors.erraddress}</p>}
                City : <input type="text" className='form-control mt-2' name="city" value={state.city} onChange={handler} />
                {errors.errcity && <p className='alert alert-danger'> {errors.errcity}</p>}

                Pincode : <input type="text" className='form-control mt-2'name="pincode" value={state.pincode} onChange={handler} />
                {errors.errpincode && <p className='alert alert-danger'> {errors.errpincode}</p>}

                State : <input type="text" className='form-control mt-2' name="states" value={state.states} onChange={handler} />
                {errors.errstates && <p className='alert alert-danger'> {errors.errstates}</p>}

                Country : <input type="text" className='form-control mt-2 mb-2'name="country" value={state.country} onChange={handler} />
                {errors.errcountry && <p className='alert alert-danger'> {errors.errcountry}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => updateAddress()}>
           Update
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showAddressModal} onHide={handleCloseAddresss}>
        <Modal.Header >
          <Modal.Title style={{fontFamily:'monospace'}}>Add Address</Modal.Title>
          <IoCloseCircle onClick={handleCloseAddresss} className="close" style={{ width: "5rem", height: "4rem" }} />
        </Modal.Header>
        <Modal.Body style={{padding:'1.6rem'}}>
        {errors.errFull && <p className='alert alert-danger'>{errors.errFull}</p>}

                Address : <input type="text" className='form-control mt-2' name="address" value={state.address} onChange={handler} />
                        {errors.erraddress && <p className='alert alert-danger'> {errors.erraddress}</p>}
                City : <input type="text" className='form-control mt-2' name="city" value={state.city} onChange={handler} />
                {errors.errcity && <p className='alert alert-danger'> {errors.errcity}</p>}

                Pincode : <input type="text" className='form-control mt-2'name="pincode" value={state.pincode} onChange={handler} />
                {errors.errpincode && <p className='alert alert-danger'> {errors.errpincode}</p>}

                State : <input type="text" className='form-control mt-2' name="states" value={state.states} onChange={handler} />
                {errors.errstates && <p className='alert alert-danger'> {errors.errstates}</p>}

                Country : <input type="text" className='form-control mt-2 mb-2'name="country" value={state.country} onChange={handler} />
                {errors.errcountry && <p className='alert alert-danger'> {errors.errcountry}</p>}
        </Modal.Body>
        <Modal.Footer className='bg-light'>
          <button className='btn btn-primary' onClick={() => addAddress()}>
           Add
          </button>
        </Modal.Footer>
      </Modal>
    </>
    </>:<Navigate to='/login'></Navigate>}
   
        </div>
    )
}