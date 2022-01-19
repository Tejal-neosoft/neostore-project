import React,{useEffect,useState} from 'react'
import {useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Navbaar from './Navbar';
import { FaRupeeSign } from "react-icons/fa";
import { AiTwotoneDelete } from "react-icons/ai";
import { useDispatch } from 'react-redux'


function Cart() {
    const [state,setState] = useState([])
    const [count,setCount] = useState(0)
    const [subTotalState,setSubTotalState] = useState({subTotal:0,gst:0,grandTotal:0})
    const cartId = useSelector(state => state.cartData)
    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem('cart') != undefined) {
            let data = [...JSON.parse(localStorage.getItem('cart'))]   
                setState([...data])
                totalCount(data)
        }
        
    }, [cartId.count,count])

    const countUp = (id) =>{
        let data = state
        data[id].quantity+=1;
        localStorage.setItem('cart',JSON.stringify(data))
        setCount(count+1)
        
    }
    const countDown = (id) =>{
        let data = state
        if(data[id].quantity>1)
       { 
        data[id].quantity-=1;
        localStorage.setItem('cart',JSON.stringify(data))
        setCount(count+1)
}
else{
    dispatch({ type: "deleteCart", payload:id})

}
    }

    const totalCount = (data) =>{
        let totalValue = 0;
        data.forEach(ele=> {
            totalValue = totalValue+(ele.quantity*ele.product_cost)
        })
        let gst = (totalValue * 5)/100;
        setSubTotalState({subTotal:totalValue,gst:gst,grandTotal:totalValue+gst})
    }
    const proceed = ()=>{
        navigate("/checkout", { state: {subTotalState:subTotalState,cart:state} })
    }
    return (
        <>
        <Navbaar/>
        <div className='container-justify'>
            {state.length >0 ?<>
            <div className='row mt-5 ml-3 mr-3'>
                <div className='col-lg-9 '>
                    <div className='container m-2 p-3'style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', backgroundColor: 'white' }}>
                        <nav>
                        <div className="container-fluid">
                                <form className="d-flex justify-content-between mt-3">
                                <h3 className="text-left  d-inline" style={{letterSpacing:'1px',fontFamily:'Arial, Helvetica, sans-serif'}}>Shopping Cart</h3>

                                    <h4 className="justify-items-end">{state.length} items</h4>
                                </form>
                            </div>
                            </nav>
                  <div style={{width: "100%" ,maxHeight:'50vh',overflow:'auto'}}>
                        <table className='table mt-4 table-hover' >
                            <thead className='text-dark'>
                                <tr>
                                    <th>Products</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody >
                              
                                {state.map((data,index)=>
                                   <tr key={index}>
                                      <td><img src={`images/${data.product_image}`} height='50px' width='50px' className='mr-1'/>{data.product_name}</td> 

                                      <td><button className='btn btn-outline-danger mr-1'  onClick={()=>countDown(index)}> - </button> {data.quantity} <button className='btn btn-outline-danger ml-1' onClick={()=>countUp(index)}>+</button></td> 

                                      <td><FaRupeeSign/>{data.product_cost} /-</td> 
                                      <td>{data.quantity * data.product_cost}</td> 
                                      
                                      <td><button className='btn btn-danger' 
                                      onClick={()=>dispatch({ type: "deleteCart", payload:index})}><AiTwotoneDelete/></button></td> 
                                   </tr>
                                    
                                    
                                    )}
                               
                            </tbody>

                        </table>

                  </div>


                    </div>

                </div>
                <div className='col-lg-3 '>
                    <div className='container m-2 mt-4'style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', backgroundColor: 'white' }}>
                        <h4 className='mx-3 py-4'>Review Order</h4>
                        <table className='table'>
                            <tbody>
                                <tr>
                                    <td>Subtotal</td>
                                    <td>{subTotalState.subTotal}</td>
                                </tr>
                                <tr>
                                    <td>GST (5%)</td>
                                    <td>{subTotalState.gst}</td>
                                </tr> 
                                <tr>
                                    <td>Order Total</td>
                                    <td>{subTotalState.grandTotal}</td>
                                </tr>
                                <tr>
                                    {
                                        localStorage.getItem('_token')!=undefined?
                                    
                                    <td colSpan='2'> <button className='w-100 mt-2 btn btn-primary' onClick={() =>proceed()} >Proceed</button></td>:<td colSpan='2'> <button className='w-100 mt-4 btn btn-primary' onClick={() =>navigate('/login')} >Proceed</button></td>}
                                   
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>

            </div>
            </>:
            <div className='container-fluid'>
                <div className='text-center mt-5'> 
                    <img src='https://shop.myfelt-europe.com/skin/frontend/rwd/myfelt-2018/images/cart-noitem-mobile.gif' alt="empty" className='m-0' width='50%'/>
                </div>
            <h5 className='mt-5 text-center mb-5'>No Products to display in cart
                </h5>
                </div>
                }

          </div>  
        <Footer/>
            
        </>
    )
}

export default Cart
