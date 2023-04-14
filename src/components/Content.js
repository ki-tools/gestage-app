import React, { useState, useMemo } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Lookups from "./Lookups";
import getPred from "../models";

export default function Content() {
  const [selectedMod, setSelectedMod] = useState("c");
  const [birthhc, setBirthhc] = useState(35);
  const [gagelmp, setGagelmp] = useState(280);
  const [birthwt, setBirthwt] = useState(3500);

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));

  const handleModChange = (event, newMod) => {
    setSelectedMod(newMod);
  };

  const headerStyle = { fontWeight: 600, fontSize: 24 };

  return (
    <Box sx={{ width: "100%", paddingTop: 10 }}>
      <Box sx={{ width: "100%", background: "#efefef" }}>
        <Container maxWidth="lg">
          <Box sx={{ pt: 1, pb: 0.5 }}>
            <Typography
              sx={{ textAlign: "left", fontSize: 18 }}
              component="div"
            >
              <p>
                This tool implements models built on the{" "}
                <Highlight>
                  WHO Alliance for Maternal and Newborn Health Improvement
                  (AMANHI) study
                </Highlight>{" "}
                for estimating newborn gestational age (GA). The estimates from
                these models have greater accuracy and precision than
                traditional methods while requiring fewer inputs. These models
                are particularly suited for use in low resource settings.
              </p>
              <div>
                Two models are implemented in this app.
                <ul>
                  <li>
                    <strong>Model C:</strong> Inputs are{" "}
                    <Highlight>birth weight</Highlight> and{" "}
                    <Highlight>
                      days since last menstrual period (LMP)
                    </Highlight>{" "}
                    with 95% limits of agreement (LoA) of ±16.7 days and high
                    diagnostic accuracy with area under the curve (AUC) of 0.88.
                  </li>
                  <li>
                    <strong>Model D:</strong> Inputs are{" "}
                    <Highlight>birth weight</Highlight> and{" "}
                    <Highlight>birth head circumference (HC)</Highlight> with
                    95% LoA of ±18.4 days and AUC of 0.84.
                  </li>
                </ul>
              </div>
              <p>
                Model C performs slightly better than Model D but Model D only
                requires inputs that can be captured at birth. For more
                information on these models, see{" "}
                <Link
                  href="https://gh.bmj.com/content/6/9/e005688"
                  target="_blank"
                  rel="noopener"
                >
                  here
                </Link>
                .
              </p>
            </Typography>
          </Box>
        </Container>
      </Box>
      <Container maxWidth="lg">
        <Box
          sx={{
            pt: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography sx={{ ...headerStyle, pb: 1 }}>Select a model</Typography>
          <Box sx={{ pb: 2, width: "100%", display: "flex" }}>
            <ToggleButtonGroup
              orientation={`${isMd ? "horizontal" : "vertical"}`}
              fullWidth={!isMd}
              color="primary"
              size="large"
              value={selectedMod}
              exclusive
              onChange={handleModChange}
              aria-label="model selection"
            >
              <ToggleButton
                value="c"
                aria-label="model c"
                sx={{ width: { md: "330px" } }}
              >
                Model C: LMP and Birth Weight
              </ToggleButton>
              <ToggleButton
                value="d"
                aria-label="model d"
                sx={{ width: { md: "330px" } }}
              >
                Model D: Birth HC and Birth Weight
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Typography sx={{ ...headerStyle, pt: 1, pb: 2 }}>
            Get a single estimate
          </Typography>
          <Box sx={{ display: "flex", width: "100%" }}>
            <Inputs
              mod={selectedMod}
              gagelmp={gagelmp}
              setGagelmp={setGagelmp}
              birthhc={birthhc}
              setBirthhc={setBirthhc}
              birthwt={birthwt}
              setBirthwt={setBirthwt}
            />
          </Box>
          <Typography sx={{ ...headerStyle, pt: 2.5, pb: 2 }}>
            Lookup tables
          </Typography>
          <Lookups mod={selectedMod} />
        </Box>
      </Container>
    </Box>
  );
}

function Highlight({ children }) {
  return (
    <span
      style={{
        fontWeight: 500,
        color: "#1976d2",
        backgroundColor: "rgba(25, 118, 210, 0.04)",
      }}
    >
      {children}
    </span>
  );
}

function Inputs({
  mod,
  birthhc,
  gagelmp,
  setGagelmp,
  setBirthhc,
  birthwt,
  setBirthwt,
}) {
  function handleBirthhcChange(event) {
    setBirthhc(event.target.value);
  }
  function handleBirthwtChange(event) {
    setBirthwt(event.target.value);
  }
  function handleGagelmpChange(event) {
    setGagelmp(event.target.value);
  }
  const invalidBirthhc = birthhc < 25 || birthhc > 40;
  const invalidBirthwt = birthwt < 1000 || birthwt > 5000;
  const invalidGagelmp = gagelmp < 161 || gagelmp > 350;

  const pred = useMemo(() => {
    let pred = "";
    const validVal = mod === "c" ? !invalidGagelmp : !invalidBirthhc;
    if (validVal && !invalidBirthwt) {
      const val = Number(mod === "c" ? gagelmp : birthhc);
      pred = getPred(mod, val, birthwt, true);
      pred = `${pred} days (${Math.round((pred / 7) * 100) / 100} weeks)`;
    }
    return pred;
  }, [birthhc, birthwt, gagelmp, invalidBirthhc, invalidGagelmp, invalidBirthwt, mod]);

  return (
    <Box sx={{ width: { xs: "100%", md: "unset" } }}>
      {mod === "c" && (
        <TextField
          type="number"
          error={invalidGagelmp}
          id="gagelmp-input"
          label="Gestational age LMP"
          value={gagelmp}
          helperText="Value between 161 and 350"
          sx={{ width: { xs: "100%", md: "20ch" } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">days</InputAdornment>
            ),
          }}
          onChange={handleGagelmpChange}
        />
      )}
      {mod === "d" && (
        <TextField
          type="number"
          error={invalidBirthhc}
          id="birthhc-input"
          label="Birth Head Circumference"
          value={birthhc}
          helperText="Value between 25 and 40"
          sx={{ width: { xs: "100%", md: "20ch" } }}
          InputProps={{
            endAdornment: <InputAdornment position="start">cm</InputAdornment>,
          }}
          onChange={handleBirthhcChange}
        />
      )}
      <BirthWeightInput
        birthwt={birthwt}
        invalidBirthwt={invalidBirthwt}
        handleBirthwtChange={handleBirthwtChange}
      />
      <TextField
        disabled
        id="pred-output"
        label="Gestational Age Estimate"
        variant="outlined"
        value={pred}
        sx={{
          ml: { md: 1 },
          mt: { xs: 3, md: 0 },
          width: { xs: "100%", md: "22ch" },
          "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2 !important",
            backgroundColor: "rgba(25, 118, 210, 0.08)",
          },
          "& .Mui-disabled": {
            color: "#1976d2",
            WebkitTextFillColor: "#1976d2 !important",
          },
        }}
      />
    </Box>
  );
}

function BirthWeightInput({ birthwt, invalidBirthwt, handleBirthwtChange }) {
  return (
    <TextField
      type="number"
      error={invalidBirthwt}
      id="birthwt-input"
      label="Birth Weight"
      value={birthwt}
      helperText="Value between 1,000 and 5,000"
      sx={{
        ml: { md: 1 },
        mt: { xs: 3, md: 0 },
        width: { xs: "100%", md: "22ch" },
      }}
      InputProps={{
        endAdornment: <InputAdornment position="start">g</InputAdornment>,
      }}
      onChange={handleBirthwtChange}
    />
  );
}
