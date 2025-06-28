import { Box, IconButton, Text, TextField } from "@radix-ui/themes";
import { RootProps } from "@radix-ui/themes/components/text-field";
import { forwardRef, ReactElement } from "react";

interface IFormField extends React.PropsWithoutRef<RootProps> {
  label: string;
  icon?: ReactElement;
  onIconClick?: () => void;
  error?: string;
}

const FormField = forwardRef<React.ElementRef<"input">, IFormField>(
  (props, ref): JSX.Element => {
    const { label, error, icon, onIconClick, ...restProps } = props;

    return (
      <Box>
        <Text as="div" weight="medium" size="2" mb="1">
          {label}
        </Text>
        <TextField.Root autoComplete="off" {...restProps} ref={ref}>
          {icon ? (
            <TextField.Slot side="right">
              <IconButton variant="ghost" mr="1" onClick={onIconClick}>
                {icon}
              </IconButton>
            </TextField.Slot>
          ) : null}
        </TextField.Root>
        {error ? (
          <Text as="div" weight="light" size="1" mt="1" color="red">
            {error}
          </Text>
        ) : null}
      </Box>
    );
  },
);

export default FormField;
