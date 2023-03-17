import React, { useEffect, useState } from 'react';
import { Control, FieldErrors, FieldValues, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { List, ListItem, Typography } from '@mui/material';
import { CarMake, carDatabaseApi, CarModel } from 'apiWrappers/carDatabaseApi';
import ControlledInputField from './Fields/ControlledInputField';
import ControlledRadioGroupField from './Fields/ControlledRadioGroupField';
import ControlledAutocompleteField, {
  AutoCompleteProps,
} from './Fields/ControlledAutoCompleteField';

interface CarInformationFromProps {
  control: Control;
  errors: FieldErrors;
  watch: UseFormWatch<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
}

export const CarInformationFrom: React.FC<CarInformationFromProps> = ({
  control,
  errors,
  watch,
  setValue,
}) => {
  const [watchCarYear, watchCarMake, watchCarModel] = watch(['carYear', 'carMake', 'carModel']);
  const [carMakes, setCarMakes] = useState<CarMake[]>([]);
  const [carModels, setCarModels] = useState<CarModel[]>([]);
  const [carYears, setCarYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    carDatabaseApi.getAllMakes().then((carMakes) => {
      setCarMakes(carMakes);
      setLoading(false);
    });
    carDatabaseApi.getAllYears().then((years) => {
      setCarYears(years);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const fetchCarModels = async () => {
      if (watchCarYear && watchCarMake) {
        carDatabaseApi.getAllModels(watchCarMake, watchCarYear).then((carModels) => {
          setCarModels(carModels);
          if (
            watchCarModel &&
            !carModels.find((carModel) => carModel.Model === watchCarModel.Model)
          ) {
            setValue('carModel', null);
          }
        });
      }
    };

    setLoading(true);
    fetchCarModels().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchCarYear, watchCarMake]);

  const vehicleFields: AutoCompleteProps<string | CarModel>[] = [
    {
      fieldName: 'carYear',
      fieldLabel: 'Car Year',
      options: carYears,
    },
    {
      fieldName: 'carMake',
      fieldLabel: 'Car Make',
      options: carMakes,
      disabled: !Boolean(watchCarYear),
    },
    {
      fieldName: 'carModel',
      fieldLabel: 'Car Model',
      options: carModels,
      disabled: !Boolean(watchCarMake),
      labelOptions: {
        getOptionLabel: (option) => (option as CarModel).Model,
        isOptionEqualToValue: (option, value) =>
          (option as CarModel).Model === (value as CarModel).Model,
      },
    },
  ];

  const vehicleDetails = [
    { fieldName: 'carColor', fieldLabel: 'Paint Color' },
    { fieldName: 'vin', fieldLabel: 'Vin Number' },
  ];
  return (
    <>
      <Typography variant="h4" component="h4">
        Car Information
      </Typography>
      <List>
        {vehicleFields.map((field) => (
          <ListItem key={`vehicle-info-input-${field.fieldName}`}>
            <ControlledAutocompleteField
              control={control}
              errors={errors}
              loading={loading}
              required
              {...field}
            />
          </ListItem>
        ))}

        {vehicleDetails.map((field) => (
          <ListItem key={`vehicle-info-input-${field.fieldName}`}>
            <ControlledInputField
              control={control}
              errors={errors}
              fieldName={field.fieldName}
              fieldLabel={field.fieldLabel}
            />
          </ListItem>
        ))}
        <ListItem>
          <ControlledRadioGroupField
            control={control}
            fieldName={'transmission'}
            fieldLabel={'Transmission'}
            options={[
              { label: 'Automatic', value: 'automatic' },
              { label: 'Manual', value: 'manual' },
            ]}
          />
        </ListItem>
      </List>
    </>
  );
};
