// Import necessary components, hooks, and icons from Material-UI and React
import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Select,
  Typography,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  Message,
  LightMode,
  DarkMode,
  Notifications,
  Help,
  Close,
  Menu,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import zIndex from "@mui/material/styles/zIndex";

// Define the Navbar functional component
const Navbar = () => {
  // State variable for controlling mobile menu visibility
  const [isMobileMenuToggled, setisMobileMenuToggled] = useState(false);

  // Redux hooks for dispatch and selecting user state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  // Media query hook to check if screen width is above a certain value
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  // Theme and color constants from Material-UI
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;

  // Construct user's full name
  const fullName = `${user.firstName} ${user.lastName}`;

  // Render JSX for Navbar component
  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      {/* Logo and Search bar */}
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem,2rem,2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": { color: primaryLight, cursor: "pointer" },
          }}
        >
          ConnectVerse
        </Typography>
        {/* Search bar only visible on non-mobile screens */}
        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>

      {/* Desktop navigation icons and user dropdown */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          {/* Toggle between light and dark mode */}
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>

          {/* Message icon */}
          <Message sx={{ fontSize: "25px" }} />

          {/* Notifications icon */}
          <Notifications sx={{ fontSize: "25px" }} />

          {/* Help icon */}
          <Help sx={{ fontSize: "25px" }} />

          {/* User dropdown */}
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              {/* Logout option */}
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        // Mobile menu toggle icon
        <IconButton
          onClick={() => setisMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* Mobile navigation menu */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* Close icon for mobile menu */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setisMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
