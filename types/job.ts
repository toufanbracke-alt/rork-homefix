export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface Offer {
  id: string;
  fixerId: string;
  fixerName: string;
  fixerRating: number;
  fixerVerified?: boolean;
  fixerPhone?: string;
  price: number;
  message: string;
  timestamp: string;
  status: "pending" | "accepted" | "declined";
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  coordinates?: LocationCoords;
  urgency: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed";
  price?: number;
  images?: string[];
  postedAt: string;
  clientId: string;
  clientName: string;
  clientVerified?: boolean;
  clientPhone?: string;
  fixerId?: string;
  fixerName?: string;
  fixerVerified?: boolean;
  fixerPhone?: string;
  offers?: Offer[];
  messages?: Message[];
}