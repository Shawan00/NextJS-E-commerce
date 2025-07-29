"use client";

import { ProductType } from "@/schemaValidation/product.schema";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addToCart } from "@/store/features/cartSlice";
import { showToast } from "@/helper/toast";
import { Minus, Plus } from "lucide-react";

interface Props {
  product: ProductType
}

function AddToCart({product}: Props) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({
      product,
      quantity
    }));
    showToast('success', `Added ${quantity} product to cart`);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Quantity Selector */}
      <div className="flex items-center border rounded-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDecrease}
          disabled={quantity <= 1}
          className="h-11 w-11 rounded-none border-0 select-none hover:bg-transparent hover:text-primary"
        >
          <Minus />
        </Button>
        <Input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          className="w-16 text-center border-0 rounded-none h-11 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
          min="1"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleIncrease}
          className="h-11 w-11 rounded-none border-0 select-none hover:bg-transparent hover:text-primary"
        >
          <Plus/>
        </Button>
      </div>

      <Button
        onClick={handleAddToCart}
        className="bg-accent text-white px-8 py-3 h-11 hover:bg-white hover:text-accent transition-color duration-300
          border-2 border-accent text-base"
      >
        ADD TO CART
      </Button>
    </div>
  )
}

export default AddToCart