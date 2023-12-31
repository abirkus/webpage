import React, { useCallback } from 'react';
import moment, { Moment } from 'moment';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { DatePicker } from 'antd';
import { Box, Typography } from '@mui/material';
import { timeSlot } from 'apiWrappers/schedulingApi';
import { tz } from 'moment-timezone';

interface ControlledDatePickerFieldProps {
  fieldName: string;
  fieldLabel: string;
  control: Control;
  errors: FieldErrors;
  required?: boolean;
  disabled?: boolean;
  startDate?: Moment;
  disabledTimes?: timeSlot[];
}

function range(start: number, end: number) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

function isSameDayAndMonth(m1: any) {
  return m1?.date() === 26 && m1?.month() === 12;
}

const ControlledDatePickerField: React.FC<ControlledDatePickerFieldProps> = ({
  control,
  errors,
  fieldName,
  fieldLabel,
  required,
  startDate = moment(),
  disabled,
  disabledTimes = [],
}) => {
  const disabledDate = useCallback(
    (date: Moment) => {
      const disabledDates = [ { day: 26, month: 12 }, { day: 29, month: 5, year: 2023 } ];
      const dateToCheck = date.clone().set({ hour: startDate.hour(), minute: 10, second: 0 });

      const sameDate = (disableDate: any) => 
            dateToCheck.date() === disableDate.day &&
            dateToCheck.month() === disableDate.month - 1 &&
            (!disableDate.year || dateToCheck.year() === disableDate.year);

      return (
         disabledDates.some(sameDate) ||
         dateToCheck.weekday() === 0 ||
         dateToCheck < startDate.clone().startOf('day') ||
         (dateToCheck.isSame(startDate, 'day') && dateToCheck > startDate.clone().set({ hour: 16, minute: 0, second: 0 }))
        );
    },
    [startDate],
  );

  const disabledTime = useCallback(
    (date: Moment | null) => {
      const disabledTimeSlots = disabledTimes.reduce((accumulator: number[], timeSlot) => {
        if (date && date.isSame(timeSlot.hour, 'day')) {
          accumulator.push(Number(moment(timeSlot.hour).format('HH')));
        }
        return accumulator;
      }, []);
      if (date?.weekday() === 0) {
        return {
          disabledHours: () => [...range(0, 24)],
        };
      }
      if (date && date.isSame(startDate, 'day')) {
        return {
          disabledHours: () => [
            ...range(0, startDate.clone().add(150, 'minutes').startOf('hour').hour()),
            ...range(18, 24),
            ...disabledTimeSlots,
          ],
        };
      }

      return {
        disabledHours: () => [...range(0, 8), ...range(18, 24), ...disabledTimeSlots],
      };
    },
    [startDate, disabledTimes],
  );

  tz.setDefault('America/Chicago');

  return (
    <Controller
      control={control}
      name={fieldName}
      rules={{ required }}
      render={({ field }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <DatePicker
            placement="topLeft"
            format="YYYY-MM-DD HH:00"
            placeholder={`Select desired ${fieldLabel}`}
            disabled={disabled}
            showTime={{
              defaultValue: moment('00:00', 'HH:00'),
              showHour: true,
              format: 'HH:00',
              hideDisabledOptions: true,
            }}
            showNow={false}
            disabledDate={disabledDate}
            disabledTime={disabledTime}
            style={{
              padding: '16.5px 14px',
              borderColor: Boolean(errors[fieldName]) ? '#ff1744' : '',
              borderRadius: '4px',
            }}
            size="large"
            {...field}
          />
          {errors[fieldName]?.message === 'incorrect_time' && Boolean(errors[fieldName]) ? (
            <Typography
              sx={{
                color: '#ff1744',
                fontSize: '0.75rem',
                margin: '3px 14px 0px',
              }}
            >
              {`You need to select right time for ${fieldLabel
                .substring(0, fieldLabel.length - 4)
                .toLowerCase()}`}
            </Typography>
          ) : (
            Boolean(errors[fieldName]) && (
              <Typography
                sx={{
                  color: '#ff1744',
                  fontSize: '0.75rem',
                  margin: '3px 14px 0px',
                }}
              >{`${
                fieldLabel.charAt(0).toUpperCase() + fieldLabel.slice(1)
              } is required`}</Typography>
            )
          )}
        </Box>
      )}
    />
  );
};

export default ControlledDatePickerField;
