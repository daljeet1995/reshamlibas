"use client";

import { useAppDispatch } from "@/lib/hooks/redux";
import { addToCart } from "@/lib/features/carts/cartsSlice";
import { Button } from "@/components/ui/button";

export default function AddToCartBtn({ product }: { product: any }) {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.title,
        srcUrl: product.srcUrl,
        price: product.price,
        discount: product.discount || { percentage: 0, amount: 0 },
        quantity: 1,
        attributes: [],
      })
    );
    alert(`${product.title} added to cart!`);
  };

  return (
    <Button
      onClick={handleAddToCart}
      className="w-full bg-black text-white py-6 rounded-full text-lg font-medium"
    >
      Add to Cart
    </Button>
  );
}