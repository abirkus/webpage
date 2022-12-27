import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { fieldLabelsUI } from '../../../utils/helperFunctions';
import { OrderDetailsType } from '../../../utils/types';
import { Store } from '../../../utils/Store';
import moment from 'moment';
import { CardShadow } from 'components/StyledBaseComponents/CardShadow';
import Cookies from 'js-cookie';

export const CustomerDetailsSummary: React.FC = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { shippingAddress, cartItems, carSize } = state;

  const editCustomerInfo = () => {
    router.push('/orderdetails');
  };

  if (shippingAddress.dropoffDate === undefined || shippingAddress.pickupDate === undefined) {
    const dropoffDate = JSON.parse(Cookies.get('shippingAddress') as string).dropoffDate;
    const pickupDate = JSON.parse(Cookies.get('shippingAddress') as string).pickupDate;
    shippingAddress.dropoffDate = moment(dropoffDate);
    shippingAddress.pickupDate = moment(pickupDate);
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        cartItems,
        carSize,
        ...shippingAddress,
      },
    });
  }

  return (
    <>
      <CardShadow>
        <Typography variant="h4" component="h4" margin="10px">
          Customer Details Summary
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              {Object.keys(shippingAddress).reduce<React.ReactNode[]>((tableRows, key) => {
                const value = shippingAddress[key as keyof OrderDetailsType];
                if (value && fieldLabelsUI[key as keyof typeof fieldLabelsUI]) {
                  tableRows.push(
                    <TableRow key={key}>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        {fieldLabelsUI[key as keyof typeof fieldLabelsUI]}
                      </TableCell>
                      <TableCell sx={{ color: 'dimgray' }}>
                        {typeof value === 'string' || typeof value === 'number'
                          ? value
                          : 'Model' in value
                          ? value.Model
                          : moment(value).format('MM-DD-YY HH:00')}
                      </TableCell>
                    </TableRow>,
                  );
                }
                return tableRows;
              }, [])}
            </TableBody>
          </Table>
        </TableContainer>
      </CardShadow>
      <Button
        onClick={editCustomerInfo}
        variant="outlined"
        color="primary"
        fullWidth
        sx={{ marginTop: '20px' }}
      >
        Edit customer info
      </Button>
    </>
  );
};
