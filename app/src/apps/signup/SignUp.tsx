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
import useSignUp from "./useSignUp";

const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    transition: "transform 0.2s ease-in-out",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.12)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#36B37E",
    },
    "&:hover": {
      transform: "translateY(-2px)",
    },
    "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px #1A1A1E inset",
      WebkitTextFillColor: "#fff",
      caretColor: "#fff",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
    "&.Mui-focused": {
      color: "#36B37E",
    },
  },
  "& .MuiInputBase-input": {
    color: "#fff",
  },
};

const SignUp = () => {
  const { formData, formErrors, handleChange, handleSubmit } = useSignUp();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "#121214",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url(\'data:image/svg+xml,%3Csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h1v1H0z" fill="rgba(255,255,255,0.03)"%3E%3C/path%3E%3C/svg%3E\')',
          opacity: 0.3,
        },
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper
          elevation={24}
          sx={{
            marginTop: 8,
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "#1A1A1E",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 2,
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-4px)",
            },
          }}
        >
          <Avatar
            sx={{
              m: 1,
              bgcolor: "#36B37E",
              width: 56,
              height: 56,
              boxShadow: "0 0 20px rgba(54, 179, 126, 0.3)",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            sx={{
              mb: 3,
              fontWeight: 600,
              color: "#fff",
            }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ width: "100%" }}
          >
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
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
                error={!!formErrors.firstname}
                helperText={formErrors.firstname}
                sx={textFieldStyles}
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
                error={!!formErrors.lastname}
                helperText={formErrors.lastname}
                sx={textFieldStyles}
              />
            </Box>
            <TextField
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              sx={{ ...textFieldStyles, mb: 3 }}
              value={formData.username}
              onChange={handleChange}
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
              sx={{ ...textFieldStyles, mb: 3 }}
              value={formData.password}
              onChange={handleChange}
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
              sx={{ ...textFieldStyles, mb: 3 }}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 3,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                backgroundColor: "#36B37E",
                boxShadow: "0 0 20px rgba(54, 179, 126, 0.3)",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#2C9066",
                  transform: "translateY(-2px)",
                  boxShadow: "0 0 25px rgba(54, 179, 126, 0.5)",
                },
              }}
            >
              Sign Up
            </Button>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Link
                href="/"
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.7)",
                  textDecoration: "none",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    color: "#36B37E",
                    transform: "translateY(-2px)",
                    textDecoration: "none",
                  },
                }}
              >
                Already have an account? Sign in
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignUp;
