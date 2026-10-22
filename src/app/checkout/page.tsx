"use client";

import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/redux";
import { clearCart } from "@/lib/features/carts/cartsSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store";

export default function CheckoutPage() {
  const { cart, adjustedTotalPrice } = useAppSelector((state: RootState) => state.carts);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({ name: "", phone: "", address: "" });
  const [utr, setUtr] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Agar cart khali hai toh wapas bhej do
  if (!cart || cart.items.length === 0) {
    router.push("/shop");
    return null;
  }

  const total = Math.round(adjustedTotalPrice);

  const handleGenerateQR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill all details");
      return;
    }
    setLoading(true);

    // TESTING KE LIYE DUMMY QR (API bypass)
    setTimeout(() => {
      setQrCode("https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=dummy@upi&pn=ReshamLibas&am=100");
      setLoading(false);
    }, 1000); 
  };

  const handlePlaceOrder = async () => {
    if (!utr || utr.length < 12) {
      alert("Please enter a valid 12-digit UTR/Transaction ID");
      return;
    }

    setLoading(true);
    try {
      // Yahan asli API call jayegi aur Google Sheets mein save hoga
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items: cart.items,
          total,
          utr,
        }),
      });

      if (res.ok) {
        alert("Order placed successfully! We will verify your payment.");
        dispatch(clearCart());
        router.push("/");
      } else {
        alert("Failed to place order. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error placing order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-frame mx-auto px-4 py-10 min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      {!qrCode ? (
        <form onSubmit={handleGenerateQR} className="space-y-4 max-w-md border p-6 rounded-lg">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border p-2 rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full border p-2 rounded"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <textarea
            placeholder="Full Address"
            className="w-full border p-2 rounded"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
          <div className="text-lg font-bold">Total to Pay: ₹{total}</div>
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-2 rounded w-full"
          >
            {loading ? "Generating QR..." : "Proceed to Pay"}
          </button>
        </form>
      ) : (
        <div className="max-w-md space-y-4 text-center border p-6 rounded-lg">
          <p className="font-bold text-lg">Scan to pay ₹{total}</p>
          
          <div className="flex justify-center my-4 bg-white p-2 rounded">
            {/* Dummy QR Image */}
            <img src={qrCode} alt="Payment QR" width={250} height={250} className="w-[250px] h-[250px]" />
          </div>
          
          <p className="text-sm text-gray-600">
            After payment, enter the 12-digit UTR/Transaction ID below.
          </p>
          <input
            type="text"
            placeholder="Enter 12-digit UTR"
            className="w-full border p-2 rounded text-center text-lg"
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            maxLength={12}
          />
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded w-full font-bold"
          >
            {loading ? "Placing Order..." : "Confirm Order"}
          </button>
        </div>
      )}
    </div>
  );
}