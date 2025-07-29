"use client";

import SubmitButton from "@/components/admin/SubmitButton";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { flattenCategories } from "@/helper/general";
import { showToast } from "@/helper/toast";
import { CategoryEditBody, CategoryEditBodyType, CategoryType } from "@/schemaValidation/category.schema";
import { uploadFile } from "@/service/uploadFile";
import { updateCategory } from "@/service/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/store/features/breadcrumbSlice";

interface EditCategoryFormProps {
  initialCategory: CategoryType;
  initialCategories: CategoryType[];
}

function EditCategoryForm({ initialCategory, initialCategories }: EditCategoryFormProps) {
  const categories = flattenCategories(initialCategories);
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setBreadcrumb([
      {
        label: 'Management'
      },
      {
        label: 'Category',
        href: '/admin/category'
      },
      {
        label: 'Edit Category'
      }
    ]));
  }, [dispatch]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<CategoryEditBodyType>({
    resolver: zodResolver(CategoryEditBody),
    mode: "onChange",
    reValidateMode: "onBlur",
    defaultValues: {
      name: initialCategory.name
    }
  });

  const [thumbnail, setThumbnail] = useState<string | null>(initialCategory.thumbnail || null);
  const [isNewImage, setIsNewImage] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Set value to react-hook-form
      setValue("thumbnail", file, { shouldValidate: true });
      setIsNewImage(true);

      // Create preview
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setThumbnail(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setThumbnail(initialCategory.thumbnail || null);
      setIsNewImage(false);
    }
  };

  const [open, setOpen] = useState(false);
  const [parentId, setParentId] = useState<number | null>(initialCategory.parentId || null);

  // Set initial form values
  useEffect(() => {
    setValue("name", initialCategory.name);
    setThumbnail(initialCategory.thumbnail || null);
    setParentId(initialCategory.parentId || null);
  }, [initialCategory, setValue]);

  const onSubmit = async (data: CategoryEditBodyType) => {
    let thumbnailUrl = initialCategory.thumbnail;

    // Only upload new image if user selected a new one
    if (isNewImage && data.thumbnail) {
      const formData = new FormData();
      formData.append('files', data.thumbnail);
      const imageUrls = await uploadFile(formData);

      if (!imageUrls || imageUrls.length === 0) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      thumbnailUrl = imageUrls[0];
    }

    const categoryData = {
      id: initialCategory.id,
      name: data.name,
      thumbnail: thumbnailUrl || '',
      parentId: parentId || 0
    };

    const result = await updateCategory(initialCategory.id, categoryData);
    if (result.success) {
      showToast('success', 'Category updated successfully!');
      router.push('/admin/category');
    } else {
      showToast('error', result.message || 'Failed to update category');
    }
  };

  return (
    <div className="container-custom-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="label-custom mb-1">Category Name</label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className="input-custom"
            placeholder="Accessories"
          />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="parentCategoryId" className="label-custom mb-1">Parent Category</label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between py-6"
              >
                {parentId ? categories.find(category => category.id === parentId)?.name : "None (Root Category)"}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Command>
                <CommandInput placeholder="Search category..." />
                <CommandList>
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem value="none" onSelect={() => {
                      setParentId(null);
                      setOpen(false);
                    }}>
                      None (Root Category)
                    </CommandItem>
                    {categories
                      .filter(category => category.id !== initialCategory.id) // Exclude current category
                      .map((category) => (
                        <CommandItem key={category.id} value={category.name}
                          className={`${category.level === 0 ? 'font-medium' : ``}`}
                          onSelect={() => {
                            setParentId(category.id);
                            setOpen(false);
                          }}
                        >
                          <span style={{ paddingLeft: `${category.level * 15}px` }}>{category.name}</span>
                          <Check
                            className={`ml-auto ${category.id === parentId ? 'opacity-100' : 'opacity-0'}`}
                          />
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

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
              onChange={handleFileChange}
            />
          </label>
          {thumbnail && (
            <>
              <Image src={thumbnail} alt="thumbnail" width={150} height={203} className="rounded-sm mt-2" />
              {isNewImage && <p className="text-sm text-blue-600 mt-1">New image selected</p>}
            </>
          )}
          {errors.thumbnail && <p className="error-message">{errors.thumbnail.message as string}</p>}
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/category')}
            className="px-6"
          >
            Cancel
          </Button>
          <SubmitButton
            label="Update category"
            pending={isSubmitting}
            className="flex ml-auto"
          />
        </div>
      </form>
    </div>
  )
}

export default EditCategoryForm;