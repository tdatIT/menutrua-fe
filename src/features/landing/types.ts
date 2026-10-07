export type FoodCategory = {
  id: string;
  name: string;
  tagline: string;
  imageUrl: string;
};

export type FeaturedDish = {
  id: string;
  name: string;
  /** Lowest price in VND. */
  priceFrom: number;
  description: string;
  imageUrl: string;
};

export type DailySuggestion = {
  dishName: string;
};

export type PollPreview = {
  title: string;
  options: Array<{label: string; votes: number}>;
  endsInMinutes: number;
  participants: Array<{name: string}>;
};
