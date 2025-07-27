"use client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CategoryType } from "@/schemaValidation/category.schema";
import { deleteCategory } from "@/service/category";
import { showToast } from "@/helper/toast";
import { useState, forwardRef, useImperativeHandle } from "react";
import { Loader2 } from "lucide-react";

interface DeleteCategoryProps {
  onReload: () => void;
}

export interface DeleteCategoryRef {
  setCategory: (category: CategoryType | null) => void;
}

const DeleteCategory = forwardRef<DeleteCategoryRef, DeleteCategoryProps>(({ onReload }, ref) => {
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Expose setCategory function to parent component
  useImperativeHandle(ref, () => ({
    setCategory
  }));

  const handleDelete = async () => {
    if (!category) return;

    setIsDeleting(true);
    try {
      const result = await deleteCategory(category.id);
      
      if (result.success) {
        showToast('success', 'Category deleted successfully!');
        onReload();
      } else {
        showToast('error', result.message || 'Unable to delete category');
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      showToast('error', 'An error occurred while deleting category');
    }
    setIsDeleting(false);
  };

  const handleCancel = () => {
    setCategory(null);
  };

  return (
    <>
      <AlertDialog open={!!category} onOpenChange={() => setCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              <strong> {category?.name} </strong> 
              and all its subcategories from the database.
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
                  <Loader2 className="h-4 w-4 animate-spin pointer-events-none mr-2" />
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

DeleteCategory.displayName = "DeleteCategory";

export default DeleteCategory;
