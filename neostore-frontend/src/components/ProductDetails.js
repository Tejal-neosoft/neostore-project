import React, { useState, useEffect } from 'react'
import Footer from './Footer';
import Navbaar from './Navbar';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useLocation,useNavigate } from 'react-router-dom';
import ReactStars from 'react-stars';
import { WhatsappShareButton, FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon, WhatsappIcon, EmailShareButton, EmailIcon } from 'react-share';
import { useDispatch} from 'react-redux'
import { FaRupeeSign } from "react-icons/fa";
import Magnifier from "react-magnifier";
import { BsStarFill,BsStarHalf } from 'react-icons/bs';
import { rateProductService,fetchRateProduct } from '../config/MyProductService';
import Swal from 'sweetalert2';
import jwtDecode from 'jwt-decode';





function ProductDetails() {
  const location = useLocation()
  const [index, setIndex] = useState(0)
  const [state, setstate] = useState({})
  const [value, setValue] = useState('1');
  const dispatch = useDispatch();
  const navigate = useNavigate()

useEffect(() => {
   fetchRateProduct({id:location.state._id}).then(res=>{
    setstate(res.data)

  })
}, [])


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  //for rating display

  const rating = (ele) => {
   
    return {
        edit: false,
        color: "rgba(20,20,20,0.1)",
        activeColor: "tomato",
        size: window.innerWidth < 600 ? 20 : 25,
        value: ele.product_rating,
        isHalf: true,
    };
}



//for rating the products
  const rateProduct = {
    size: 20,
    count: 5,
    color: "black",
    activeColor: "red",
    value: 7.5,
    a11y: true,
    isHalf: true,
    emptyIcon: <BsStarFill />,
    halfIcon: <BsStarHalf />,
    filledIcon: <BsStarFill />,
    onChange: newValue => {
        chngeRating(newValue)
    }
};
//adding the changed rating to db
const chngeRating = (value) => {
  if(localStorage.getItem('_token') != undefined){
    let decode = jwtDecode(localStorage.getItem('_token'))
    if(!state.rated_by.includes(decode._id)){
      let l  
      if(state.rated_by != undefined && state.rated_by.length != 0){
           l = state.rated_by.length
  
      }
      else{
           l = 1
      }
        let arr = state.rated_by
        console.log(l,'l');
        console.log((state.product_rating + value)/(l+1),l+1);
        arr.push(decode._id)
        rateProductService({ value: (state.product_rating + value)/(l+1), rated: arr,id:state._id }).then(res =>
          setstate(res.data)
       )
       Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Thankyou for Rating...!!',
        showConfirmButton: false,
        timer: 1500
      })

    }
    else{
        alert("You have already rated..")

    }
}
else{
    navigate('/login')
}





 
  
      
}

  return (
    <>
    
      <Navbaar />
    {state !={} &&
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-6  mt-5">
           
          <div className="col-sm-12 col-md-5 col-lg-5" >
                        <Magnifier src={`./images/${location.state.product_subimages[index]}`} height={350} width={350} className='d-block mx-auto mb-3 shadow' />
                        <div className='d-flex justify-content-evenly'>
                            {location.state.product_subimages.map((val, i) =>
                                <img key={val} src={`./images/${location.state.product_subimages[i]}`} height='100' width='100' onClick={() => setIndex(i)} />
                            )}
                        </div>
                    </div>
           

          </div>
          <div className="col-sm-12 col-md-6 col-lg-6  mt-3">
            <h2 className="mt-5">{state.product_name}</h2>
            <ReactStars {...rating(state)} />
            <hr />
            <div className='mt-4'>
              <h6 >Price: <span  style={{color:'green'}}><FaRupeeSign/>{state.product_cost} /-</span></h6>
              <h6 className='mt-2'>Color:<span className='ml-2' style={{display:'inline-block', background:location.state.color_id.color_code,height:'20px',width:'45px'}}></span>  </h6> 
            </div>
            <div>
              <h5 className="mt-3">Share</h5>
              <div>
                <WhatsappShareButton
                  url="https://github.com/Tejal-neosoft"
                  hashtag="#react">
                  <WhatsappIcon
                    round={true} size='2.5rem'
                  ></WhatsappIcon>
                </WhatsappShareButton>

                <FacebookShareButton
                  url="https://github.com/Tejal-neosoft"
                  hashtag="#react"
                  className='mx-2'>
                  <FacebookIcon
                    round={true} size='2.5rem'
                  ></FacebookIcon>
                </FacebookShareButton>

                <TwitterShareButton
                  url="https://github.com/Tejal-neosoft"
                  hashtag="#react">
                  <TwitterIcon
                    round={true} size='2.5rem'
                  ></TwitterIcon>
                </TwitterShareButton>

                <EmailShareButton
                hashtag="#react"
                                url={"https://github.com/Tejal-neosoft"}>
                                <EmailIcon size={40} round />
                            </EmailShareButton>

                            {/* <PinterestShareButton
                            hashtag="#react"
                                url={"https://github.com/Tejal-neosoft"}>
                                <PinterestIcon size={40} round />
                            </PinterestShareButton> */}

              </div>
              <div className="mt-4">
                <button className="btn btn-info mr-3" onClick={() => dispatch({ type: 'addCart', payload: state })} >Add to Cart</button>
                <button className="btn btn-danger"><ReactStars {...rateProduct}/></button>
              </div>
            </div>
          </div>
        </div>
    
        <div>

          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Description" value="1" />
                <Tab label="Features" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">{state.product_desc}</TabPanel>
            <TabPanel value="2">{state.product_feature}</TabPanel>
          </TabContext>
        </div>
      </div>
}
      <Footer />

    </>
  )
}

export default ProductDetails
