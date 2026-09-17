import React, { useState, useEffect } from "react";
import { Trash2, ShoppingCart, ArrowRight, Percent, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MyCart = () => {
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isApplied, setIsApplied] = useState(false);

  // 🛒 1. Direct LocalStorage se data fetch karo jo 'BuyCourse' se save hua tha
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 🔄 2. State change hone par LocalStorage ko auto-update rakho
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 🗑️ Remove Item Handler (Storage sync logic ke sath)
  const handleRemoveItem = (id, title) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    toast.error(`"${title}" removed from cart!`, { autoClose: 1500 });
  };

  // 🎫 Coupon Code Engine Logic
  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === "EDUPULSE500") {
      setDiscount(500);
      setIsApplied(true);
      toast.success("Coupon applied! ₹500 saved successfully. 🎉");
    } else {
      toast.warning("Invalid Promo Code! Try 'EDUPULSE500'");
    }
  };

  // 💸 Total Prices Calculations (Safely fallback values set)
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item?.price) || 0), 0);
  const totalAmount = subtotal - discount < 0 ? 0 : subtotal - discount;

  // 💳 1. Razorpay Official Script Loader Helper
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 💳 2. Full-Stack Payment Orchestrator Handler
  const handlePaymentCheckout = async () => {
    // A. Script Validation check
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Razorpay SDK load nahi ho paya. Internet connection check karein!");
      return;
    }

    // B. Auth Token Validation check
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Kripya pehle account login karein! 🔐");
      navigate("/login");
      return;
    }

    try {
      toast.info("Transaction initiate ho rahi hai... 💳", { autoClose: 1000 });

      // C. Backend Order API Trigger hit karo
      const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/capturePayment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          courses: cartItems.map((item) => item._id) // Saare items ki IDs array path
        })
      });

      const orderData = await orderResponse.json();
      console.log(orderData);
      if (!orderData.success) {
        toast.error(orderData.message || "Order creation fail ho gaya!");
        return;
      }

      // D. Config object runtime properties populate karo
      const options = {
        key: "rzp_test_uh7PmZIeuY5vXu", // ⚠️ Yahan apni dashboard wali test Key ID daal dena
        amount: orderData.amount,
        currency: orderData.currency,
        name: "EduPulse Platform",
        description: "Thank you for scaling up your skills!",
        order_id: orderData.orderId,
        handler: async function (response) {
          toast.info("Payment authentication verify ho rahi hai...");
          
          // E. Verification API Endpoint callback hit loop
          const verifyResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/verifyPayment`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courses: cartItems.map((item) => item._id)
            })
          });

          const verifyData = await verifyResponse.json();
          console.log(verifyData);
          if (verifyData.success) {
            toast.success("Payment Successful! Course me enroll ho gaye aap 🎉");
            
            // Local states reset mapping
            localStorage.removeItem("cart");
            setCartItems([]);
            
            // Redirect hook call dashboard direction map
            navigate("/studentdashboard/mycourses");
          } else {
            toast.error(verifyData.message || "Payment Verification fail ho gayi!");
          }
        },
        prefill: {
          name: "Student Name",
          email: "student@example.com",
        },
        theme: {
          color: "#4f46e5"
        }
      };

      // F. System checkout object toggle open wrapper
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error("Cart Checkout crash error:", error);
      toast.error("Server connection error during payment initialization!");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">
      
      {/* 1. CART HEADER WIDGET */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <ShoppingCart className="text-indigo-600" size={22} />
            Your Shopping Cart
          </h2>
          <p className="text-xs font-medium text-slate-400">
            Aapne checkout karne ke liye total <span className="text-indigo-600 font-bold">{cartItems.length} items</span> select kiye hain
          </p>
        </div>
      </div>

      {cartItems.length > 0 ? (
        /* 2. MAIN GRID LAYOUT WITH 2 COLUMNS */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: SELECTED ITEMS LIST CONTAINER */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div 
                key={item._id || index}
                className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                {/* Product Detail Thumbnail View */}
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className="h-20 w-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <img 
                      src={item?.thumbnail || "https://via.placeholder.com/150"} 
                      alt={item?.courseName} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide">
                      Mentor: {item?.instructor?.firstName || "Instructor"}
                    </span>
                    <h3 
                      onClick={() => navigate(`/studentdashboard/coursedetails/${item._id}`)}
                      className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 pr-4 hover:text-indigo-600 cursor-pointer transition"
                    >
                      {item?.courseName}
                    </h3>
                  </div>
                </div>

                {/* Pricing & Actions Controller panel */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                  <div className="flex sm:flex-col items-baseline sm:items-end gap-1.5 sm:gap-0">
                    <span className="text-sm font-black text-slate-900">₹{item?.price}</span>
                    {item?.originalPrice && (
                      <span className="text-[11px] font-semibold text-slate-400 line-through">₹{item.originalPrice}</span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleRemoveItem(item._id, item.courseName)}
                    className="sm:mt-3 flex items-center text-slate-400 hover:text-rose-500 font-medium text-xs p-1.5 hover:bg-rose-50 rounded-lg transition duration-150 cursor-pointer"
                  >
                    <Trash2 size={15} className="mr-1" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN: CHECKOUT SUMMARY BOX BLOCK */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-5">
              <h3 className="text-sm font-black text-slate-800 tracking-tight pb-3 border-b border-slate-100">
                Order Summary
              </h3>

              {/* Price Calculations Lists */}
              <div className="space-y-3 text-xs font-bold text-slate-500">
                <div className="flex justify-between">
                  <span>Price ({cartItems.length} items)</span>
                  <span className="text-slate-800">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount</span>
                    <span>- ₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-700">
                  <span>Platform Fees</span>
                  <span className="text-emerald-600 font-black">FREE</span>
                </div>
                
                <div className="h-px bg-slate-100 pt-1" />
                
                <div className="flex justify-between text-sm font-black text-slate-900">
                  <span>Total Payable</span>
                  <span className="text-indigo-600 text-base">₹{totalAmount}</span>
                </div>
              </div>

              {/* PROMO COUPON CODE BLOCK (Fixed Responsive) */}
              <form onSubmit={handleApplyPromo} className="pt-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Apply Coupon (EDUPULSE500)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={isApplied}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold uppercase text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={isApplied || !promoCode}
                    className="w-full sm:w-auto bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer transition shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {isApplied && (
                  <p className="text-[10px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                    <Percent size={10}/> Coupon 'EDUPULSE500' applied successfully!
                  </p>
                )}
              </form>

              {/* CORE MAIN CHECKOUT ACTION TRIGGER BUTTON */}
              <button
                onClick={handlePaymentCheckout}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 active:scale-[0.99] transition cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* TRUST & SECURITY BADGE FOOTER */}
            <div className="flex items-center justify-center gap-2 text-slate-400 text-[11px] font-bold">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>100% Secure SSL Payment Enrolled System</span>
            </div>
          </div>

        </div>
      ) : (
        /* 3. LUXURY MINIMAL EMPTY STATE CONTAINER VIEW */
        <div className="bg-white border border-slate-200/80 p-12 rounded-2xl text-center shadow-sm max-w-sm mx-auto space-y-4">
          <div className="h-14 w-14 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-xl mx-auto">
            🛒
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800">Your Cart is Empty</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Aisa lagta hai aapne abhi tak checkout basket mein koi course select nahi kiya.
            </p>
          </div>
          <button
            onClick={() => navigate("/studentdashboard/buycourse")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl inline-block transition cursor-pointer"
          >
            Explore Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default MyCart;