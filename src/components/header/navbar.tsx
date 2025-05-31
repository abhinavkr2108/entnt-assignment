import React, { useState } from "react";
import { useAuth } from "../../context/auth-context";
import { Link, useNavigate } from "react-router"; // Use react-router-dom for Link and useNavigate
import { BellIcon, CircleX, MenuIcon, XIcon } from "lucide-react";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Box, // Use Box for flexible layout
  Button, // For login/logout
  Typography,
  Paper,
  Divider, // For text like ENTNT
} from "@mui/material";
import { useData } from "../../context/data-context";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { user, isAdminOrStaff, isAuthenticated, isCustomer, logout } =
    useAuth();

  const { appData, deleteNotification } = useData();
  const navigate = useNavigate();

  const navLinks = [];

  if (isAdminOrStaff) {
    navLinks.push({
      to: "/dashboard",
      label: "Dashboard",
      roles: ["Admin", "Staff"],
    });
    navLinks.push({
      to: "/equipments",
      label: "Equipments",
      roles: ["Admin", "Staff"],
    });
    navLinks.push({
      to: "/maintenance",
      label: "Maintenance",
      roles: ["Admin", "Staff"],
    });
    navLinks.push({
      to: "/rentals",
      label: "Rentals",
      roles: ["Admin", "Staff"],
    });
    navLinks.push({
      to: "/calendar",
      label: "Calendar",
      roles: ["Admin", "Staff"],
    }); // Add calendar link
  }
  if (isCustomer) {
    navLinks.push({
      to: "/my-rentals",
      label: "My Rentals",
      roles: ["Customer"],
    });
    navLinks.push({
      to: "/equipment-catalog",
      label: "Browse Equipment",
      roles: ["Customer"],
    });
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleDrawer = (open: boolean) => () => {
    setIsMenuOpen(open);
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id);
  };

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 8 }, // Responsive padding
        py: 2,
        maxWidth: "screen-xl", // Tailwind class converted to MUI equivalent if needed
        mx: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Logo/Brand */}
      <Typography
        variant="h6"
        component={Link}
        to={isAuthenticated ? "/dashboard" : "/"}
        sx={{
          ml: 2,
          fontWeight: "bold",
          letterSpacing: "0.025em", // tracking-wide
          color: "text.primary", // text-gray-800
          textTransform: "uppercase",
          textDecoration: "none", // Remove underline from Link
        }}
      >
        ENTNT
      </Typography>

      {/* Desktop Navigation */}
      <Box sx={{ display: { xs: "none", lg: "flex" }, alignItems: "center" }}>
        <List sx={{ display: "flex", p: 0 }}>
          {navLinks.map(
            (link, index) =>
              user &&
              link.roles.includes(user.role) && (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={link.to}
                    sx={{
                      py: 1,
                      px: 2,
                      fontWeight: "medium", // font-medium
                      letterSpacing: "0.025em", // tracking-wide
                      color: "text.secondary", // text-gray-700
                      "&:hover": {
                        color: "primary.main", // hover:text-purple-700, assuming primary.main is purple
                        bgcolor: "transparent", // Prevent background change on hover if not desired
                      },
                      transition: "color 200ms ease-in-out",
                    }}
                  >
                    <ListItemText primary={link.label} />
                  </ListItemButton>
                </ListItem>
              )
          )}
        </List>

        {isAuthenticated && (
          <Box sx={{ display: "flex", alignItems: "center", ml: 3 }}>
            {/* Notification Bell */}
            <Box sx={{ position: "relative" }}>
              <IconButton
                aria-label="Notifications"
                title="Notifications"
                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                sx={{
                  p: 1,
                  "&:hover": { bgcolor: "grey.50" }, // hover:bg-gray-100
                  "&:focus": {
                    outline: "none",
                    boxShadow: "0 0 0 3px rgba(0, 0, 0, 0.1)",
                  }, // focus:shadow-outline
                }}
              >
                <BellIcon size={24} className="text-gray-600" />
              </IconButton>
              {isPopoverOpen && (
                <Paper
                  elevation={3}
                  sx={{
                    position: "absolute",
                    right: 0,
                    zIndex: 10,
                    mt: 1,
                    width: 192, // w-48
                    p: 2,
                    fontSize: "0.875rem", // text-sm
                    color: "text.secondary", // text-gray-700
                  }}
                >
                  {appData.notifications ? (
                    appData.notifications.map((notification, index) => (
                      <React.Fragment key={index}>
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-start">
                            <span>{notification.message}</span>
                            <button>
                              <CircleX
                                className="text-red-500 cursor-pointer"
                                onClick={() =>
                                  handleDeleteNotification(notification.id)
                                }
                              />
                            </button>
                          </div>
                        </div>
                        {index < appData.notifications.length - 1 && (
                          <Divider
                            sx={{
                              mt: 1,
                              mb: 0.5,
                              borderColor: "grey.300",
                              borderWidth: "1px",
                            }}
                          />
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <span>No notifications</span>
                  )}
                </Paper>
              )}
            </Box>
            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="contained"
              sx={{
                ml: 2,
                bgcolor: "error.light", // bg-red-400
                "&:hover": { bgcolor: "error.main" }, // hover:bg-red-600
                height: 40,
                px: 2,
                fontWeight: "medium",
                letterSpacing: "0.025em",
                boxShadow: 1, // shadow-md
                borderRadius: 1, // rounded
              }}
            >
              Logout
            </Button>
          </Box>
        )}
        {!isAuthenticated && (
          <Button
            component={Link}
            to="/login"
            variant="contained"
            sx={{
              ml: 2,
              bgcolor: "primary.main", // bg-blue-500
              "&:hover": { bgcolor: "primary.dark" }, // hover:bg-blue-700
              height: 40,
              px: 2,
              fontWeight: "medium",
              letterSpacing: "0.025em",
              boxShadow: 1, // shadow-md
              borderRadius: 1, // rounded
            }}
          >
            Login
          </Button>
        )}
      </Box>

      {/* Mobile Navigation (Hamburger Menu and Drawer) */}
      <Box sx={{ display: { xs: "flex", lg: "none" }, alignItems: "center" }}>
        {isAuthenticated && (
          <Box sx={{ position: "relative", mr: 1 }}>
            {" "}
            {/* Added mr for spacing */}
            <IconButton
              aria-label="Notifications"
              title="Notifications"
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
              sx={{
                p: 1,
                "&:hover": { bgcolor: "grey.50" },
                "&:focus": {
                  outline: "none",
                  boxShadow: "0 0 0 3px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <BellIcon size={24} className="text-gray-600" />
            </IconButton>
            {isPopoverOpen && (
              <Paper
                elevation={3}
                sx={{
                  position: "absolute",
                  right: 0,
                  zIndex: 10,
                  mt: 1,
                  width: 192,
                  p: 2,
                  fontSize: "0.875rem",
                  color: "text.secondary",
                }}
              >
                {appData.notifications ? (
                  appData.notifications.map((notification, index) => (
                    <React.Fragment key={index}>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-start">
                          <span>{notification.message}</span>
                          <button>
                            <CircleX
                              className="text-red-500 cursor-pointer"
                              onClick={() =>
                                handleDeleteNotification(notification.id)
                              }
                            />
                          </button>
                        </div>
                      </div>
                      {index < appData.notifications.length - 1 && (
                        <Divider
                          sx={{
                            mt: 1,
                            mb: 0.5,
                            borderColor: "grey.300",
                            borderWidth: "1px",
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <span>No notifications</span>
                )}
              </Paper>
            )}
          </Box>
        )}
        <IconButton
          aria-label="Open Menu"
          title="Open Menu"
          onClick={toggleDrawer(true)}
          sx={{
            p: 1,
            ml: isAuthenticated ? 0 : "auto", // Adjust margin if not authenticated
            "&:hover": { bgcolor: "grey.50" },
            "&:focus": {
              outline: "none",
              boxShadow: "0 0 0 3px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <MenuIcon size={24} className="text-gray-600" />
        </IconButton>

        <Drawer anchor="right" open={isMenuOpen} onClose={toggleDrawer(false)}>
          <Box
            sx={{ width: 250 }} // Adjust width as needed
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Typography
                variant="h6"
                component={Link}
                to={isAuthenticated ? "/dashboard" : "/"}
                sx={{
                  fontWeight: "bold",
                  letterSpacing: "0.025em",
                  color: "text.primary",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                ENTNT
              </Typography>
              <IconButton onClick={toggleDrawer(false)}>
                <XIcon size={24} className="text-gray-600" />
              </IconButton>
            </Box>
            <List>
              {navLinks.map(
                (link, index) =>
                  user &&
                  link.roles.includes(user.role) && (
                    <ListItem key={index} disablePadding>
                      <ListItemButton component={Link} to={link.to}>
                        <ListItemText primary={link.label} />
                      </ListItemButton>
                    </ListItem>
                  )
              )}
              {isAuthenticated && (
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout}>
                    <ListItemText
                      primary="Logout"
                      sx={{ color: "error.main" }}
                    />
                  </ListItemButton>
                </ListItem>
              )}
              {!isAuthenticated && (
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/login">
                    <ListItemText
                      primary="Login"
                      sx={{ color: "primary.main" }}
                    />
                  </ListItemButton>
                </ListItem>
              )}
            </List>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
}
