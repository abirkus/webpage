/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { Grid, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarIcon from '@mui/icons-material/Star';
import LocalCarWashIcon from '@mui/icons-material/LocalCarWash';
import BuildIcon from '@mui/icons-material/Build';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import CarRentalIcon from '@mui/icons-material/CarRental';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import serviceArray from '../data/services.json';
import ServiceCard from '../components/ServiceCards/ServiceCard';
import axios from 'axios';
import { ServiceType } from '../../utils/types';
import Loader from '../../public/images/general/loader.svg';

const iconsArr = [
  <StarIcon key="star-icon" />,
  <LocalCarWashIcon key="local-car-wash-icon" />,
  <BuildIcon key="build-icon" />,
  <DirectionsCarIcon key="directions-car-icon" />,
  <AirlineSeatReclineExtraIcon key="airline-seat-icon" />,
  <AspectRatioIcon key="aspect-ratio-icon" />,
  <CarRepairIcon key="car-repair-icon" />,
  <Inventory2Icon key="inventory2-icon" />,
  <CarRentalIcon key="car-rental-icon" />,
];

interface Service {
  id: number;
  name: string;
  price: string;
  price_customer?: string[];
  duration?: string;
  description: string;
  is_show_user: boolean;
  short_description: string;
  long_description: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ServiceList {
  category: string;
  services: ServiceType[];
}

const mergeServices = (admin_services: Service[]) => {
  const array_of_services = serviceArray.map((block: any) => {
    block.services.map((service: any) => {
      service.shortDescription = admin_services.find(
        (it) => it.id === service.id,
      )?.short_description;
      service.longDescription = admin_services.find((it) => it.id === service.id)?.long_description;
      service.duration = admin_services.find((it) => it.id === service.id)?.duration;
      service.prices = admin_services.find((it) => it.id === service.id)?.price_customer;
      service.name = admin_services.find((it) => it.id === service.id)?.name;
      service.isShowUser = admin_services.find((it) => it.id === service.id)?.is_show_user;
      return service;
    });
    return block;
  });
  const filteredArr = array_of_services.map((block: any) => {
    return {
      category: block.category,
      services: block.services.filter((service: any) => service.isShowUser === true),
    };
  });
  return filteredArr;
};

const Services = () => {
  const [expanded, setExpanded] = React.useState<string | false>('MOST POPULAR');
  const [data, setData] = React.useState<ServiceList[]>([]);
  const [isLoading, setLoading] = React.useState(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    if (data.length === 0) {
      const fetchServices = async () => {
        setLoading(true);
        const { data } = await axios.get('/api/getServices');
        return data;
      };

      fetchServices().then((data) => {
        const new_arr = mergeServices(data);
        setData(new_arr);
        setLoading(false);
      });
    }
  }, []);

  if (isLoading)
    return (
      <Layout>
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Loader />
        </div>
      </Layout>
    );

  return (
    <Layout>
      <Grid container justifyContent="center" sx={{ padding: '25px 0 0 0' }}>
        {data.map((service, index) => (
          <Accordion
            key={`accordiong_id_${index}`}
            expanded={expanded === service.category}
            onChange={handleChange(service.category)}
            sx={{
              width: '90vw',
              margin: '10px',
              '.Mui-expanded': {
                backgroundColor: '#743794',
                color: 'white',
                ':hover': {
                  backgroundColor: '#743794',
                },
              },
            }}
          >
            <AccordionSummary
              sx={{
                backgroundColor: '#e6e6e6',
                flexDirection: 'row',
                ':hover': {
                  backgroundColor: '#dddd',
                },
              }}
              expandIcon={<ExpandMoreIcon color="inherit" />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Box
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: '2rem',
                  },
                }}
              >
                {iconsArr[index]}
              </Box>
              <Box
                sx={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  letterSpacing: '.1rem',
                }}
              >
                {service.category}
              </Box>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-evenly',
              }}
            >
              {service.services.map((el, i) => (
                <ServiceCard serviceObject={el} key={`service-card-id-${i}`} />
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Grid>
    </Layout>
  );
};

export default Services;
