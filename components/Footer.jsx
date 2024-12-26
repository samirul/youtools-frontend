import React from "react";
import { Box, Container, Grid2, Typography, IconButton, Link, useTheme, useMediaQuery } from "@mui/material";
import { styled } from "@mui/system";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(6, 87, 153, 0.08)",
  color: "#ffffff",
  padding: theme.spacing(6, 0),
  marginTop: "auto",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(4, 0)
  }
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: "#ffffff",
  textDecoration: "none",
  "&:hover": {
    color: "#90caf9",
    textDecoration: "none"
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.9rem"
  }
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: "#ffffff",
  marginRight: theme.spacing(2),
  "&:hover": {
    color: "#90caf9",
    backgroundColor: "rgba(144, 202, 249, 0.08)"
  },
  [theme.breakpoints.down("sm")]: {
    marginRight: theme.spacing(1),
    padding: theme.spacing(1)
  }
}));

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { title: "About Us", url: "#" },
    { title: "Contact", url: "#" },
    { title: "Privacy Policy", url: "#" }
  ];

  const navigationLinks = [
    { title: "Home", url: "#" },
    { title: "Services", url: "#" },
    { title: "Blog", url: "#" },
    { title: "Products", url: "#" }
  ];

  const socialLinks = [
    { icon: <FaFacebook size={isMobile ? 20 : 24} />, url: "#", label: "Facebook" },
    { icon: <FaTwitter size={isMobile ? 20 : 24} />, url: "#", label: "Twitter" },
    { icon: <FaLinkedin size={isMobile ? 20 : 24} />, url: "#", label: "LinkedIn" },
    { icon: <FaInstagram size={isMobile ? 20 : 24} />, url: "#", label: "Instagram" }
  ];

  return (
    <StyledFooter component="footer">
      <Container maxWidth="lg">
        <Grid2 container spacing={isMobile ? 2 : 4}>
          <Grid2 item xs={12} sm={6} md={3}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
              TechCorp
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 2,
                fontSize: isMobile ? "0.875rem" : "1rem"
              }}
            >
              Innovative solutions for tomorrow"s challenges. Building the future through technology.
            </Typography>
          </Grid2>

          <Grid2 item xs={6} sm={6} md={3}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
              Quick Links
            </Typography>
            {quickLinks.map((link, index) => (
              <Box key={index} sx={{ mb: isMobile ? 0.5 : 1 }}>
                <StyledLink href={link.url}>
                  <Typography variant="body2">{link.title}</Typography>
                </StyledLink>
              </Box>
            ))}
          </Grid2>

          <Grid2 item xs={6} sm={6} md={3}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
              Navigation
            </Typography>
            {navigationLinks.map((link, index) => (
              <Box key={index} sx={{ mb: isMobile ? 0.5 : 1 }}>
                <StyledLink href={link.url}>
                  <Typography variant="body2">{link.title}</Typography>
                </StyledLink>
              </Box>
            ))}
          </Grid2>

          <Grid2 item xs={12} sm={6} md={3}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
              Connect With Us
            </Typography>
            <Box sx={{ mt: isMobile ? 1 : 2 }}>
              {socialLinks.map((social, index) => (
                <SocialIcon
                  key={index}
                  href={social.url}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </SocialIcon>
              ))}
            </Box>
          </Grid2>
        </Grid2>

        <Box 
          sx={{ 
            mt: isMobile ? 2 : 4, 
            pt: isMobile ? 1 : 2, 
            borderTop: "1px solid rgba(255, 255, 255, 0.1)" 
          }}
        >
          <Typography 
            variant="body2" 
            align="center"
            sx={{
              fontSize: isMobile ? "0.75rem" : "0.875rem"
            }}
          >
            © {currentYear} TechCorp. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </StyledFooter>
  );
};

export default Footer;