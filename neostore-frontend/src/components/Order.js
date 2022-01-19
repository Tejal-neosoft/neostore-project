import React, { useEffect, useState } from 'react'
import { orderService } from '../config/MyProductService'
import jwtdecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FaRupeeSign } from "react-icons/fa";


function Order() {
    const [state, setState] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        let token = localStorage.getItem('_token');
        let decode = jwtdecode(token)
        orderService({email:decode.email}).then(res => { //for fetching user orders
            setState(res.data)
        })

    }, [])
   
 
  
    return (
        <>
        <div className='container-justify p-3'>

            <div className='container-justify ' style={{width: "100%" ,maxHeight:'70vh',overflow:'auto'}}>
               {state.length >0 ? 
                <div>
                     {
                    state.map((ele,id) => 
                        <div key={id}>
                        <div className='container mt-3 p-2' >
                            <div>
                            <h4 className='head_order'>Transit Order By:<span className='heading_order'>{ele.card_name}</span></h4>
                            <h6>Placed On {ele.created_at} / <FaRupeeSign/>{ele.subtotal + ele.gst}/-</h6>
                            </div>
                           
                            <div>
                                {ele.totalCart.map((data,ind)=>
                                    <div key={ind} className='d-inline-block' >
                            <img src={`/images/${data.product_image}`} height='100px' width='100px' />
                                    </div>
                                )}
                            </div>
                            <hr />
                            <button className='btn btn-primary' onClick={()=>navigate('/invoice',{state:ele})}>Download Invoice as pdf</button>
                            </div>
                        </div>
                    )
                }
                </div>
                : <h6>No orders to display</h6>}
               



            </div>
            </div>

        </>
    )
}

export default Order
