"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/service/order";
import { showToast } from "@/helper/toast";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface CancelOrderButtonProps {
  orderId: number;
}

export default function CancelOrderButton({ orderId }: CancelOrderButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCancelOrder = async () => {
    setLoading(true);
    const result = await updateOrderStatus(orderId, "cancelled");
    if (result.success) {
      showToast("success", "Order cancelled successfully");
      router.refresh();
    } else {
      showToast("error", result.message || "Failed to cancel order");
    }

    setLoading(false);
  };

  return (
    <Button 
      variant="destructive" 
      size="sm"
      onClick={handleCancelOrder}
      disabled={loading}
      className="flex items-center ml-auto border-2 border-destructive hover:bg-secondary hover:text-destructive transition-colors duration-300"
    >
      <X className="w-4 h-4" />
      {loading ? "Cancelling..." : "Cancel Order"}
    </Button>
  );
} 