/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { Grid, Box, Button, Accordion, AccordionSummary, AccordionDetails, Typography, Container, ImageList, ImageListItem, List, ListItem } from '@mui/material';
import LocalCarWashIcon from '@mui/icons-material/LocalCarWash';
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';
import serviceArray from '../../data/services.json';
import serviceImagesArray from '../../data/serviceImages.json';
import ServiceCard from '../../components/ServiceCards/ServiceCard';
import axios from 'axios';
import { ServiceType } from '../../../utils/types';
import Loader from '../../../public/images/general/loader.svg';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IMaskInput } from 'react-imask';
import ControlledInputField from '../../components/Forms/Fields/ControlledInputField';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

const serviceCategoryName = 'WASH & DETAILING';
const icon = <LocalCarWashIcon key="local-car-wash-icon" />;
let imageData: any[] = [];

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const TextMaskCustom = React.forwardRef<HTMLElement, CustomProps>(function TextMaskCustom(
    props,
    ref,
) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            //@ts-no-check Incorrect type declaration in library, no fix at time of import
            mask={'(000) 000-0000'}
            unmask={true}
            inputRef={ref as any}
            onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    );
});

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

interface ServiceBlock {
    category: string;
    services: ServiceType[];
}

const mergeServices = (adminServices: Service[]) => {
    const servicesBlockData = serviceArray.find((svc) => svc.category.includes(serviceCategoryName));
    imageData = serviceImagesArray.find((svc) => svc.category.includes(serviceCategoryName))?.images ?? [];

    servicesBlockData?.services.map((service: any) => {
        const adminService = adminServices.find((it) => it.id === service.id);

        service.shortDescription = adminService?.short_description;
        service.longDescription = adminService?.long_description;
        service.duration = adminService?.duration;
        service.prices = adminService?.price_customer;
        service.name = adminService?.name;
        service.isShowUser = adminService?.is_show_user;

        return service;
    });

    const serviceBlock: any = {
        category: servicesBlockData?.category || '',
        services: servicesBlockData?.services.filter((service: any) => service.isShowUser) || [],
    };

    return serviceBlock;
};

const Protection = () => {
    const [service, setService] = React.useState<ServiceBlock>({ category: '', services: [] });
    const [isLoading, setLoading] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        mode: 'onBlur',
        reValidateMode: 'onBlur',
    });

    const customerFields = [
        {
            fieldName: 'name',
            fieldLabel: 'Name',
        },
        {
            fieldName: 'phoneNumber',
            fieldLabel: 'Phone Number',
            extraProps: {
                InputProps: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    inputComponent: TextMaskCustom as any,
                },
            },
            rules: {
                minLength: 10,
            },
            helperText: {
                minLength: undefined,
            },
        },
        {
            fieldName: 'email',
            fieldLabel: 'Email',
            extraProps: { inputProps: { type: 'email' } },
            rules: {
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
            },
        },
    ];

    const openCallbackPopup = () => {
        setOpenDialog(true);
    };

    const closeCallbackPopup = () => {
        setOpenDialog(false);
    };

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            setLoading(true);
            const requestData = {
                serviceCategory: serviceCategoryName,
                customerInformation: {
                    name: data.name,
                    phoneNumber: data.phoneNumber,
                    email: data.email
                },
                orderHash: uuidv4()
            };
            await axios.post('/api/newServiceOrder', requestData);
            closeCallbackPopup();
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (service.services.length === 0) {
            const fetchServices = async () => {
                setLoading(true);

                const { data } = await axios.get('/api/getServices');
                return data;
            };

            fetchServices().then((data) => {
                const servicesInCategory = mergeServices(data);

                setService(servicesInCategory);
                setLoading(false);
            });
        }
    });

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
            <Grid container
                justifyContent="center"
                sx={{ padding: '25px 0 0 0' }}
                style={{
                    marginTop: '40px'
                }}>
                <Accordion
                    key={'service-accordion'}
                    expanded={true}
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
                            {icon}
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

                <Container
                    style={{
                        padding: '0',
                        maxWidth: '100%',
                        marginTop: '30px',
                        marginBottom: '30px'
                    }}>
                    <Typography
                        variant="h4"
                        align="left"
                        gutterBottom
                        component="div"
                        padding="0"
                    >
                        Some text
                    </Typography>

                    <Typography gutterBottom component="div" align="left" >
                        It all started with a personal problem of finding a reliable mechanic and taking a car for
                        service in Chicago. Carrectly became a solution: a team that solves these universal
                        hassles for others. We believe in innovation, simplicity and convenience and we resolve to
                        reinvent the auto service industry.
                    </Typography>
                    <Typography gutterBottom component="div" align="left">
                        With more available technology and less free time, people's expectations for quality and
                        simplicity are higher than ever. Yet, the auto maintenance experience continues to lag
                        behind. From professional highly-trained mechanics to the best auto detailers - we can
                        guarantee the best quality service there can be. We do it all: hand car washes, car
                        detailing, auto upholstery, mechanical shop repairs, auto body repairs, ceramic coating,
                        paint protection film, tints, and more!
                    </Typography>
                    <Typography gutterBottom component="div" align="left">
                        Carrectly uses research, technology, and logistics to fix the lack of transparency and
                        convenience of the auto maintenance business. We provide top-notch service for customers
                        who value their time - one pickup, fantastic service, fair price, and drop-off at a time.
                    </Typography>
                </Container>

                <Button variant="outlined" onClick={openCallbackPopup}
                    style={{
                        color: 'black',
                        textTransform: 'none',
                        display: 'block',
                        borderRadius: '10px',
                        borderWidth: '5px',
                        marginBottom: '30px'
                    }}>
                    <Box style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <TouchAppOutlinedIcon style={{ fontSize: "40px" }} />
                        Same-Day Service, FREE Pick-Up
                    </Box>
                    <Typography gutterBottom component="div" align="center" color="green">
                        tel:+17738009085
                    </Typography>
                </Button>

                <Dialog open={openDialog} onClose={closeCallbackPopup} fullWidth={true} maxWidth="md">
                    <form onSubmit={handleSubmit(onSubmit)} id="callback-form">

                        <DialogTitle>Contact information</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Please, provide your personal information.
                            </DialogContentText>
                            <List>
                                {customerFields.map((field) => (
                                    <ListItem key={`customer-input-${field.fieldName}`}>
                                        <ControlledInputField
                                            control={control}
                                            errors={errors}
                                            required
                                            minLength={2}
                                            fieldName={field.fieldName}
                                            fieldLabel={field.fieldLabel}
                                            customRules={field.rules}
                                            extraProps={field.extraProps}
                                            customHelperText={field.helperText}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeCallbackPopup}>Cancel</Button>
                            <Button type="submit">Send</Button>
                        </DialogActions>
                    </form>

                </Dialog>

                <Container
                    style={{
                        padding: '0',
                        maxWidth: '100%',
                        marginTop: '30px',
                        marginBottom: '30px'
                    }}>
                    <ImageList sx={{ width: 1250, height: 620, margin: 'auto' }} cols={6} rowHeight={200} gap={10}>
                        {imageData.map((item) => (
                            <ImageListItem key={item.title}>
                                <img
                                    src={`${item.img}?w=200&h=200&fit=crop&auto=format`}
                                    srcSet={`${item.img}?w=200&h=200&fit=crop&auto=format&dpr=2 2x`}
                                    alt={item.title}
                                    loading="lazy"
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </Container>

                <div id="yelp-reviews">
                    <script src="https://static.elfsight.com/platform/platform.js" data-use-service-core defer></script>
                    <div className="elfsight-app-8bab5833-8478-4142-9f87-b935d090c370"></div>
                </div>
            </Grid>
        </Layout>
    );
};

export default Protection;
