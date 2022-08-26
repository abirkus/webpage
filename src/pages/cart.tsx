import React, { useContext, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout/Layout';
import { Store } from '../../utils/Store';
import { Grid, Button, List, ListItem } from '@mui/material';
import { useRouter } from 'next/router';
import StepperComponent from '../components/Stepper/Stepper';
import ServicesDataTable from 'components/Table/ServicesDataTable';
import cartTableColumns from 'components/Table/Columns/CartServicesColumns';
import { CardShadow } from 'components/StyledBaseComponents/CardShadow';
import { totalPrice } from '../../utils/helperFunctions';
import ControlledInputField from 'components/Forms/Fields/ControlledInputField';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { OrderDetailsType } from '../../utils/types';

function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const { cartItems, carSize, shippingAddress } = state;

  useEffect(() => {
    Object.keys(shippingAddress).map((key) =>
      setValue(key, shippingAddress[key as keyof OrderDetailsType]),
    );
  }, [state, setValue, shippingAddress]);

  const checkoutHandler: SubmitHandler<FieldValues> = (data) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: data,
    });
    router.push('/orderdetails');
  };
  const servicesHandler = () => {
    router.push('/services');
  };

  let priceIndex = 0;
  if (carSize === 'large') {
    priceIndex = 2;
  }
  if (carSize === 'medium') {
    priceIndex = 1;
  }

  if (cartItems.length === 0) {
    router.push('/services');
  }

  return (
    <Layout title="Shopping Cart">
      <StepperComponent activeStep={0} />
      <form onSubmit={handleSubmit(checkoutHandler)}>
        <Grid container spacing={3} padding="20px">
          <Grid item md={8} xs={12}>
            <CardShadow
              sx={{
                borderRadius: '4px',
              }}
            >
              <ServicesDataTable cartItemsArray={cartItems} columns={cartTableColumns} />
            </CardShadow>
            <br></br>

            <ControlledInputField
              control={control}
              errors={errors}
              required
              minLength={3}
              fieldName="customerComments"
              fieldLabel="Services Comments"
              customRules={{
                required: false,
                minLength: undefined,
              }}
              extraProps={{
                multiline: true,
                minRows: 2,
              }}
            />
            <Button
              onClick={servicesHandler}
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ marginTop: '20px' }}
            >
              + Add more services
            </Button>
          </Grid>
          <Grid item md={4} xs={12}>
            <CardShadow>
              <List>
                <ListItem sx={{ fontWeight: 'bold' }}>
                  Estimated total price: ${totalPrice(cartItems, priceIndex)}
                </ListItem>
                <ListItem sx={{ color: 'dimgray' }}>
                  Note: Total price and duration will vary based on the size of your vehicle
                </ListItem>
                <ListItem>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    Check Out
                  </Button>
                </ListItem>
              </List>
            </CardShadow>
          </Grid>
        </Grid>
      </form>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
