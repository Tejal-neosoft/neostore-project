import React, {useEffect, useState} from 'react'
import { Modal, Card } from 'react-bootstrap'
import { profileeditService,profilePicService } from '../config/Myservice'
import { IoCloseCircle } from "react-icons/io5";
import jwtdecode from 'jwt-decode';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux'

const regForEmail = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
const regForName = RegExp(/^[A-Za-z]{3,30}$/);
const regForContact = RegExp(/^[6-9][0-9]{9}/);
export default function Profile() {
    const [state, setstate] = useState({data:{},firstname:'',lastname:'',gender:'',contact:'',email:'',profileImg:''})
    const navigate = useNavigate()
    const [show, setShow] = useState({flag:false,count:1});
    const [errors, seterrors] = useState({ errfirstname: "", errlastname: "",  errcontact: "", erremail: "",});

    const dispatch = useDispatch();

    const handleClose = () => setShow({...show,flag:false});
   
  
    useEffect(()=>{
        if(localStorage.getItem('_token')!== undefined){
            let token = localStorage.getItem('_token');
            let decode = jwtdecode(token)
            setstate({data:decode,firstname:decode.firstname,lastname:decode.lastname,gender:decode.gender,contact:decode.contact,email:decode.email,profileImg:decode.profilepic})
        }

       },[show.count])

    const edit = () => {
        setShow({...show,flag:true})
    }
    
    const updateProfile = () =>{
        let formData = {
            firstname:state.firstname,
            lastname:state.lastname,
            gender:state.gender,
            contact:state.contact,
            email:state.email,
            originalEmail:state.data.email
        }
        profileeditService(formData)
        .then(res =>{
            dispatch({type: "updateProfile", payload: state.firstname + " "+ state.lastname})
         localStorage.setItem("_token",res.data.token);
         setstate({...state,data:res.data.values})
         
       })
       setShow({flag:false,count:show.count+1})
     

       
    }
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
          }
        setstate({ ...state, [name]: value })
    }
    const filechange = (e) => {
        const formData = new FormData()
        formData.append('profileImg', state.profileImg)
        formData.append('email', state.data.email)
        profilePicService(formData)
        .then((res) => {
          dispatch({type: "updatePicture", payload: res.data.values.profilepic})
          localStorage.setItem("_token", res.data.token);
          setstate({ ...state, data: res.data.values });
        });
        setShow({ flag: false });
      }

    return (
        <div>
            { localStorage.getItem('_token') != undefined ?
            <>
            <h4><i className="fa fa-id-badge mr-2 p-1"  style={{fontSize:'1.1em',letterSpacing:'1px'}}></i>Profile</h4>
            <hr/>
            <div className='container p-4'>

            <table>
                <tbody>
                    <tr>
                        <td>
                            <h6 className="mt-2">
                                First Name 
                            </h6>
                        </td>
                        <td>
                            <h6 className="entry_data mt-2">
                                {state.data.firstname}
                            </h6>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h6 className="mt-2">
                                Last Name 
                            </h6>
                        </td>
                        <td>
                            <h6 className="entry_data mt-2">
                                {state.data.lastname}
                            </h6>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h6 className="mt-2">
                                Gender 
                            </h6>
                        </td>
                        <td>
                            <h6 className="entry_data  mt-2">
                                {state.data.gender}
                            </h6>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h6 className="mt-2">
                                Contact
                            </h6>
                        </td>
                        <td>
                            <h6 className="entry_data mt-2">
                                {state.data.contact}
                            </h6>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h6 className="mt-2">
                                Email 
                            </h6>
                        </td>
                        <td>
                            <h6 className="entry_data mt-2">
                                {state.data.email}
                            </h6>
                        </td>
                    </tr>

                    </tbody>
                </table>
                </div>
                <hr/>
                <button className='btn btn-primary ' onClick={() =>edit()}>Edit</button>
                

      <Modal show={show.flag} onHide={handleClose} style={{padding:'3rem',letterSpacing:'1px'}} size='md'  >
        <Modal.Header >
          <Modal.Title style={{fontStyle:'italic',letterSpacing:'1px'}}>Edit Profile</Modal.Title>
          <IoCloseCircle onClick={handleClose} className="close" style={{ width: "5rem", height: "4rem" ,color:'darkred'}} />
        </Modal.Header>
        <Modal.Body style={{padding:'2rem'}}>
       
                <Card.Text>
                    First Name : <input type="text" className='form-control' name="firstname" value={state.firstname} onChange={handler}/>
                    {errors.errfirstname && <p className='alert alert-danger'>{errors.errfirstname}</p>}
                </Card.Text>
           
                <Card.Text>
                 Last Name : <input type="text" className='form-control' name="lastname" value={state.lastname} onChange={handler}/>
                 {errors.errlastname && <p className='alert alert-danger'>{errors.errlastname}</p>}

                </Card.Text>

                <Card.Text>
                Gender : &nbsp;
                 <input type="radio" id="male" name="gender"   value="male" onClick={handler}/> <span className='mr-3'> Male</span> 
                 <input type="radio" id="female" name="gender"  value="female" onClick={handler}/> <span className='mr-3'> Female</span>
                </Card.Text> 
             

              
            
                <Card.Text>
                Mobile Number : <input type="text"name="contact" className='form-control' value={state.contact} onChange={handler}/>
                {errors.errcontact && <p className='alert alert-danger'>{errors.errcontact}</p>}

               </Card.Text>
                

               
                <Card.Text>
                 Email : <input type="text" name="email" className='form-control' value={state.email} onChange={handler}/>
                 {errors.erremail && <p className='alert alert-danger'>{errors.erremail}</p>}

                </Card.Text>
              

              

        <Modal.Footer>
         
          <button className='btn btn-primary' onClick={() => updateProfile()}>
            Save Changes
          </button>
        </Modal.Footer>

        <Card.Text>
            Profile Picture :{" "}
            <input type="file" className='form-control' onChange={(e) => setstate({...state, profileImg:e.target.files[0]})} name="profilepic"/>
          </Card.Text>

        </Modal.Body>

        <Modal.Footer style={{backgroundColor:"whitesmoke"}}>
          <button className="btn btn-info" variant="primary" onClick={() => filechange()}>
            Update Profile Picture
          </button>
        </Modal.Footer>
      </Modal>
      </>
      :
      <Navigate to='/login'></Navigate>
      }
        </div>
    )
}