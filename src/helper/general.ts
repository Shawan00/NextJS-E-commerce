import { CategoryType, FlattenCategoryType } from "@/schemaValidation/category.schema";

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatDate = (date: string | number | Date): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

// Converts "2025-06-14T14:18:33.664Z" to "June 14, 2025"
export const formatDateToString = (date: string | number | Date): string => {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
};

export const formatTimeMinute = (time: number): string => {
  if (isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes.toString()}:${seconds.toString().padStart(2, "0")}`;
};

export const resizeImage = (img: string, width: number): string => {
  return img.replace('upload/', `upload/c_limit,w_${width}/f_auto/`);
};


// Gets the first letter of the first and last name
export const getAvatarFallback = (name: string): string => {
  if (!name || typeof name !== 'string') return '';

  const words = name.trim().split(/\s+/);
  if (words.length === 0) return '';

  const first = words[0][0].toUpperCase();
  const last = words.length > 1 ? words[words.length - 1][0].toUpperCase() : '';

  return first + last;
};

// Formats a number with dots as thousands separators
export const formatNumberWithDots = (number: number): string => {
  if (isNaN(number)) return String(number);
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const flattenCategories = (
  categories: CategoryType[],
  parent?: { id: number, name: string, thumbnail: string, level: number },
): FlattenCategoryType[] => {
  const result: FlattenCategoryType[] = [];

  for (const category of categories) {
    const { id, name, thumbnail, subCategories } = category;

    const flatCategory: FlattenCategoryType = {
      id,
      name,
      thumbnail,
      level: parent ? parent.level + 1 : 0,
    };

    result.push(flatCategory);

    if (subCategories && subCategories.length > 0) {
      result.push(...flattenCategories(subCategories, { id, name, thumbnail, level: parent ? parent.level + 1 : 0 }));
    }
  }

  return result;
}