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
import useSignIn from "./useSignIn";

const SignIn = () => {
  const { formData, formErrors, handleChange, handleBlur, handleSubmit } =
    useSignIn();

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
          Sign in
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3, width: "100%" }}
        >
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
            autoFocus
            variant="outlined"
          />
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            sx={{ mb: 2 }}
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!formErrors.password}
            helperText={formErrors.password}
            variant="outlined"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 2 }}
          >
            Sign In
          </Button>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Link href="/signup" variant="body2">
              Don't have an account? Sign up
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignIn;
