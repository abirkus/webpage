import { List, ListItem, Typography, Checkbox, FormControlLabel } from '@mui/material';
import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import ControlledInputField from './Fields/ControlledInputField';
import PlacesAutocomplete from './Fields/PlaceAutocomplete';

interface AddressFormProps {
  control: Control;
  errors: FieldErrors;
  getValues: (key: string) => void;
  setValue: (key: string, value: any) => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  control,
  errors,
  getValues,
  setValue,
}) => {
  const [isSameDropOffLocation, setIsSameDropOffLocation] = React.useState(false);

  return (
    <>
      <Typography variant="h4" component="h4">
        Pickup & Drop-Off Location
      </Typography>
      <List>
        <ListItem>
          <PlacesAutocomplete
            labelField={'Pick Up Location'}
            fieldName="pickupLocation"
            required
            control={control}
            errors={errors}
          />
        </ListItem>
        <ListItem>
          <FormControlLabel
            control={
              <Checkbox
                checked={isSameDropOffLocation}
                onChange={() => {
                  setIsSameDropOffLocation(!isSameDropOffLocation);
                  if (!isSameDropOffLocation) {
                    const pickupLocation = getValues('pickupLocation');
                    setValue('dropoffLocation', pickupLocation);
                  } else {
                    setValue('dropoffLocation', null);
                  }
                }}
                name="sameLocation"
              />
            }
            label="Drop off location the same as pick up"
          />
        </ListItem>
        {!isSameDropOffLocation && (
          <ListItem>
            <PlacesAutocomplete
              labelField={'Drop Off Location'}
              fieldName="dropoffLocation"
              required
              control={control}
              errors={errors}
            />
          </ListItem>
        )}
        <ListItem>
          <ControlledInputField
            control={control}
            errors={errors}
            required
            minLength={3}
            fieldName="logisticComments"
            fieldLabel="Location Comments"
            customRules={{
              required: false,
              minLength: undefined,
            }}
            extraProps={{
              multiline: true,
              minRows: 2,
            }}
          />
        </ListItem>
      </List>
    </>
  );
};
