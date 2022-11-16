import { Button, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import Layout from 'components/Layout/Layout';
import { Store } from '../../utils/Store';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import StepperComponent from 'components/Stepper/Stepper';
import { CustomerInformationForm } from 'components/Forms/CustomerInformationForm';
import { CarInformationFrom } from 'components/Forms/CarInformationForm';
import { AddressForm } from 'components/Forms/AddressForm';
import { ServiceDateForm } from 'components/Forms/ServiceDateForm';
import { OrderDetailsType } from '../../utils/types';
import moment from 'moment';
import { isUndefined } from 'lodash';

export default function Shipping() {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
    setError,
    clearErrors,
    watch,
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { shippingAddress } = state;

  useEffect(() => {
    Object.keys(shippingAddress).map((key) =>
      setValue(key, shippingAddress[key as keyof OrderDetailsType]),
    );
  }, [state, setValue, shippingAddress]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: data,
    });
    router.push('/placeorder');
  };

  const dropOffDate = watch('dropoffDate');
  const pickupDate = watch('pickupDate');

  const dropOffDateFormated = moment(dropOffDate).format('hh:mm A');
  const pickupDateFormated = moment(pickupDate).format('hh:mm A');
  const drOffFormValue = getValues('dropoffDate');
  const pkOffFormValue = getValues('pickupDate');

  useEffect(() => {
    if (dropOffDateFormated === '12:00 AM' && !isUndefined(drOffFormValue)) {
      setError(
        'dropoffDate',
        {
          type: 'custom',
          message: 'incorrect_time',
        },
        { shouldFocus: true },
      );
    } else if (dropOffDateFormated !== '12:00 AM' && !isUndefined(drOffFormValue)) {
      clearErrors('dropoffDate');
    }
    if (pickupDateFormated === '12:00 AM' && !isUndefined(pkOffFormValue)) {
      setError(
        'pickupDate',
        {
          type: 'custom',
          message: 'incorrect_time',
        },
        { shouldFocus: true },
      );
    } else if (pickupDateFormated !== '12:00 AM' && !isUndefined(pkOffFormValue)) {
      clearErrors('pickupDate');
    }
  }, [dropOffDateFormated, pickupDateFormated, drOffFormValue, pkOffFormValue]);

  return (
    <Layout title="Shipping Address">
      <StepperComponent activeStep={1} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container columnSpacing={3} width="100%" marginLeft="-12px">
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomerInformationForm control={control} errors={errors} />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CarInformationFrom
              control={control}
              errors={errors}
              watch={watch}
              setValue={setValue}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <AddressForm
              control={control}
              errors={errors}
              getValues={getValues}
              setValue={setValue}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <ServiceDateForm control={control} errors={errors} watch={watch} setValue={setValue} />
          </Grid>
        </Grid>
        <div style={{ margin: '20px auto', width: '40%', minWidth: 'fit-content' }}>
          <Button variant="contained" type="submit" fullWidth color="primary">
            Continue to order summary
          </Button>
        </div>
      </form>
    </Layout>
  );
}
