import { ServiceType } from './types';

export const fieldLabelsUI = {
  firstName: 'First Name',
  lastName: 'Last Name',
  email: 'Email',
  phoneNumber: 'Phone Number',
  pickupLocation: 'Pickup Location',
  dropoffLocation: 'Dropoff Location',
  pickupDate: 'Car Pickup Date',
  dropoffDate: 'Car Return Date',
  carMake: 'Car Make',
  carModel: 'Car Model',
  carColor: 'Car Color',
  carYear: 'Car Year',
  vin: 'Vin number',
  transmission: 'Transmission Type',
  customerComments: 'Services Comments',
  logisticComments: 'Location Comments',
};

export const totalPrice = (cartItemsArray: ServiceType[], priceIndex: number) => {
  return cartItemsArray.reduce((subTotal, service) => {
    if (service.prices?.length > 2) {
      return subTotal + +service.prices[priceIndex];
    }
    return subTotal + +service.prices[0];
  }, 0);
};
