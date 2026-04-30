export type CompanySpotCategory =
  | "food"
  | "place"
  | "culture"
  | "nature"
  | "comfort";

export type CompanySpot = {
  id: string;
  name: string;
  category: CompanySpotCategory;
  comment: string | null;
  imageUrl: string | null;
  mapX: number | null;
  mapY: number | null;
  lat: number | null;
  lng: number | null;
  language: "en" | "ja" | "tl";
  createdBy: string | null;
  createdAt: string;
  interestCount: number;
};

export type CompanyEvent = {
  id: string;
  spotId: string | null;
  title: string;
  description: string | null;
  eventDate: string | null;
  eventTime: string | null;
  capacity: number | null;
  createdAt: string;
  participantCount: number;
  spot: CompanySpot | null;
};
