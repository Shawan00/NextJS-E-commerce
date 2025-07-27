"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { CategoryType } from "@/schemaValidation/category.schema";
import { useState, useRef, useEffect } from "react";
import CategoryCard from "@/components/admin/category-card";
import DeleteCategory, { DeleteCategoryRef } from "./deleteCategory";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/store/features/breadcrumbSlice";

interface CategoryListProps {
  initialCategories: CategoryType[];
}

interface CategoryAccordionItemProps {
  category: CategoryType;
  level: number;
  onDelete: (category: CategoryType) => void;
}

function CategoryAccordionItem({ category, level, onDelete }: CategoryAccordionItemProps) {
  const hasSubCategories = category.subCategories && category.subCategories.length > 0;

  const handleDeleteWrapper = (id: number) => {
    onDelete(category);
  };

  if (!hasSubCategories) {
    // Category without subcategories
    return (
      <div className="mb-2">
        <CategoryCard
          category={category}
          level={level}
          onDelete={handleDeleteWrapper}
        />
      </div>
    );
  }

  // Category with subcategories - use accordion
  return (
    <AccordionItem value={category.id.toString()} className="border-none mb-2">
      <div className="space-y-2">
        {/* Parent Category Card */}
        <div className="relative">
          <CategoryCard
            category={category}
            level={level}
            onDelete={handleDeleteWrapper}
            className="shadow-sm hover:shadow-md transition-shadow"
          />
          
          {/* Accordion Trigger - covers entire card */}
          <AccordionTrigger className="absolute inset-0 bg-transparent hover:bg-black/5 transition-colors rounded-lg [&>svg]:hidden">
            <span className="sr-only">Toggle subcategories</span>
          </AccordionTrigger>
        </div>

        {/* Subcategories */}
        <AccordionContent>
          <div className="ml-6 pl-4 border-l-2 border-dashed border-border space-y-2 pt-2">
            {category.subCategories!.map((subCategory) => (
              <CategoryAccordionItem
                key={subCategory.id}
                category={subCategory}
                level={level + 1}
                onDelete={onDelete}
              />
            ))}
          </div>
        </AccordionContent>
      </div>
    </AccordionItem>
  );
}

function CategoryList({ initialCategories }: CategoryListProps) {
  const [categories, setCategories] = useState<CategoryType[]>(initialCategories);
  const deleteRef = useRef<DeleteCategoryRef>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setBreadcrumb([
      {
        label: 'Management'
      },
      {
        label: 'Category'
      }
    ]));
  }, []);

  const handleDelete = (category: CategoryType) => {
    deleteRef.current?.setCategory(category);
  };

  const handleReload = () => {
    router.refresh();
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-4">No categories found</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Accordion
        type="multiple"
        className="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
        defaultValue={categories.map(cat => cat.id.toString())}
      >
        {categories.map((category) => (
          <CategoryAccordionItem
            key={category.id}
            category={category}
            level={0}
            onDelete={handleDelete}
          />
        ))}
      </Accordion>
      
      <DeleteCategory ref={deleteRef} onReload={handleReload} />
    </div>
  );
}

export default CategoryList;