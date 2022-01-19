import axios from 'axios';
import { MAIN_URL } from './Url';

export function addPost(data){
    return axios.post(`${MAIN_URL}posts/addpost`,data)
}

export function loginpage(data){
    return axios.post(`${MAIN_URL}posts/login`,data)
}
export function forgetService(data){
    return axios.post(`${MAIN_URL}posts/forgetservice`,data)
}
export function resetPassword(data){
    return axios.post(`${MAIN_URL}posts/resetpass`,data)
}
 
export function profileeditService(data){
    return axios.post(`${MAIN_URL}posts/profileeditService`,data)
} 

export function addAddressService(data){
    return axios.post(`${MAIN_URL}posts/addAddressService`,data)
} 
export function changePasswordService(data){
    return axios.post(`${MAIN_URL}posts/changepass`,data)
} 
export function profilePicService(data){
    return axios.post(`${MAIN_URL}posts/profilePicService`,data)
} 
export function emailSubscribeService(data){
    return axios.post(`${MAIN_URL}posts/emailSubscribeService`,data)
} 
export function cartSaveService(data){
    return axios.post(`${MAIN_URL}posts/cartSaveService`,data)
}