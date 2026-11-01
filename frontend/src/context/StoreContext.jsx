import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";
import { authApi, cartApi, orderApi, userApi, couponApi, reviewApi } from "../services/api";

export const StoreContext=createContext(null);

const StoreContextProvider=(props)=>{

    // ---- Toast notifications (new) -----------------------------------------
    const [toast,setToast]=useState(null); // { message, type: "success"|"error" }
    const showToast=(message, type="success")=>{
        setToast({message, type});
        setTimeout(()=>setToast(null), 2200);
    }

    const [cartItems,setCartItems]=useState({});

    // ---- Auth (new) ----------------------------------------------------
    // Logged-in users get a real Spring Boot + MySQL account and their cart /
    // orders are persisted server-side. Guests keep the exact original
    // local-only behaviour above, so nothing that worked before changes.
    // Uses sessionStorage (not localStorage) on purpose: closing the browser/tab
    // clears it, so you're logged out and have to log in again next time —
    // this also means a stale/expired token never lingers for days.
    const [token,setToken]=useState(sessionStorage.getItem("token") || "");
    const [userName,setUserName]=useState(sessionStorage.getItem("userName") || "");
    const [role,setRole]=useState(sessionStorage.getItem("role") || "");
    const isAdmin = role === "ADMIN";

    // ---- Dark mode (new) --------------------------------------------------
    const [darkMode,setDarkMode]=useState(localStorage.getItem("darkMode")==="true");
    const toggleDarkMode=()=>{
        setDarkMode((prev)=>{
            const next=!prev;
            localStorage.setItem("darkMode", String(next));
            return next;
        });
    }
    useEffect(()=>{
        document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
    },[darkMode]);

    // ---- Coupons (new) -----------------------------------------------------
    const [appliedCoupon,setAppliedCoupon]=useState(null); // { code, discountAmount, newTotal }
    const [couponError,setCouponError]=useState("");

    const applyCoupon=async(code)=>{
        setCouponError("");
        if(!token){
            setCouponError("Please login to use a coupon");
            return;
        }
        try{
            const data = await couponApi.apply(token, code);
            setAppliedCoupon(data);
            showToast(`"${data.code}" applied — you saved $${data.discountAmount.toFixed(2)}!`);
            return data;
        }catch(err){
            setCouponError(err.message || "Invalid coupon");
            setAppliedCoupon(null);
        }
    }

    const clearCoupon=()=>{
        setAppliedCoupon(null);
        setCouponError("");
    }

    // ---- Ratings (new) ------------------------------------------------------
    // { [foodItemId]: { average, count } } — fetched once, shown on food cards.
    const [foodRatings,setFoodRatings]=useState({});

    const refreshRatings=()=>{
        reviewApi.summary().then((summary)=>{
            setFoodRatings(summary || {});
        }).catch(()=>{});
    }

    useEffect(()=>{
        refreshRatings();
    },[]);

    const addReview=(foodItemId,rating,comment)=>{
        if(!token){
            return Promise.reject(new Error("Please login to leave a review"));
        }
        return reviewApi.add(token,foodItemId,rating,comment).then((res)=>{
            refreshRatings();
            return res;
        });
    }

    // ---- Favorites (new) -------------------------------------------------
    const [favoriteItems,setFavoriteItems]=useState(()=>{
        try{
            return JSON.parse(localStorage.getItem("favoriteItems")) || {};
        }catch(e){
            return {};
        }
    });

    // ---- Search (new) ----------------------------------------------------
    const [searchTerm,setSearchTerm]=useState("");

    const addToCart=(itemId)=>{
         if(!cartItems[itemId]){
           setCartItems((prev)=>({...prev,[itemId]:1}))
         }
         else{
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
         }
         showToast("Added to cart");
         // Best-effort sync to the backend cart when logged in. Ignored
         // silently if the backend isn't running, so the local cart above
         // (which is what the UI actually renders) always keeps working.
         if(token){
            cartApi.add(token, Number(itemId)).catch(()=>{});
         }
    }


    const removeFromCart=(itemId)=>{
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}))
        if(token){
            cartApi.remove(token, Number(itemId)).catch(()=>{});
        }
    }

   const getTotalCartAmount=()=>{
    let totalAmount=0;
    for(const item in cartItems){
        if(cartItems[item]>0){
       let itemInfo=food_list.find((product)=>product._id===item);
       totalAmount+=itemInfo.price*cartItems[item];
        }
    }
    return totalAmount;
   }

    // ---- Auth actions (new) ----------------------------------------------
    const login=async(email,password)=>{
        const data = await authApi.login(email,password);
        setToken(data.token);
        setUserName(data.name);
        setRole(data.role || "");
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userName", data.name);
        sessionStorage.setItem("role", data.role || "");
        showToast(`Welcome back, ${data.name}!`);
        return data;
    }

    const register=async(name,email,password)=>{
        const data = await authApi.register(name,email,password);
        setToken(data.token);
        setUserName(data.name);
        setRole(data.role || "");
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userName", data.name);
        sessionStorage.setItem("role", data.role || "");
        showToast(`Account created — welcome, ${data.name}!`);
        return data;
    }

    const logout=(silent)=>{
        setToken("");
        setUserName("");
        setRole("");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userName");
        sessionStorage.removeItem("role");
        setCartItems({});
        clearCoupon();
        if(!silent) showToast("Logged out");
    }

    // If the backend ever rejects the current token (expired/invalid — a 401/403
    // on a request that included it), log the user out and say why, instead of
    // leaving them stuck with a confusing error on every action.
    useEffect(()=>{
        const onAuthExpired=()=>{
            if(token){
                logout(true);
                showToast("Your session expired — please log in again.", "error");
            }
        };
        window.addEventListener("auth:expired", onAuthExpired);
        return ()=>window.removeEventListener("auth:expired", onAuthExpired);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[token]);

    // Pull the logged-in user's saved cart from the backend once, on login/refresh.
    useEffect(()=>{
        if(token){
            cartApi.get(token).then((backendCart)=>{
                const merged={};
                Object.entries(backendCart || {}).forEach(([foodItemId,qty])=>{
                    merged[String(foodItemId)] = qty;
                });
                if(Object.keys(merged).length){
                    setCartItems((prev)=>({...merged,...prev}));
                }
            }).catch(()=>{});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[token]);

    // ---- Order actions (new) ----------------------------------------------
    const placeOrder=(addressData)=>{
        if(!token){
            return Promise.reject(new Error("Please login to place an order"));
        }
        const payload={
            ...addressData,
            couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        };
        return orderApi.place(token, payload).then((order)=>{
            clearCoupon();
            refreshRatings();
            return order;
        });
    }

    const fetchMyOrders=()=>{
        if(!token){
            return Promise.resolve([]);
        }
        return orderApi.myOrders(token);
    }

    // ---- Profile actions (new) ---------------------------------------------
    const getProfile=()=>{
        if(!token){
            return Promise.reject(new Error("Please login to view your profile"));
        }
        return userApi.getProfile(token);
    }

    const updateProfile=(profile)=>{
        if(!token){
            return Promise.reject(new Error("Please login to update your profile"));
        }
        return userApi.updateProfile(token, profile).then((updated)=>{
            // keep the navbar/greeting name in sync if it was changed
            setUserName(updated.name);
            sessionStorage.setItem("userName", updated.name);
            return updated;
        });
    }

    // ---- Favorites actions (new) -------------------------------------------
    const isFavorite=(itemId)=> !!favoriteItems[itemId];

    const toggleFavorite=(itemId)=>{
        setFavoriteItems((prev)=>{
            const next={...prev};
            const wasFavorite = !!next[itemId];
            if(wasFavorite) delete next[itemId];
            else next[itemId]=true;
            localStorage.setItem("favoriteItems", JSON.stringify(next));
            showToast(wasFavorite ? "Removed from favorites" : "Added to favorites");
            return next;
        });
    }

    const contextValue={
       food_list,
       cartItems,
       setCartItems,
       addToCart,
       removeFromCart,
       getTotalCartAmount,
       // auth
       token,
       userName,
       role,
       isAdmin,
       login,
       register,
       logout,
       // orders
       placeOrder,
       fetchMyOrders,
       // profile
       getProfile,
       updateProfile,
       // favorites
       favoriteItems,
       isFavorite,
       toggleFavorite,
       // search
       searchTerm,
       setSearchTerm,
       // dark mode
       darkMode,
       toggleDarkMode,
       // coupons
       appliedCoupon,
       couponError,
       applyCoupon,
       clearCoupon,
       // ratings
       foodRatings,
       refreshRatings,
       addReview,
       // toast
       toast,
       showToast,
    }


        return (
            <StoreContext.Provider value={contextValue}>
            {props.children}
            </StoreContext.Provider>
        )
    
}
export default StoreContextProvider;