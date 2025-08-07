import { Package, Truck, CheckCircle, XCircle, Clock, Bike, Plane, Banknote, Palette, CreditCard } from "lucide-react";

export const statusConfig = {
  pending: {
    label: "Pending",
    variant: "secondary" as const,
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    bgColor: "bg-gradient-to-r from-amber-50 to-orange-50",
    dotColor: "bg-amber-500"
  },
  processing: {
    label: "Processing",
    variant: "default" as const,
    icon: Package,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    bgColor: "bg-gradient-to-r from-blue-50 to-indigo-50",
    dotColor: "bg-blue-500"
  },
  delivering: {
    label: "Delivering",
    variant: "default" as const,
    icon: Truck,
    color: "bg-purple-100 text-purple-800 border-purple-200",
    bgColor: "bg-gradient-to-r from-purple-50 to-violet-50",
    dotColor: "bg-purple-500"
  },
  completed: {
    label: "Completed",
    variant: "default" as const,
    icon: CheckCircle,
    color: "bg-green-100 text-green-800 border-green-200",
    bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
    dotColor: "bg-green-500"
  },
  cancelled: {
    label: "Cancelled",
    variant: "destructive" as const,
    icon: XCircle,
    color: "bg-red-100 text-red-800 border-red-200",
    bgColor: "bg-gradient-to-r from-red-50 to-rose-50",
    dotColor: "bg-red-500"
  },
};

export const deliveryMethodConfig = {
  standard: {
    label: "Standard",
    color: "bg-gray-100 text-gray-800",
    price: "$10",
    description: "3-5 days delivery",
    icon: Truck
  },
  express: {
    label: "Express",
    color: "bg-orange-100 text-orange-800",
    price: "$20",
    description: "2-3 days delivery",
    icon: Plane
  },
  free: {
    label: "Free",
    color: "bg-green-100 text-green-800",
    price: "$0",
    description: "5-7 days delivery",
    icon: Bike
  },
};

export const paymentMethodConfig = {
  cash: {
    label: "Cash on Delivery",
    icon: "💵",
    name: "Cash",
    description: "Pay with cash when your order is delivered.",
    iconComponent: Banknote
  },
  paypal: {
    label: "PayPal",
    icon: "💙",
    name: "Pay with Paypal",
    description: "You will be redirected to PayPal website to complete your purchase securely.",
    iconComponent: Palette
  },
  card: {
    label: "Credit Card",
    icon: "💳",
    name: "Credit / Debit card",
    description: "We support Mastercard, Visa, Discover and Stripe.",
    iconComponent: CreditCard
  },
};

export const deliveryOptions = [
  { id: "free", value: "free", name: "Free", price: "$0", description: "5-7 days delivery", icon: Bike },
  { id: "standard", value: "standard", name: "Standard", price: "$10", description: "3-5 days delivery", icon: Truck },
  { id: "express", value: "express", name: "Express", price: "$20", description: "2-3 days delivery", icon: Plane }
];

export const paymentOptions = [
  { id: "cash", value: "cash", name: "Cash", description: "Pay with cash when your order is delivered.", icon: Banknote },
  { id: "paypal", value: "paypal", name: "Pay with Paypal", description: "You will be redirected to PayPal website to complete your purchase securely.", icon: Palette },
  { id: "card", value: "card", name: "Credit / Debit card", description: "We support Mastercard, Visa, Discover and Stripe.", icon: CreditCard }
];
