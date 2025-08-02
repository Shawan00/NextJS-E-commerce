import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getOrderById, OrderType } from '@/service/order'
import { CheckCircle, MapPin, Phone, CreditCard, Bike, Plane, Banknote, Palette, User, Truck } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order successfull | FurStore'
}

// Success check icon component
const CheckCircleIcon = ({ className }: { className: string }) => (
  <CheckCircle className={`${className} text-green-500`} />
)

const TruckIcon = ({ className }: { className: string }) => (
  <Truck className={className} />
)

const MapPinIcon = ({ className }: { className: string }) => (
  <MapPin className={className} />
)

const PhoneIcon = ({ className }: { className: string }) => (
  <Phone className={className} />
)

// Delivery and payment options from billingAdress.tsx
const deliveryOptions = [
  { id: "free", value: "free", name: "Free", price: "$0", description: "5-7 days delivery", icon: <Bike className="w-4 h-4" /> },
  { id: "standard", value: "standard", name: "Standard", price: "$10", description: "3-5 days delivery", icon: <Truck className="w-4 h-4" /> },
  { id: "express", value: "express", name: "Express", price: "$20", description: "2-3 days delivery", icon: <Plane className="w-4 h-4" /> }
]

const paymentOptions = [
  { id: "cash", value: "cash", name: "Cash", description: "Pay with cash when your order is delivered.", icon: <Banknote className="w-4 h-4" /> },
  { id: "paypal", value: "paypal", name: "Pay with Paypal", description: "You will be redirected to PayPal website to complete your purchase securely.", icon: <Palette className="w-4 h-4" /> },
  { id: "card", value: "card", name: "Credit / Debit card", description: "We support Mastercard, Visa, Discover and Stripe.", icon: <CreditCard className="w-4 h-4" /> }
]

export default async function OrderSuccess({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;

  const orderData = await getOrderById(Number(orderId))

  if (!orderData) {
    notFound()
  }

  const getDeliveryOption = (method: string) => {
    return deliveryOptions.find(option => option.value === method)
  }

  const getPaymentOption = (method: string) => {
    return paymentOptions.find(option => option.value === method)
  }

  const getStatusDisplay = (status: string) => {
    const statusMap = {
      pending: "Pending",
      processing: "Processing",
      delivering: "Delivering",
      completed: "Completed",
      cancelled: "Cancelled"
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const calculateDiscountedPrice = (price: number, discountPercent: number) => {
    return price * (1 - discountPercent / 100)
  }

  // Calculate total discount amount
  const calculateTotalDiscount = (): number => {
    return orderData.orderProducts.reduce((total: number, orderProduct: OrderType['orderProducts'][0]) => {
      const originalPrice = orderProduct.product.price * orderProduct.quantity
      const discountedPrice = calculateDiscountedPrice(orderProduct.product.price, orderProduct.product.discountPercent) * orderProduct.quantity
      return total + (originalPrice - discountedPrice)
    }, 0)
  }

  const totalDiscount = calculateTotalDiscount()
  const deliveryOption = getDeliveryOption(orderData.deliveryMethod)
  const paymentOption = getPaymentOption(orderData.paymentMethod)

  return (
    <div className="container-custom-lg py-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="check-appear">
              <CheckCircleIcon className="w-16 h-16 text-green-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Order Successful! 🎉
          </h1>
          <p className="text-gray-600">
            Thank you for shopping with us. Your order is being processed.
          </p>
        </div>

        {/* Order Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Order Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-medium text-gray-900">#{orderData.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border bg-orange-100 text-orange-800 border-orange-200">
                  {getStatusDisplay(orderData.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <TruckIcon className="w-5 h-5 mr-2 text-orange-600" />
              Shipping Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-start">
                <User className="w-4 h-4 mt-0.5 mr-2 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="text-gray-900">{orderData.customer.fullName}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPinIcon className="w-4 h-4 mt-0.5 mr-2 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Shipping Address</p>
                  <p className="text-gray-900">{orderData.address}</p>
                </div>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-600">Phone: </span>
                  <span className="text-gray-900">{orderData.phone}</span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-gray-400">{deliveryOption?.icon}</span>
                <div>
                  <span className="text-sm text-gray-600">Delivery Method: </span>
                  <span className="text-gray-900">{deliveryOption?.name} ({deliveryOption?.description})</span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-gray-400">{paymentOption?.icon}</span>
                <div>
                  <span className="text-sm text-gray-600">Payment Method: </span>
                  <span className="text-gray-900">{paymentOption?.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Products */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Ordered Products</h3>
            <div className="space-y-3">
              {orderData.orderProducts.map((orderProduct: OrderType['orderProducts'][0], index: number) => {
                const finalPrice = calculateDiscountedPrice(orderProduct.product.price, orderProduct.product.discountPercent)
                return (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {orderProduct.product.thumbnail ? (
                        <Image
                          src={orderProduct.product.thumbnail}
                          alt={orderProduct.product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">Image</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{orderProduct.product.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {orderProduct.quantity}</p>
                      {orderProduct.product.discountPercent > 0 && (
                        <p className="text-sm text-tertiary">Discount: {orderProduct.product.discountPercent}%</p>
                      )}
                    </div>
                    <div className="text-right">
                      {orderProduct.product.discountPercent > 0 && (
                        <p className="text-sm text-gray-400 line-through">
                          {formatPrice(orderProduct.product.price * orderProduct.quantity)}
                        </p>
                      )}
                      <p className="font-medium text-gray-900">
                        {formatPrice(finalPrice * orderProduct.quantity)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Price Summary */}
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">{formatPrice(orderData.subTotal + totalDiscount)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-tertiary">Discount:</span>
                  <span className="text-tertiary">-{formatPrice(totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping Cost:</span>
                <span className="text-gray-900">{formatPrice(orderData.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span className="text-gray-900">Total:</span>
                <span className="text-accent">{formatPrice(orderData.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Estimated Delivery Info */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <TruckIcon className="w-5 h-5 text-orange-700 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-orange-900">Estimated Delivery Time</h3>
              <p className="text-orange-800 text-sm">
                Your order will be delivered within <strong>{deliveryOption?.description || "3-5 business days"}</strong>
              </p>
              <p className="text-orange-800 text-xs mt-1">
                We will send you a notification when your order is shipped
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/product"
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
          >
            Continue Shopping
          </Link>
          <Link
            href="/me/orders"
            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors font-medium text-center"
          >
            View My Orders
          </Link>
        </div>

        {/* Support Footer */}
        <div className="text-center mt-8 pt-6 border-t">
          <p className="text-gray-600 text-sm">
            Questions about your order? {' '}
            <a href="/contact" className="text-orange-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}