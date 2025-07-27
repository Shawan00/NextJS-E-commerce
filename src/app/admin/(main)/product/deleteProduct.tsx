"use client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ProductType } from "@/schemaValidation/product.schema";
import { deleteProduct } from "@/service/product";
import { showToast } from "@/helper/toast";
import { useState, forwardRef, useImperativeHandle } from "react";
import { Loader2 } from "lucide-react";

interface DeleteProductProps {
  onReload: () => void;
}

export interface DeleteProductRef {
  setProduct: (product: ProductType | null) => void;
}

const DeleteProduct = forwardRef<DeleteProductRef, DeleteProductProps>(({ onReload }, ref) => {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Expose setProduct function to parent component
  useImperativeHandle(ref, () => ({
    setProduct
  }));

  const handleDelete = async () => {
    if (!product) return;

    setIsDeleting(true);
    const res = await deleteProduct(product.id);
    if (res.success) {
      showToast('success', 'Product deleted successfully!');
      onReload();
      setProduct(null);
    } else {
      showToast('error', res.message || 'Error deleting product!');
    }
    setIsDeleting(false);
  };

  const handleCancel = () => {
    setProduct(null);
  };

  return (
    <>
      <AlertDialog open={!!product} onOpenChange={() => setProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              <strong> {product?.name} </strong> 
              and remove it from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel} disabled={isDeleting} className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin pointer-events-none" />
                  Deleting...
                </>
              ) : (
                <>
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

DeleteProduct.displayName = "DeleteProduct";

export default DeleteProduct;