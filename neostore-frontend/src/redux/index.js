import { combineReducers, createStore } from "redux";

let initialstate = { name: "", profile: "" ,search:""}

//for profile editing
export const profileReducer = (state = initialstate, action) => {

    switch (action.type) {
        case "updateProfile":
            return {name:action.payload, profile:state.profile ,search:state.search};

        case "updatePicture":
            return {profile:action.payload, name:state.name, search:state.search};

        case "searchRedux":
            return {search:action.payload, name:state.name, profile:state.profile};
        default: return state;
    }
       
}

let c = 0;
if (localStorage.getItem('cart') != undefined) {
    c = JSON.parse(localStorage.getItem('cart')).length
}
let initial = { data: [], count: c }

//for cart 
export const cartData = (state = initial, action) => {
    switch (action.type) {
        case "addCart":
            if (localStorage.getItem('cart') != undefined) {
               
                let cart = JSON.parse(localStorage.getItem('cart'))
                if (!cart.find(ele=>ele._id===action.payload._id)) {
                    localStorage.setItem('cart', JSON.stringify([...cart, {...action.payload,quantity:1}]))
                    return { data:[...cart, {...action.payload,quantity:1}], count: cart.length + 1 };
                }
                else{
                    alert("Product Alredy added")
                }
            }
            
            else {
               
                let arr = []
                arr.push({...action.payload,quantity:1})
                localStorage.setItem('cart', JSON.stringify(arr))
                return { data: [arr], count: 1 };
            }
            break;
        case "deleteCart":
            let cartValues = JSON.parse(localStorage.getItem('cart'))
            cartValues.splice(action.payload, 1)
            localStorage.setItem("cart", JSON.stringify([...cartValues]));
            
            return { data: [...cartValues], count: cartValues.length }

        case 'emptyCart':
            return { data: [], count: 0}

         case 'onLogin':
            let cart1 = JSON.parse(localStorage.getItem('cart'))
            return { data:cart1 , count: cart1.length }


        default: return state;

    }
}

const rootReducer = combineReducers({ profileReducer, cartData });

const store = createStore(rootReducer);

export default store;