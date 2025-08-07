import { OrderType } from "@/service/order";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatNumberWithDots } from "@/helper/general";
import { User, ShoppingBag, CreditCard } from "lucide-react";
import { statusConfig, deliveryMethodConfig, paymentMethodConfig } from "@/helper/dataConfig";
import Image from "next/image";

interface Props {
  order: OrderType | null;
  setOrder: (order: OrderType | null) => void;
}

function OrderDetail({ order, setOrder }: Props) {
  if (!order) return null;

  const statusConfigItem = statusConfig[order.status];
  const deliveryConfig = deliveryMethodConfig[order.deliveryMethod];
  const paymentConfig = paymentMethodConfig[order.paymentMethod];
  const IconComponent = statusConfigItem.icon;

  const discount = order.subTotal + order.shippingCost - order.grandTotal;

  return (
    <Dialog open={!!order} onOpenChange={() => setOrder(null)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Order Details #{order.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <IconComponent className="h-5 w-5" />
              <div>
                <Badge className={`${statusConfigItem.color} border`}>
                  {statusConfigItem.label}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">{order.createdAt}</p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{order.customer.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{order.customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{order.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{order.address}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment & Delivery
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <span>{paymentConfig.icon}</span>
                    <span className="font-medium">{paymentConfig.label}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Method</p>
                  <Badge className={`${deliveryConfig.color} text-xs`}>
                    {deliveryConfig.label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Products */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Order Items</h3>
              <Badge variant="outline">
                {order.orderProducts.length} {order.orderProducts.length === 1 ? 'item' : 'items'}
              </Badge>
            </div>
            <div className="space-y-3">
                             {order.orderProducts.map((item, index) => (
                 <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                   <Image
                     src={item.product.thumbnail}
                     alt={item.product.name}
                     width={64}
                     height={64}
                     className="w-16 h-16 object-cover rounded-md"
                   />
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${formatNumberWithDots(item.product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${formatNumberWithDots(order.subTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>${formatNumberWithDots(order.shippingCost)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-tertiary">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Grand Total</span>
                <span className="text-accent">${formatNumberWithDots(order.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OrderDetail;