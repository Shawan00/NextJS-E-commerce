"use client";

import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { updateCartItemQuantity, removeFromCart } from "@/store/features/cartSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Props {
  onNextStep?: () => void;
}

function CartItems({ onNextStep }: Props) {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();
  
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  const discount = cartItems.reduce((totalDiscount, item) => {
    const discountAmount = item.product.price * (item.product.discountPercent / 100) * item.quantity;
    return totalDiscount + discountAmount;
  }, 0);
  
  const shipping = 0;
  const total = subtotal - discount + shipping;

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateCartItemQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart({ productId }));
  };

  const handleNextStep = () => {
    // Save cart data or perform any necessary operations
    if (onNextStep) {
      onNextStep();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-semibold mb-6">
          Cart ({cartItems.length} {cartItems.length > 1 ? "items" : "item"})
        </h2>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 pb-4 border-b text-sm font-medium text-gray-500">
          <div className="col-span-5">Product</div>
          <div className="col-span-2">Price</div>
          <div className="col-span-3">Quantity</div>
          <div className="col-span-2">Total price</div>
        </div>

        {/* Cart Items */}
        <div className="space-y-4">
          {cartItems.map((item) => {
            const originalPrice = item.product.price;
            const itemTotal = originalPrice * item.quantity;

            return (
              <div key={item.product.id} className="grid grid-cols-12 gap-4 py-4 border-b">
                {/* Product Info */}
                <div className="col-span-5 flex items-center space-x-4">
                  <Image
                    src={item.product.thumbnail}
                    alt={item.product.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded-lg"
                    priority={false}
                  />
                  <Link href={`/product/${item.product.id}`} 
                    className="font-medium"
                  >
                    {item.product.name}
                  </Link>
                </div>

                {/* Price */}
                <div className="col-span-2 flex items-center">
                  <span className="font-medium">${originalPrice.toFixed(2)}</span>
                </div>

                {/* Quantity Controls */}
                <div className="col-span-3 flex flex-col justify-center items-start">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="h-8 w-8 rounded-none border-0 hover:bg-transparent hover:text-primary"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value) || 1)}
                      className="w-10 text-center border-0 rounded-none h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield] focus-visible:ring-0 focus-visible:border-0"
                      min="1"
                      max={item.product.stock}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                      className="h-8 w-8 rounded-none border-0 hover:bg-transparent hover:text-primary"
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="ml-2 text-sm text-gray-500">
                    available: {item.product.stock}
                  </div>
                </div>

                {/* Total Price */}
                <div className="col-span-1 flex items-center">
                  <span className="font-medium">${itemTotal.toFixed(2)}</span>
                </div>

                {/* Delete Button */}
                <div className="col-span-1 flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.product.id)}
                    className="text-tertiary hover:text-red-500 hover:bg-transparent cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Shopping */}
        <div className="mt-6">
          <Link href="/">
            <Button variant="link">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue shopping
            </Button>
          </Link>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-6">Order summary</h3>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-tertiary">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              {shipping === 0 ? <span>Calculated at checkout</span> : <span>${shipping}</span>}
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-orange-500">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="mt-6">
            <Button 
              onClick={handleNextStep}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3"
            >
              Next step
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItems;