import { Button } from "@/components/ui/button";
import { BillingAddressType } from "@/schemaValidation/order.shema";
import { RootState } from "@/store/store";
import { ArrowLeft, CreditCard, Home, Phone, Truck, Loader2 } from "lucide-react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { createOrder } from "@/service/order";
import { useState } from "react";
import { showToast } from "@/helper/toast";

interface Props {
  onPrevStep?: () => void;
  billingAddressData: BillingAddressType;
}

const shippingCost = {
  free: 0,
  standard: 10,
  express: 20,
}

function Confirmation({ onPrevStep, billingAddressData }: Props) {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  const discount = cartItems.reduce((totalDiscount, item) => {
    const discountAmount = item.product.price * (item.product.discountPercent / 100) * item.quantity;
    return totalDiscount + discountAmount;
  }, 0);

  const shipping = shippingCost[billingAddressData.deliveryMethod as keyof typeof shippingCost];

  const total = subtotal - discount + shipping;

  const handleCompleteOrder = async () => {
    setIsLoading(true);

    const prepareData = {
      ...billingAddressData,
      subTotal: subtotal,
      grandTotal: total,
      shippingCost: shipping,
      products: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    }

    const res = await createOrder(prepareData);
    if (res.success) {
      showToast("success", res.message);
      router.push(`/me/order-success/${res.orderId}`);
    } else {
      showToast("error", res.message);
    }
    setIsLoading(false);
  }

  return (
    <div className="container-custom-lg">
      <Button
        variant="link"
        onClick={onPrevStep}
        className="mb-6 text-gray-600 hover:text-gray-900 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back To Billing & Address
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-8 gap-2 md:gap-4 auto-cols-fr">
        <div className="md:col-span-3 flex flex-col gap-2 md:gap-4 order-2 md:order-1">
          <div className="p-2 md:p-4 bg-secondary-background rounded-md flex flex-col gap-2">
            <p className="text-xl font-semibold mb-2">Information</p>
            <p className="flex gap-2 items-end text-muted-foreground"><Home /> {billingAddressData.address}</p>
            <p className="flex gap-2 items-center text-muted-foreground"><Phone />{billingAddressData.phone}</p>
            <p className="flex gap-2 text-muted-foreground capitalize"><Truck /> {billingAddressData.deliveryMethod}</p>
            <p className="flex gap-2 text-muted-foreground capitalize"><CreditCard /> {billingAddressData.paymentMethod}</p>
          </div>
          <div className="p-2 md:p-4 bg-secondary-background rounded-md">
            <p className="text-xl font-semibold mb-2">Order Summary</p>
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
                {shipping === 0 ? <span>Free</span> : <span>${shipping}</span>}
              </div>

              <hr className="my-4 border-primary" />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-orange-500">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Button
            className="w-full py-5 uppercase cursor-pointer"
            onClick={handleCompleteOrder}
            disabled={isLoading || cartItems.length === 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Complete Order"
            )}
          </Button>
        </div>

        <div className="md:col-span-5 bg-muted rounded-md p-2 md:p-4 order-1 md:order-2">
          <p className="text-xl font-semibold mb-4">Order Items</p>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex items-start gap-4 pb-4 border-b border-gray-400 last:border-b-0">
                <div className="relative size-20">
                  <Image
                    src={item.product.thumbnail}
                    alt={item.product.name}
                    fill
                    sizes="100%"
                    className="object-cover rounded-md"
                  />
                  <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/3 bg-primary text-white p-3 rounded-full size-2 text-xs flex items-center justify-center">
                    {item.quantity}
                  </div>
                </div>
                <strong className="text-lg font-medium">{item.product.name}</strong>
                <div className="text-muted-foreground flex-1 flex flex-col self-end items-end">
                  {item.product.discountPercent && <del>${item.product.price}</del>}
                  <span className="font-medium">${item.product.price * (1 - item.product.discountPercent / 100)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;