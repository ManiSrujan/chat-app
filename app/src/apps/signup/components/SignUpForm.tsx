import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Link,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ISignUpFormData } from "../validation";
import { IFormErrors } from "../../../hooks/useFormValidation";

interface ISignUpFormProps {
  formData: ISignUpFormData;
  formErrors: IFormErrors;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const SignUpForm = ({
  formData,
  formErrors,
  handleChange,
  handleBlur,
  handleSubmit,
}: ISignUpFormProps) => {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3, width: "100%" }}
        >
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              autoComplete="given-name"
              name="firstname"
              required
              fullWidth
              id="firstname"
              label="First Name"
              autoFocus
              value={formData.firstname}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.firstname}
              helperText={formErrors.firstname}
            />
            <TextField
              required
              fullWidth
              id="lastname"
              label="Last Name"
              name="lastname"
              autoComplete="family-name"
              value={formData.lastname}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!formErrors.lastname}
              helperText={formErrors.lastname}
            />
          </Box>
          <TextField
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            sx={{ mb: 2 }}
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!formErrors.username}
            helperText={formErrors.username}
          />
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            sx={{ mb: 2 }}
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!formErrors.password}
            helperText={formErrors.password}
          />
          <TextField
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            sx={{ mb: 2 }}
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!formErrors.confirmPassword}
            helperText={formErrors.confirmPassword}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2 }}
          >
            Sign Up
          </Button>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Link href="/" variant="body2">
              Already have an account? Sign in
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};
