import React, { useEffect, useState } from "react";
import { Box, Container, Grid2, Typography, IconButton, Link, useTheme, useMediaQuery } from "@mui/material";
import { styled } from "@mui/system";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import axios from "axios";

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
  const [title, setTitle] = useState([])
  const [links, setLink] = useState([])
  const [sociallinks, setSocialLink] = useState([])
  const [copyright, setCopyright] = useState([])
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const currentYear = new Date().getFullYear();

  const fetchFooterTitle = async () =>{
    const response = await axios.get("http://localhost:80/api/others/footer-title/",{
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    setTitle(response.data)
  }

  const fetchLinks = async () =>{
    const response = await axios.get("http://localhost:80/api/others/links/",{
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    setLink(response.data)
  }

  const fetchSocialIconsLinks = async () =>{
    const response = await axios.get("http://localhost:80/api/others/social-links/",{
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    setSocialLink(response.data)
  }

  const fetchCopyright = async () =>{
    const response = await axios.get("http://localhost:80/api/others/copyright-text/",{
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    })
    setCopyright(response.data)
  }
  
  useEffect(()=>{
    fetchFooterTitle();
    fetchLinks();
    fetchSocialIconsLinks();
    fetchCopyright();
  },[])

  return (
    <StyledFooter component="footer" className="footer-class">
      <Container maxWidth="lg">
        <Grid2 container spacing={isMobile ? 2 : 4}>
          {title.map((data, index) => (
            <Grid2 key={index} item xs={12} sm={6} md={3}>
              <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
                {data.footer_title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  fontSize: isMobile ? "0.875rem" : "1rem"
                }}
              >
                {data.footer_description}
              </Typography>
            </Grid2>
          ))}
          {links.map((data, index) => (
            <Grid2 item xs={6} sm={6} md={3} key={index}>
              <Typography key={index} variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
                {data.category_name}
              </Typography>
              {data.name.map((item, index) => (
                <Box key={index} sx={{ mb: isMobile ? 0.5 : 1 }}>
                  <StyledLink href={item.links_url}>
                    <Typography variant="body2">{item.links_title}</Typography>
                  </StyledLink>
                </Box>
              ))}
            </Grid2>
          ))}
          {sociallinks.map((data, index)=>(
            <Grid2 item xs={12} sm={6} md={3} key={index}>
              <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
                {data.social_category_name}
              </Typography>
              <Box sx={{ mt: isMobile ? 1 : 2 }} key={index}>
                {data.social_data.map((social, index) => (
                  <SocialIcon
                    key={index}
                    href={'https://' + social.social_url}
                    aria-label={social.social_label}
                    target="_blank"
                    rel="social links"
                  >
                    {social.social_icon == 'FaFacebook' ? <FaFacebook size={isMobile ? 20 : 24} /> : 
                    social.social_icon == 'FaTwitter' ? <FaTwitter size={isMobile ? 20 : 24} /> :
                    social.social_icon == 'FaLinkedin' ? <FaLinkedin size={isMobile ? 20 : 24} />:
                    social.social_icon == 'FaInstagram' ? <FaInstagram size={isMobile ? 20 : 24} />:
                    ""}
                  </SocialIcon>
                ))}
              </Box>
            </Grid2>
          ))}
        </Grid2>
        <Box 
          sx={{ 
            mt: isMobile ? 2 : 4, 
            pt: isMobile ? 1 : 2, 
            borderTop: "1px solid rgba(255, 255, 255, 0.1)" 
          }}
        >
          {copyright.map((data, index)=>(
          <Typography 
            variant="body2" 
            align="center"
            key={index}
            sx={{
              fontSize: isMobile ? "0.75rem" : "0.875rem"
            }}
          >
            © {currentYear} {data.copyright_footer}
          </Typography>
          ))}
        </Box>
      </Container>
    </StyledFooter>
  );
};

export default Footer;