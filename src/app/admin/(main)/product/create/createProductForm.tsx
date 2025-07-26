"use client";

import SubmitButton from "@/components/admin/SubmitButton";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { flattenCategories } from "@/helper/general";
import { showToast } from "@/helper/toast";
import { ProductBody, ProductBodyType } from "@/schemaValidation/product.schema";
import { CategoryType } from "@/schemaValidation/category.schema";
import { uploadFile } from "@/service/uploadFile";
import { createProduct } from "@/service/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

function CreateProductForm({ initialCategories }: { initialCategories: CategoryType[] }) {
  const categories = flattenCategories(initialCategories);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ProductBodyType>({
    resolver: zodResolver(ProductBody),
    mode: "onChange",
    reValidateMode: "onBlur"
  });

  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [open, setOpen] = useState(false);

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setValue("thumbnail", file, { shouldValidate: true });

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setThumbnail(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setThumbnail(null);
    }
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (files) {
      const fileArray = Array.from(files);
      setValue("images", fileArray, { shouldValidate: true });

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
      setImagePreviews([]);
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

  const handleCategoryToggle = (categoryId: number) => {
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(updatedCategories);
    setValue("categories", updatedCategories, { shouldValidate: true });
  };

  const onSubmit = async (data: ProductBodyType) => {
    try {
      // Upload thumbnail
      const thumbnailFormData = new FormData();
      thumbnailFormData.append('files', data.thumbnail);
      const thumbnailUrls = await uploadFile(thumbnailFormData);
      
      if (!thumbnailUrls || thumbnailUrls.length === 0) {
        throw new Error("Failed to upload thumbnail");
      }
      
      // Upload images
      const imagesFormData = new FormData();
      data.images.forEach(image => {
        imagesFormData.append('files', image);
      });
      const imageUrls = await uploadFile(imagesFormData);
      
      if (!imageUrls || imageUrls.length === 0) {
        throw new Error("Failed to upload images");
      }
      
      const productData = {
        name: data.name,
        thumbnail: thumbnailUrls[0],
        sku: data.sku,
        price: data.price,
        stock: data.stock,
        description: data.description || "",
        discountPercent: data.discountPercent,
        images: imageUrls,
        categories: selectedCategories
      };

      const result = await createProduct(productData);
      if (result) {
        showToast('success', 'Product created successfully!');
        setThumbnail(null);
        setImagePreviews([]);
        setSelectedCategories([]);
        reset();
      } else {
        showToast('error', 'Failed to create product');
      }
      
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to create product');
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
            placeholder="iPhone 15 Pro Max"
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
            placeholder="IP15PM001"
          />
          {errors.sku && <p className="error-message">{errors.sku.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="label-custom mb-1">Price (VND)</label>
          <input
            type="number"
            id="price"
            {...register("price", { valueAsNumber: true })}
            className="input-custom"
            placeholder="29990000"
            min="1"
          />
          {errors.price && <p className="error-message">{errors.price.message}</p>}
        </div>

        {/* Stock */}
        <div>
          <label htmlFor="stock" className="label-custom mb-1">Stock Quantity</label>
          <input
            type="number"
            id="stock"
            {...register("stock", { valueAsNumber: true })}
            className="input-custom"
            placeholder="100"
            min="1"
          />
          {errors.stock && <p className="error-message">{errors.stock.message}</p>}
        </div>

        {/* Discount Percent */}
        <div>
          <label htmlFor="discountPercent" className="label-custom mb-1">Discount Percent (%)</label>
          <input
            type="number"
            id="discountPercent"
            {...register("discountPercent", { valueAsNumber: true })}
            className="input-custom"
            placeholder="0"
            min="0"
            max="100"
            step="0.1"
          />
          {errors.discountPercent && <p className="error-message">{errors.discountPercent.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="label-custom mb-1">Description (Optional)</label>
          <textarea
            id="description"
            {...register("description")}
            className="input-custom min-h-[100px]"
            placeholder="Enter product description..."
            rows={4}
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
                  : "Select categories..."
                }
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandInput placeholder="Search categories..." />
                <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem 
                        key={category.id} 
                        value={category.name}
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
          {selectedCategories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedCategories.map(categoryId => {
                const category = categories.find(c => c.id === categoryId);
                return category ? (
                  <div key={categoryId} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {category.name}
                    <X 
                      className="h-4 w-4 cursor-pointer hover:text-blue-600" 
                      onClick={() => handleCategoryToggle(categoryId)}
                    />
                  </div>
                ) : null;
              })}
            </div>
          )}
          {errors.categories && <p className="error-message">{errors.categories.message}</p>}
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
                <span className="font-semibold">Click to upload thumbnail</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG</p>
            </div>
            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleThumbnailChange}
              required
            />
          </label>
          {thumbnail && (
            <Image src={thumbnail} alt="thumbnail" width={150} height={150} className="rounded-sm mt-2" />
          )}
          {errors.thumbnail && <p className="error-message">{errors.thumbnail.message as string}</p>}
        </div>

        {/* Product Images */}
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
              required
            />
          </label>
          {imagePreviews.length > 0 && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative w-fit">
                  <Image src={preview} alt={`preview-${index}`} width={150} height={150} className="rounded-sm object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImagePreview(index)}
                    className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/4 bg-[var(--tertiary)]/90 text-white rounded-full p-1 hover:bg-[var(--tertiary)]"
                  >
                    <X className="h-3 w-3" strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {errors.images && <p className="error-message">{errors.images.message as string}</p>}
        </div>

        <SubmitButton
          label="Create Product"
          pending={isSubmitting}
          className="flex ml-auto"
        />
      </form>
    </div>
  );
}

export default CreateProductForm;