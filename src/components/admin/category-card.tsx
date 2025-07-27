"use client";

import { CategoryType } from "@/schemaValidation/category.schema";
import Image from "next/image";
import Link from "next/link";
import { Edit, Trash2, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoryCardProps {
  category: CategoryType;
  level: number;
  onDelete?: (id: number) => void;
  className?: string;
}

export default function CategoryCard({ 
  category, 
  level, 
  onDelete, 
  className
}: CategoryCardProps) {
  const hasSubCategories = category.subCategories && category.subCategories.length > 0;

  // Level styling based on global.css colors
  const levelVariants = {
    0: "default", // primary
    1: "secondary", // tertiary  
    2: "outline", // accent
  } as const;

  const levelColors = {
    0: "border-l-primary bg-primary/5",
    1: "border-l-tertiary bg-tertiary/5", 
    2: "border-l-accent bg-accent/5",
  } as const;

  const currentVariant = levelVariants[level as keyof typeof levelVariants] || "outline";
  const currentColors = levelColors[level as keyof typeof levelColors] || levelColors[2];

  // Check if thumbnail is valid
  const hasValidThumbnail = category.thumbnail && 
                            typeof category.thumbnail === 'string' && 
                            category.thumbnail.trim() !== "";

  return (
    <div className={cn(
      "group relative rounded-lg border border-l-4 transition-all duration-200 hover:shadow-md bg-card",
      currentColors,
      className
    )}>
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* Thumbnail */}
          <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0 relative">
            {hasValidThumbnail && (
              <Image
                src={category.thumbnail}
                alt={category.name || "Category image"}
                width={48}
                height={48}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.parentElement?.querySelector('.fallback-image');
                  if (fallback) {
                    (fallback as HTMLElement).style.display = 'flex';
                  }
                }}
              />
            )}
            <div className={cn(
              "absolute inset-0 bg-muted flex items-center justify-center fallback-image text-[10px]",
              hasValidThumbnail ? "hidden" : "flex"
            )}>
              <span className="text-muted-foreground font-medium">No Image</span>
            </div>
          </div>

          {/* Category Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate mb-1 text-foreground">
              {category.name}
            </h3>
            
            <div className="flex items-center gap-2">
              <Badge variant={currentVariant} className="text-xs">
                Level {level + 1}
              </Badge>
              
              {hasSubCategories && (
                <Badge variant="outline" className="text-xs">
                  {category.subCategories!.length} sub
                </Badge>
              )}
            </div>
          </div>

          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="relative z-10 p-1.5 hover:bg-muted rounded-md transition-colors"
                aria-label="Category options"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-32 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/category/edit/${category.id}`}
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(category.id);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
