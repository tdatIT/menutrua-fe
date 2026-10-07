export type Dish = {
  id: string;
  name: string;
  restaurant: string | null;
  location: string | null;
  description: string | null;
  imageUrl: string | null;
  /** Photo of the restaurant menu. */
  menuImageUrl: string | null;
  /** Bank transfer QR for group orders. */
  qrImageUrl: string | null;
  createdAt: string;
};

/** Create/update payload. Sent as multipart/form-data because of the images. */
export type DishInput = {
  name: string;
  restaurant?: string;
  location?: string;
  description?: string;
  menuImage?: File | null;
  qrImage?: File | null;
};

export type RandomDishResult = {
  dishId: string;
};
