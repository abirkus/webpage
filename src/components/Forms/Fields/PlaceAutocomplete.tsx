import { TextField, Grid, Typography, Autocomplete, Box } from '@mui/material';
import React from 'react';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { getGeocode, getZipCode } from 'use-places-autocomplete';
import { Controller } from 'react-hook-form';

const autocompleteService = { current: null };

interface MainTextMatchedSubstrings {
  offset: number;
  length: number;
}
interface StructuredFormatting {
  main_text: string;
  secondary_text: string;
  main_text_matched_substrings: readonly MainTextMatchedSubstrings[];
}
interface PlaceType {
  description: string;
  structured_formatting: StructuredFormatting;
}
const PlacesAutocomplete = ({ labelField, control, fieldName, required, errors }: any) => {
  const [value, setValue] = React.useState<PlaceType | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState<readonly PlaceType[]>([]);

  const fetch = React.useMemo(
    () =>
      throttle(
        (
          request: { input: string; componentRestrictions: { country: 'us' }; language: 'en' },
          callback: (results?: readonly PlaceType[]) => void,
        ) => {
          (autocompleteService.current as any).getPlacePredictions(request, callback);
        },
        200,
      ),
    [],
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && (window as any).google) {
      autocompleteService.current = new (window as any).google.maps.places.AutocompleteService({
        componentRestrictions: { country: 'us' },
        language: 'en',
      });
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch(
      { input: inputValue, componentRestrictions: { country: 'us' }, language: 'en' },
      (results?: readonly PlaceType[]) => {
        if (active) {
          let newOptions: readonly PlaceType[] = [];

          if (value) {
            newOptions = [value];
          }

          if (results) {
            newOptions = [...results, ...newOptions];
          }
          setOptions(newOptions);
        }
      },
    );

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Controller
      name={fieldName}
      control={control}
      defaultValue={null}
      rules={{ required }}
      render={({ field }) => (
        <Autocomplete
          {...field}
          fullWidth
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
          filterOptions={(x) => x}
          options={options}
          autoComplete
          includeInputInList
          filterSelectedOptions
          value={value}
          onChange={(event: any, newValue: any | null) => {
            setOptions(newValue ? [newValue, ...options] : options);

            const address = newValue?.description;
            newValue
              ? getGeocode({ address }).then((results) => {
                  const zipCode = getZipCode(results[0], false);
                  newValue.description = `${newValue?.description}, ${zipCode}`;
                  setValue(newValue);
                  field.onChange(newValue?.description);
                })
              : setValue(newValue),
              field.onChange(newValue?.description);
          }}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={labelField}
              value={value}
              fullWidth
              error={Boolean(errors[fieldName])}
            />
          )}
          renderOption={(props, option) => {
            const matches = option.structured_formatting.main_text_matched_substrings;
            const parts = parse(
              option.structured_formatting.main_text,
              matches.map((match: any) => [match.offset, match.offset + match.length]),
            );

            return (
              <li {...props}>
                <Grid container alignItems="center">
                  <Grid item>
                    <Box component={LocationOnIcon} sx={{ color: 'text.secondary', mr: 2 }} />
                  </Grid>
                  <Grid item xs>
                    {parts.map((part: any, index: any) => (
                      <span
                        key={index}
                        style={{
                          fontWeight: part.highlight ? 700 : 400,
                        }}
                      >
                        {part.text}
                      </span>
                    ))}
                    <Typography variant="body2" color="text.secondary">
                      {option.structured_formatting.secondary_text}
                    </Typography>
                  </Grid>
                </Grid>
              </li>
            );
          }}
        />
      )}
    />
  );
};

export default PlacesAutocomplete;
