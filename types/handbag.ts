export interface Handbag {
  id: string;
  handbagName: string;
  cost: number;
  category: string;
  color: string[];
  gender: boolean;
  uri: string;
  brand: string;
  percentOff: number;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string; // initials
  rating: number;
  text: string;
  date: string;
}

export interface Feedback {
  handbagId: string;
  averageRating: number;
  totalReviews: number;
  breakdown: { stars: number; count: number }[];
  comments: Comment[];
}
