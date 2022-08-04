import { Moment } from 'moment';
import { GridColDef } from '@mui/x-data-grid';
import { CarModel } from 'apiWrappers/carDatabaseApi';

export type faqSubGroupsTypes = 'basics' | 'services' | 'payments' | 'changes' | 'info';

export type ServiceType = {
  id: number;
  name: string;
  prices: number[];
  duration?: string;
  shortDescription: string;
  longDescription: string;
  images: string[];
};

export type OrderDetailsType = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  pickupLocation: string;
  dropoffLocation: string;
  carYear: string;
  carMake: string;
  carModel: CarModel;
  carColor?: string;
  vin?: string;
  transmission?: string;
  pickupDate: Moment;
  dropoffDate: Moment;
  customerComments?: string;
};

export type ServiceDatesType = {
  pickUpDate: Date;
  returnDate: Date;
};

export type StateType = {
  cartItems: ServiceType[];
  shippingAddress: OrderDetailsType;
  carSize: string;
};

export type Action =
  | { type: 'CART_ADD_ITEM'; payload: ServiceType }
  | { type: 'CART_REMOVE_ITEM'; payload: ServiceType }
  | { type: 'SAVE_SHIPPING_ADDRESS'; payload: OrderDetailsType }
  | { type: 'CART_CLEAR' };

export type aboutDetailsProps = {
  title: string;
  description: string;
  image: string;
};

export type AboutCardProps = {
  info: aboutDetailsProps;
};

export interface ServiceObject {
  serviceObject: ServiceType;
}

export interface customTableProps {
  columns: GridColDef[];
  cartItemsArray: Array<ServiceType>;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  serviceDetails: ServiceType;
}

export interface ServicesDataType {
  category: string;
  services: Array<ServiceType>;
}

export type yelpCommentType = {
  language: string;
  text: string;
};

export type yelpUserType = {
  altText: string;
  displayLocation: string;
  eliteYear?: number;
  friendCount?: number;
  link: string;
  markupDisplayName: string;
  partnerAlias?: string;
  photoCount?: number;
  reviewCount?: number;
  src: string;
  srcSet: string;
  userUrl: string;
};

export type yelpReviewType = {
  appreciatedBy?: string;
  business: object;
  businessOwnerReplies?: [];
  comment: yelpCommentType;
  feedback: object;
  id: string;
  isUpdated: boolean;
  lightboxMediaItems: [];
  localizedDate: string;
  localizedDateVisited?: string;
  photos?: [];
  photosUrl: string;
  previousReviews?: [];
  rating: number;
  tags: [];
  totalPhotos?: number;
  user: yelpUserType;
  userId: string;
};
