"use client";

import SubmitButton from "@/components/admin/SubmitButton";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { flattenCategories } from "@/helper/general";
import { showToast } from "@/helper/toast";
import { ProductEditBody, ProductEditBodyType, ProductType, ProductUpdateDataType } from "@/schemaValidation/product.schema";
import { CategoryType } from "@/schemaValidation/category.schema";
import { uploadFile } from "@/service/uploadFile";
import { updateProduct } from "@/service/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDown, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/store/features/breadcrumbSlice";

interface EditProductFormProps {
  initialProduct: ProductType;
  initialCategories: CategoryType[];
}

function EditProductForm({ initialProduct, initialCategories }: EditProductFormProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  
  useEffect(() => {
    dispatch(setBreadcrumb([
      {
        label: "Management",
      },
      {
        label: "Product list",
        href: "/admin/product",
      },
      {
        label: "Edit product",
      }
    ]));
  }, [dispatch]);
  
  const categories = flattenCategories(initialCategories);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductEditBodyType>({
    resolver: zodResolver(ProductEditBody),
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      name: initialProduct.name,
      sku: initialProduct.sku,
      price: initialProduct.price,
      stock: initialProduct.stock,
      description: initialProduct.description || "",
      discountPercent: initialProduct.discountPercent,
      categories: initialProduct.categories.map(cat => cat.id),
    }
  });

  const [thumbnail, setThumbnail] = useState<string | null>(initialProduct.thumbnail || null);
  const [isNewThumbnail, setIsNewThumbnail] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialProduct.images.map(img => img.imageUrl) || []
  );
  const [isNewImages, setIsNewImages] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    initialProduct.categories.map(cat => cat.id) || []
  );
  const [open, setOpen] = useState(false);

  // Set initial form values
  useEffect(() => {
    setValue("name", initialProduct.name);
    setValue("sku", initialProduct.sku);
    setValue("price", initialProduct.price);
    setValue("stock", initialProduct.stock);
    setValue("description", initialProduct.description || "");
    setValue("discountPercent", initialProduct.discountPercent);
    setValue("categories", initialProduct.categories.map(cat => cat.id));
    setSelectedCategories(initialProduct.categories.map(cat => cat.id));
    setThumbnail(initialProduct.thumbnail || null);
    setImagePreviews(initialProduct.images.map(img => img.imageUrl) || []);
  }, [initialProduct, setValue]);

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setValue("thumbnail", file, { shouldValidate: true });
      setIsNewThumbnail(true);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setThumbnail(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setThumbnail(initialProduct.thumbnail || null);
      setIsNewThumbnail(false);
    }
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (files) {
      const fileArray = Array.from(files);
      setValue("images", fileArray, { shouldValidate: true });
      setIsNewImages(true);

      // Create previews for images
      const previews: string[] = [];
      fileArray.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            previews.push(reader.result as string);
            if (previews.length === fileArray.length) {
              setImagePreviews([...previews]);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    } else {
      setImagePreviews(initialProduct.images.map(img => img.imageUrl) || []);
      setIsNewImages(false);
    }
  };

  const removeImagePreview = (index: number) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    
    // Also update form value
    const currentImages = (document.getElementById('images') as HTMLInputElement)?.files;
    if (currentImages) {
      const fileArray = Array.from(currentImages);
      const newFiles = fileArray.filter((_, i) => i !== index);
      setValue("images", newFiles, { shouldValidate: true });
    }
  };

  const findCategoryInTree = (categoryId: number, cats: CategoryType[] = initialCategories): CategoryType | null => {
    for (const cat of cats) {
      if (cat.id === categoryId) {
        return cat;
      }
      if (cat.subCategories) {
        const found = findCategoryInTree(categoryId, cat.subCategories);
        if (found) return found;
      }
    }
    return null;
  };

  const findParentCategories = (categoryId: number): number[] => {
    const parents: number[] = [];
    const category = findCategoryInTree(categoryId);
    if (category && category.parentId && category.id !== category.parentId) {
      parents.push(category.parentId);
      parents.push(...findParentCategories(category.parentId));
    }
    return parents;
  };

  const findChildCategories = (categoryId: number, cats: CategoryType[] = initialCategories): number[] => {
    const children: number[] = [];
    
    for (const cat of cats) {
      if (cat.parentId === categoryId) {
        children.push(cat.id);
        children.push(...findChildCategories(cat.id));
      }
      if (cat.subCategories) {
        children.push(...findChildCategories(categoryId, cat.subCategories));
      }
    }
    
    return children;
  };

  const handleCategoryToggle = (categoryId: number) => {
    let updatedCategories = [...selectedCategories];
    
    if (selectedCategories.includes(categoryId)) {
      const childrenToRemove = findChildCategories(categoryId);
      updatedCategories = updatedCategories.filter(id => 
        id !== categoryId && !childrenToRemove.includes(id)
      );
    } else {
      const parentsToAdd = findParentCategories(categoryId);
      updatedCategories = [...new Set([...updatedCategories, categoryId, ...parentsToAdd])];
    }
    
    setSelectedCategories(updatedCategories);
    setValue("categories", updatedCategories, { shouldValidate: true });
  };

  const onSubmit = async (data: ProductEditBodyType) => {
    let thumbnailUrl = initialProduct.thumbnail;
    let imageUrls = initialProduct.images.map(img => img.imageUrl);

    if (isNewThumbnail && data.thumbnail) {
      const thumbnailFormData = new FormData();
      thumbnailFormData.append('files', data.thumbnail);
      const thumbnailUrls = await uploadFile(thumbnailFormData);
      
      if (!thumbnailUrls || thumbnailUrls.length === 0) {
        showToast('error', 'Failed to upload thumbnail');
        return;
      }
      
      thumbnailUrl = thumbnailUrls[0];
    }

    // Only upload new images if user selected new ones
    if (isNewImages && data.images) {
      const imagesFormData = new FormData();
      data.images.forEach(image => {
        imagesFormData.append('files', image);
      });
      const uploadedImageUrls = await uploadFile(imagesFormData);
      
      if (!uploadedImageUrls || uploadedImageUrls.length === 0) {
        showToast('error', 'Failed to upload images');
        return;
      }
      
      imageUrls = uploadedImageUrls;
    }
    
    const productData: ProductUpdateDataType = {
      name: data.name,
      thumbnail: thumbnailUrl || '',
      sku: data.sku,
      price: data.price,
      stock: data.stock,
      description: data.description || "",
      discountPercent: data.discountPercent,
      images: imageUrls,
      categories: selectedCategories
    };

    const result = await updateProduct(initialProduct.id, productData);
    if (result.success) {
      showToast('success', 'Product updated successfully!');
      router.push('/admin/product');
    } else {
      showToast('error', result.message || 'Failed to update product');
    }
  };

  return (
    <div className="container-custom-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="label-custom mb-1">Product Name</label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className="input-custom"
            placeholder="Enter product name"
          />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>

        {/* SKU */}
        <div>
          <label htmlFor="sku" className="label-custom mb-1">SKU</label>
          <input
            type="text"
            id="sku"
            {...register("sku")}
            className="input-custom"
            placeholder="Enter SKU"
          />
          {errors.sku && <p className="error-message">{errors.sku.message}</p>}
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="label-custom mb-1">Price</label>
            <input
              type="number"
              id="price"
              {...register("price", { valueAsNumber: true })}
              className="input-custom"
              placeholder="0"
              min="0"
              step="0.01"
            />
            {errors.price && <p className="error-message">{errors.price.message}</p>}
          </div>
          
          <div>
            <label htmlFor="stock" className="label-custom mb-1">Stock</label>
            <input
              type="number"
              id="stock"
              {...register("stock", { valueAsNumber: true })}
              className="input-custom"
              placeholder="0"
              min="0"
            />
            {errors.stock && <p className="error-message">{errors.stock.message}</p>}
          </div>
        </div>

        {/* Discount Percent */}
        <div>
          <label htmlFor="discountPercent" className="label-custom mb-1">Discount Percent</label>
          <input
            type="number"
            id="discountPercent"
            {...register("discountPercent", { valueAsNumber: true })}
            className="input-custom"
            placeholder="0"
            min="0"
            max="100"
          />
          {errors.discountPercent && <p className="error-message">{errors.discountPercent.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="label-custom mb-1">Description</label>
          <textarea
            id="description"
            {...register("description")}
            className="input-custom min-h-[100px]"
            placeholder="Enter product description"
          />
          {errors.description && <p className="error-message">{errors.description.message}</p>}
        </div>

        {/* Categories */}
        <div>
          <label className="label-custom mb-1">Categories</label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between py-6"
              >
                {selectedCategories.length > 0 
                  ? `${selectedCategories.length} categories selected` 
                  : "Select categories"}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandInput placeholder="Search category..." />
                <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem key={category.id} value={category.name}
                        className={`${category.level === 0 ? 'font-medium' : ``}`}
                        onSelect={() => handleCategoryToggle(category.id)}
                      >
                        <Checkbox 
                          checked={selectedCategories.includes(category.id)}
                          className="mr-2"
                        />
                        <span style={{ paddingLeft: `${category.level * 15}px` }}>{category.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.categories && <p className="error-message">{errors.categories.message as string}</p>}
        </div>

        {/* Thumbnail */}
        <div className="w-full">
          <span className="label-custom mb-1">Thumbnail</span>
          <label htmlFor="thumbnail" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG</p>
            </div>
            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleThumbnailChange}
            />
          </label>
          {thumbnail && (
            <>
              <Image src={thumbnail} alt="thumbnail" width={150} height={203} className="rounded-sm mt-2" />
              {isNewThumbnail && <p className="text-sm text-blue-600 mt-1">New thumbnail selected</p>}
            </>
          )}
          {errors.thumbnail && <p className="error-message">{errors.thumbnail.message as string}</p>}
        </div>

        {/* Images */}
        <div className="w-full">
          <span className="label-custom mb-1">Product Images</span>
          <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload multiple images</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG (Multiple files)</p>
            </div>
            <input
              id="images"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImagesChange}
            />
          </label>
          {imagePreviews.length > 0 && (
            <>
              <div className="mt-2 flex gap-2 flex-wrap">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative w-fit">
                    <Image src={preview} alt={`preview-${index}`} width={150} height={150} className="rounded-sm object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImagePreview(index)}
                      className="absolute top-0 right-0 -translate-x-1/4 translate-y-1/4 bg-[var(--tertiary)]/90 text-white rounded-full p-1 hover:bg-[var(--tertiary)]"
                    >
                      <X className="h-3 w-3" strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
              {isNewImages && <p className="text-sm text-blue-600 mt-1">New images selected</p>}
            </>
          )}
          {errors.images && <p className="error-message">{errors.images.message as string}</p>}
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/product')}
            className="px-6"
          >
            Cancel
          </Button>
          <SubmitButton
            label="Update Product"
            pending={isSubmitting}
            className="flex ml-auto"
          />
        </div>
      </form>
    </div>
  );
}

export default EditProductForm; 