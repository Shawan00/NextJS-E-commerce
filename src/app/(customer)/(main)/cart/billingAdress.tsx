import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BillingAddressType } from "@/schemaValidation/order.shema";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

interface Props {
  onNextStep?: (data: BillingAddressType) => void;
  onPrevStep?: () => void;
}

const deliveryOptions = [
  { id: "free", value: "free", name: "Free", price: "$0", description: "5-7 days delivery", icon: "🚲" },
  { id: "standard", value: "standard", name: "Standard", price: "$10", description: "3-5 days delivery", icon: "🚚" },
  { id: "express", value: "express", name: "Express", price: "$20", description: "2-3 days delivery", icon: "✈️" }
];

const paymentOptions = [
  { id: "cash", value: "cash", name: "Cash", description: "Pay with cash when your order is delivered.", icon: "💵" },
  { id: "paypal", value: "paypal", name: "Pay with Paypal", description: "You will be redirected to PayPal website to complete your purchase securely.", icon: "💙" },
  { id: "card", value: "card", name: "Credit / Debit card", description: "We support Mastercard, Visa, Discover and Stripe.", icon: "💳" }
];

function BillingAndAddress({ onNextStep, onPrevStep }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);  
  // Form state
  const [formData, setFormData] = useState({
    customerId: 0,
    phone: "",
    address: "",
    deliveryMethod: "free" as "free" | "standard" | "express",
    paymentMethod: "cash" as "cash" | "paypal" | "card"
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      const res = await fetch("/api/get-cookie/customer");
      if (res.status === 200) {
        const response = await res.json();
        const customer = JSON.parse(response);
        setFormData(prev => ({
          ...prev,
          customerId: customer.id,
          phone: customer.phone || "",
          address: customer.address || ""
        }));
      } else {
        setIsOpen(true);
      }
    }
    fetchCustomer();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.customerId) return;
    
    const billingData: BillingAddressType = {
      customerId: formData.customerId,
      phone: formData.phone,
      address: formData.address,
      deliveryMethod: formData.deliveryMethod,
      paymentMethod: formData.paymentMethod
    };
    
    onNextStep?.(billingData);
  };

  const isFormValid = formData.phone.length >= 10 && formData.address.trim().length > 0;

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You are not logged in</AlertDialogTitle>
            <AlertDialogDescription>
              Please login to continue
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => router.push("/login")}>Login</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="link"
          onClick={onPrevStep}
          className="mb-6 text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="order-3 lg:order-1">
            <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Enter your full address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Next Step Button */}
            <div className="mt-8">
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3"
              >
                Continue to Confirmation
              </Button>
            </div>
          </div>

          {/* Delivery & Payment */}
          <div className="space-y-8">
            {/* Delivery Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Delivery</h3>
              <div className="space-y-3">
                {deliveryOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.deliveryMethod === option.value
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="delivery"
                        value={option.value}
                        checked={formData.deliveryMethod === option.value}
                        onChange={(e) => handleInputChange("deliveryMethod", e.target.value)}
                        className="w-4 h-4 text-gray-900"
                      />
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{option.icon}</span>
                        <div>
                          <div className="font-medium">{option.name}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      </div>
                    </div>
                    <div className="font-semibold">{option.price}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment</h3>
              <div className="space-y-3">
                {paymentOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.paymentMethod === option.value
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        value={option.value}
                        checked={formData.paymentMethod === option.value}
                        onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                        className="w-4 h-4 text-gray-900 mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{option.name}</div>
                          <span className="text-xl">{option.icon}</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BillingAndAddress;