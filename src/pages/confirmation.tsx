import React from 'react';
import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import Layout from '../components/Layout/Layout';
import * as gtag from '../lib/gtag';
import Cookies from 'js-cookie';

export type UserInfo = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

const formatPhoneNumber = (phoneNumberString: string) => {
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = match[1] ? '+1 ' : '';
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return null;
};
const Confirmation = () => {
  const [info, setCustomerInfo] = React.useState<UserInfo>();
  const [unknownUser, setUnknownUser] = React.useState(true);
  useEffect(() => {
    gtag.pageviewAds('/confirmation');
    const cookie = Cookies.get('shippingAddress');
    if (cookie) {
      const data = JSON.parse(cookie);
      setCustomerInfo({
        firstName: data.firstName as string,
        lastName: data.lastName as string,
        email: data.email as string,
        phone: data.phoneNumber as string,
      });
      setUnknownUser(false);
    } else {
      setUnknownUser(false);
    }
  }, []);

  return (
    <Layout title="Confirmation">
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          padding: '50px 0 50px 0',
        }}
      >
        {!unknownUser ? (
          <>
            <Typography variant="h4" component="h4" fontWeight="bold" textAlign={'center'}>
              Hey, {info?.firstName} {info?.lastName}!!!
            </Typography>
            <br />
            <Typography variant="h6" component="h6" fontWeight="normal" textAlign={'center'}>
              Thank you for booking! You will receive a confirmation to your email
              <b> {info?.email}</b> and we will also message you to your number
              <b> {formatPhoneNumber(info?.phone || '')} </b>
              to answer your questions and coordinate everything.
            </Typography>
          </>
        ) : (
          <Typography variant="h4" component="h4" fontWeight="bold" textAlign={'center'}>
            Hooray!!! We received your order and will be reaching out to you shortly.
          </Typography>
        )}
        <Box sx={{ display: 'relative', width: '60%' }}>
          <Image
            src="/images/home/happy-mechanic.png"
            alt="empty cart"
            layout="responsive"
            width={400}
            height={600}
            priority
          />
        </Box>
      </Box>
      <input type="hidden" name="firstName" value={info?.firstName || ''} />
      <input type="hidden" name="lastName" value={info?.lastName || ''} />
      <input type="hidden" name="email" value={info?.email || ''} />
      <input type="hidden" name="phone" value={info?.phone || ''} />
    </Layout>
  );
};

export default Confirmation;
