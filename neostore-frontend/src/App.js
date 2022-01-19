import React,{Suspense} from 'react';
import './App.css';
import {BrowserRouter as Router , Route,Routes} from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary'

const Login = React.lazy(() => import('./components/Login'));
const Register = React.lazy(() => import('./components/Register'));
const Home = React.lazy(() => import('./components/Home'));
const Profile = React.lazy(()=>import('./components/Profile'));
const ForgetPassword = React.lazy(() => import('./components/ForgetPassword'));
const Address = React.lazy(() => import('./components/Address'));
const Account = React.lazy(() => import('./components/Account'));
const Order = React.lazy(() => import('./components/Order'));
const ChangePassword = React.lazy(() => import('./components/ChangePassword'));
const Products = React.lazy(() => import('./components/Products'));
const ProductDetails = React.lazy(() => import('./components/ProductDetails'));
const Cart = React.lazy(() => import('./components/Cart'));
const Checkout = React.lazy(() => import('./components/Checkout'));
const Invoice = React.lazy(() => import('./components/Invoice'));

function App() {
  return (
    <div className="App">
      
  <Router>
       <ErrorBoundary>
     <Suspense fallback={<div className='text-center mt-5' >
       <img src="https://c.tenor.com/ZgIRCUMksogAAAAM/sing-crayon-shin-chan.gif" alt='loading..' height='300px'/></div>}>
     <Routes>
       <Route path='/login' element={<Login/>} />
       <Route path='/register' element={<Register/>} />
       <Route path='/' element={<Home/>} />
       <Route path='/forgetpassword' element={<ForgetPassword/>} />
       <Route path='/product' element={<Products/>} />
       <Route path='/productdetails' element={<ProductDetails/>} />
       <Route path='/cart' element={<Cart/>} />
       <Route path='/checkout' element={<Checkout/>} />
       <Route path='/invoice' element={<Invoice/>} />

       {/* Nested Routing */}

       <Route path='/account' element={<Account/>} >{ /* Parent component*/}
       <Route path='profile' element={<Profile/>} />{ /* Child component*/}
       <Route path='address' element={<Address/>} />{ /* Child component*/}
       <Route path='order' element={<Order/>} />{ /* Child component*/}
       <Route path='changepassword' element={<ChangePassword/>} />{ /* Child component*/}

       </Route>
       
     <Route path="*" element={<img src="https://freefrontend.com/assets/img/html-funny-404-pages/CodePen-404-Page.gif" alt="..." className="images"></img>}></Route>

     </Routes>

  </Suspense>
  </ErrorBoundary>
  </Router>
    </div>
  );
}

export default App;
