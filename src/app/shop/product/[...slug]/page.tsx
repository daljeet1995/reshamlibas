import { getProducts } from "@/lib/sheets";
import ProductListSec from "@/components/common/ProductListSec";
import BreadcrumbProduct from "@/components/product-page/BreadcrumbProduct";
import { notFound } from "next/navigation";
import Image from "next/image";
import AddToCartBtn from "./AddToCartBtn"; 

export default async function ProductPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const products = await getProducts();
  const productId = params.slug[0];

  const productData = products.find(
    (product) => String(product.id) === String(productId)
  );

  if (!productData) {
    notFound();
  }

  const relatedProducts = products
    .filter((p) => String(p.id) !== String(productId))
    .slice(0, 4);

  // Description ko 20 words tak seemit karne ka logic
  const words = (productData.description || "Perfect outfit for your wardrobe.").split(" ");
  const shortDescription = words.length > 20 
    ? words.slice(0, 20).join(" ") + "..." 
    : words.join(" ");

  // Discount calculate karne ka logic
  const hasDiscount = productData.discount?.percentage > 0 || productData.discount?.amount > 0;
  const discountedPrice = productData.discount?.percentage > 0
    ? Math.round(productData.price - (productData.price * productData.discount.percentage) / 100)
    : productData.discount?.amount > 0
    ? productData.price - productData.discount.amount
    : productData.price;

  return (
    <main>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        
        <BreadcrumbProduct title={productData.title} />
        
        <section className="mb-11 mt-6">
          <div className="flex flex-col md:flex-row space-y-5 md:space-y-0 md:space-x-10">
            
            {/* IMAGE */}
            <div className="w-full md:w-1/2">
              <div className="bg-[#F0EEED] rounded-[20px] w-full aspect-square relative overflow-hidden">
                {productData.srcUrl ? (
                  <Image
                    src={productData.srcUrl}
                    alt={productData.title || "Product Image"}
                    fill
                    className="object-contain object-center p-4"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
              </div>
            </div>

            {/* DETAILS */}
            <div className="w-full md:w-1/2 flex flex-col space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold text-black uppercase">
                {productData.title}
              </h1>
              
              {/* RATING */}
              <div className="flex items-center space-x-2">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="font-medium text-black">
                  {productData.rating ? productData.rating.toFixed(1) : "0.0"} / 5
                </span>
              </div>

              {/* PRICE & DISCOUNT */}
              <div className="flex items-center space-x-3">
                {hasDiscount ? (
                  <>
                    <span className="text-3xl font-bold text-black">
                      ₹{discountedPrice}
                    </span>
                    <span className="text-xl text-gray-400 line-through">
                      ₹{productData.price}
                    </span>
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold">
                      {productData.discount.percentage > 0 
                        ? `-${productData.discount.percentage}%` 
                        : `-₹${productData.discount.amount}`}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-black">
                    ₹{productData.price}
                  </span>
                )}
              </div>

              {/* DESCRIPTION (20 words) */}
              <p className="text-gray-600">
                {shortDescription}
              </p>

              <hr className="border-t-black/10" />

              {/* ADD TO CART BUTTON */}
              <AddToCartBtn product={productData} />
            </div>
          </div>
        </section>

        {/* DESCRIPTION TAB (Full description) */}
        <div className="w-full border-b border-black/10 mb-6 mt-10">
          <span className="inline-block border-b-2 border-black pb-4 text-base md:text-xl font-medium mr-8">
            Product Details
          </span>
        </div>
        <div className="py-6 text-black/60 text-sm md:text-base mb-10">
          {productData.description || "No description available for this product."}
        </div>
        
      </div>
      
      {/* RELATED PRODUCTS */}
      <div className="mb-[50px] sm:mb-20">
        {/* <ProductListSec title="You might also like" data={relatedProducts} /> */}
      </div>
    </main>
  );
}