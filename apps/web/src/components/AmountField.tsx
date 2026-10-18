import TextField, { type TextFieldProps } from '@mui/material/TextField';
import { evaluateAmount } from '../utils/amount';
import { useTranslation } from '../hooks/useTranslation';

/** Keep the expression editable; only the calculated number is sent to the API. */
export default function AmountField(props: TextFieldProps) {
  const { t } = useTranslation();
  const input = String(props.value ?? '');
  const value = evaluateAmount(input);
  const invalid = input.trim() !== '' && (!Number.isFinite(value) || value < 0);
  const result = Number.isFinite(value) && !invalid
    ? `= ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : t.amount.hint;
  return (
    <TextField
      {...props}
      type="text"
      inputProps={{ ...props.inputProps, inputMode: 'text', maxLength: 200 }}
      error={props.error || invalid}
      helperText={invalid ? t.amount.invalid : (props.helperText ?? result)}
    />
  );
}
