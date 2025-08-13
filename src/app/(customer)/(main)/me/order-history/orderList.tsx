"use client";

import { useState, useEffect } from "react";
import { OrderType } from "@/service/order";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, MapPin, Phone, ShoppingBag, Truck, Banknote, Clock, Package, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import CancelOrderButton from "./CancelOrderButton";
import { statusConfig } from "@/helper/dataConfig";
import { formatDateToString } from "@/helper/general";

interface Props {
  orders: OrderType[]
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

function OrderList({ orders }: Props) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [filteredOrders, setFilteredOrders] = useState<OrderType[]>(orders);

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === activeTab));
    }
  }, [activeTab, orders]);

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const renderOrderCard = (order: OrderType) => {
    const status = getStatusConfig(order.status);
    const StatusIcon = status.icon;
    const totalItems = order.orderProducts.reduce((sum, item) => sum + item.quantity, 0);

    return (
      <Card key={order.id} className="mb-6 overflow-hidden pt-0 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className={`px-6 py-3 ${status.bgColor} border-b-0`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${status.dotColor} animate-pulse`}></div>
              <div className="flex items-center gap-2">
                <StatusIcon className="w-5 h-5" />
                <Badge className={`${status.color} font-medium`}>
                  {status.label}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 font-medium">Order ID</p>
              <p className="font-bold text-lg">#{order.id}</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium">Order Date</p>
                <p className="text-sm font-semibold">{formatDateToString(order.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium">Items</p>
                <p className="text-sm font-semibold">{totalItems} {totalItems > 1 ? "products" : "product"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Truck className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium">Delivery</p>
                <p className="text-sm capitalize">{order.deliveryMethod}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Banknote className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium">Payment</p>
                <p className="text-sm capitalize">{order.paymentMethod}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium">Shipping Address</span>
              </div>
              <p className="text-sm text-gray-600 ml-6 break-words">{order.address}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium">Contact</span>
              </div>
              <p className="text-sm text-gray-600 ml-6">{order.phone}</p>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="products" className="border-0">
              <AccordionTrigger className="hover:no-underline py-3 px-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="font-medium">View Products ({order.orderProducts.length})</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                                 <div className="space-y-4">
                   {order.orderProducts.map((item, index) => (
                     <div key={index} className="flex gap-4 px-4 pb-4 bg-white border-b border-gray-400 last:border-b-0">
                       <Image
                         src={item.product.thumbnail} 
                         alt={item.product.name}
                         width="80"
                         height="80"
                         className="object-cover rounded-sm border shadow-sm flex-shrink-0"
                       />
                       <div className="flex-1 min-w-0">
                         <h4 className="font-semibold text-sm mb-1 line-clamp-2">{item.product.name}</h4>
                         <p className="text-xs text-gray-500 mb-2">SKU: {item.product.sku}</p>
                         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                           <div className="flex items-center gap-4">
                             <span className="text-sm font-medium">Qty: {item.quantity}</span>
                             {item.product.discountPercent > 0 && (
                               <Badge variant="secondary" className="text-xs">
                                 {item.product.discountPercent}% OFF
                               </Badge>
                             )}
                           </div>
                           <span className="font-semibold text-sm">
                             {formatPrice(item.product.price * (1 - item.product.discountPercent / 100))}
                           </span>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator className="my-6" />

          {/* Order Summary */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Subtotal</span>
              <span className="text-sm">{formatPrice(order.subTotal)}</span>
            </div>
            <div className="flex justify-between items-center text-tertiary">
              <span className="text-sm font-medium">Discount</span>
              <span className="text-sm">-{formatPrice(order.shippingCost + order.subTotal - order.grandTotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Shipping</span>
              <span className="text-sm">{formatPrice(order.shippingCost)}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-semibold text-lg text-green-600">{formatPrice(order.grandTotal)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          {order.status === "pending" && (
            <div className="mt-6 pt-6 border-t">
              <CancelOrderButton 
                orderId={order.id}
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto mb-8">
          <TabsList className="w-full h-12 min-w-[690px] grid grid-cols-6">
            <TabsTrigger value="all" className="text-sm font-medium whitespace-nowrap">
              All ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-sm font-medium whitespace-nowrap">
              Pending ({orders.filter(o => o.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="processing" className="text-sm font-medium whitespace-nowrap">
              Processing ({orders.filter(o => o.status === "processing").length})
            </TabsTrigger>
            <TabsTrigger value="delivering" className="text-sm font-medium whitespace-nowrap">
              In Transit ({orders.filter(o => o.status === "delivering").length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-sm font-medium whitespace-nowrap">
              Delivered ({orders.filter(o => o.status === "completed").length})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="text-sm font-medium whitespace-nowrap">
              Cancelled ({orders.filter(o => o.status === "cancelled").length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(renderOrderCard)
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-16 text-center">
                <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Yet</h3>
                <p className="text-gray-500">Start shopping to see your order history here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(renderOrderCard)
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-16 text-center">
                <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pending Orders</h3>
                <p className="text-gray-500">All your orders have been processed</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(renderOrderCard)
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-16 text-center">
                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Processing Orders</h3>
                <p className="text-gray-500">No orders are currently being processed</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="delivering" className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(renderOrderCard)
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-16 text-center">
                <Truck className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders in Transit</h3>
                <p className="text-gray-500">No orders are currently being delivered</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(renderOrderCard)
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-16 text-center">
                <CheckCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Delivered Orders</h3>
                <p className="text-gray-500">No orders have been delivered yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(renderOrderCard)
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-16 text-center">
                <XCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Cancelled Orders</h3>
                <p className="text-gray-500">No orders have been cancelled</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default OrderList;