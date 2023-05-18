import React, { useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout/Layout';
import { Store } from '../../utils/Store';
import { Grid, Typography, CircularProgress, Button, ListItem } from '@mui/material';
import { useRouter } from 'next/router';
import StepperComponent from '../components/Stepper/Stepper';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import ServicesDataTable from 'components/Table/ServicesDataTable';
import orderSummaryColumns from 'components/Table/Columns/OrderSummaryColumns';
import { CustomerDetailsSummary } from 'components/Table/CustomerDetailsSummary';
import { ServiceType } from '../../utils/types';
import { CardShadow } from 'components/StyledBaseComponents/CardShadow';
import { totalPrice } from '../../utils/helperFunctions';

function PlaceOrder() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cartItems, shippingAddress, carSize } = state;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  let priceIndex = 0;
  if (carSize === 'large') {
    priceIndex = 2;
  }
  if (carSize === 'medium') {
    priceIndex = 1;
  }

  const basicCartItems = cartItems.map((item: ServiceType) => {
    const finalItemPrice = item.prices.length > 2 ? +item.prices[priceIndex] : +item.prices[0];

    return { id: item.id, price: +finalItemPrice }; // temporarily using prices array
  });

  const failSafeCommentServicesRequested = cartItems.map((item: ServiceType) => {
    // const finalItemPrice = item.prices.length > 2 ? +item.prices[priceIndex] : +item.prices[0];

    return item.name; // temporarily using prices array
  });

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    customerComments,
    logisticComments,
    ...orderInfo
  } = shippingAddress;

  const customerInfo = {
    firstName,
    lastName,
    email,
    phoneNumber: Number(phoneNumber),
  };

  const order = {
    hash: uuidv4(),
    ...orderInfo,
    logisticComments: logisticComments,
    customerComments: customerComments
      ? customerComments.concat(' ', 'services list:', failSafeCommentServicesRequested.join('\n'))
      : ''.concat('services list:', failSafeCommentServicesRequested.join('\n')),
    carModel: orderInfo.carModel.Model,
  };

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      if (basicCartItems.length > 0) {
        await axios.post('/api/sendOrder', {
          services: basicCartItems,
          customer: customerInfo,
          order,
        });
        dispatch({ type: 'CART_CLEAR' });
        setLoading(false);
        router.push('/confirmation');
      } else {
        setLoading(false);
        setError(true);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const editServicesHandler = () => {
    router.push('/cart');
  };

  return (
    <Layout title="Place Order">
      <StepperComponent activeStep={2}></StepperComponent>

      <Grid container spacing={3} padding="20px">
        <Grid item md={6} xs={12}>
          <CustomerDetailsSummary />
        </Grid>
        <Grid item md={6} xs={12}>
          <CardShadow>
            <Typography variant="h4" component="h4" margin="10px">
              Order Summary
            </Typography>

            <ServicesDataTable cartItemsArray={cartItems} columns={orderSummaryColumns} />
            <Grid container padding="10px" borderTop="solid 1px rgb(224, 224, 224)">
              <Grid item xs={6}>
                <Typography>
                  <strong>Total price based on your vehicle size:</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography align="right">
                  <strong>${totalPrice(cartItems, priceIndex)}</strong>
                </Typography>
              </Grid>
            </Grid>
          </CardShadow>
          <Button
            onClick={placeOrderHandler}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: '20px' }}
          >
            Place Order
          </Button>
          {loading && (
            <ListItem>
              <CircularProgress />
            </ListItem>
          )}
          <Button
            onClick={editServicesHandler}
            variant="outlined"
            color="primary"
            fullWidth
            sx={{ marginTop: '10px' }}
          >
            Edit Services
          </Button>
          {error && (
            <>
              <Typography align="center" color="red">
                You have not selected any services.
              </Typography>
              <Typography align="center" color="red">
                Please select the services you want to order and repeat sending the order again.
              </Typography>
            </>
          )}
          <Typography marginTop="10px" fontSize="0.9rem">
            Once the order is placed we will reach out to you via text to confirm order details and
            to coordinate vehicle pickup times. Due to increasingly high service volume, please
            allow a few hours for our logistics team to process your booking request.
          </Typography>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(PlaceOrder), { ssr: false });
