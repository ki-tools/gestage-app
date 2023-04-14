import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import GitHubIcon from "@mui/icons-material/GitHub";

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

ElevationScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default function ElevateAppBar(props) {
  return (
    <React.Fragment>
      <ElevationScroll {...props}>
        <AppBar sx={{ background: "rgb(42, 42, 42)", height: 80 }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  fontFamily: "Montserrat",
                  alignItems: "flex-start",
                }}
              >
                <Box sx={{ fontWeight: 400, fontSize: 26, lineHeight: "80px" }}>
                  WHO AMHANI
                  <span
                    style={{ fontWeight: 600, fontSize: 22, paddingLeft: 15 }}
                  >
                    Gestational Age Tool
                  </span>
                </Box>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ flexGrow: 0 }}>
                <Link href="https://github.com/ki-tools/gestage-app" target="_blank" rel="noopener">
                  <GitHubIcon fontSize="large" sx={{ color: "white" }} />
                </Link>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>
    </React.Fragment>
  );
}
