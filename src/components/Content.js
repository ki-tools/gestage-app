import React, { useState, useMemo } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import InputAdornment from "@mui/material/InputAdornment";
import Link from "@mui/material/Link";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import dayjs from "dayjs";
// import Lookups from "./Lookups";
import getPred, { hc4wtRange, lmp4wtRange } from "../models";
// import getChartData from "../chartData";
// import Chart from "./Chart";

export default function Content() {
  const [selectedMod, setSelectedMod] = useState("c");
  const [birthhc, setBirthhc] = useState(35);
  const [lmpDate, setLmpDate] = useState(dayjs().subtract(40, "week"));
  const [birthDate, setBirthDate] = useState(dayjs());
  const [birthwt, setBirthwt] = useState(3500);

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"));

  // const chartData = useMemo(() => {
  //   return getChartData(selectedMod);
  // }, [selectedMod])

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
                    </Highlight>
                    . This model had 95% limits of agreement (LoA) of ±16.7 days
                    and high diagnostic accuracy with area under the curve (AUC)
                    of 0.88.
                  </li>
                  <li>
                    <strong>Model D:</strong> Inputs are{" "}
                    <Highlight>birth weight</Highlight> and{" "}
                    <Highlight>birth head circumference (HC)</Highlight>. This
                    model had 95% LoA of ±18.4 days and AUC of 0.84.
                  </li>
                </ul>
              </div>
              <p>
                Model C performs slightly better than Model D but Model D only
                requires inputs that can be directly measured at birth. For more
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
          <Typography sx={{ ...headerStyle, pt: 2, pb: 2.5 }}>
            Get a single gestational age estimate
          </Typography>
          <Box sx={{ display: "flex", width: "100%" }}>
            <Inputs
              mod={selectedMod}
              birthDate={birthDate}
              setBirthDate={setBirthDate}
              lmpDate={lmpDate}
              setLmpDate={setLmpDate}
              birthhc={birthhc}
              setBirthhc={setBirthhc}
              birthwt={birthwt}
              setBirthwt={setBirthwt}
            />
          </Box>
          {/* <Typography sx={{ ...headerStyle, pt: 2.5, pb: 2 }}>
            Lookup tables
          </Typography>
          <Lookups mod={selectedMod} /> */}
        </Box>
        {/* <Box sx={{ height: 600 }}><Chart data={chartData} /></Box> */}
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
  lmpDate,
  birthDate,
  setLmpDate,
  setBirthDate,
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
  function handleLmpDateChange(newValue) {
    setLmpDate(newValue);
  }
  function handleBirthDateChange(newValue) {
    setBirthDate(newValue);
  }

  const valid = useMemo(() => {
    const res = {};
    res.invalidLmpDate =
      lmpDate === null || lmpDate.$d.toString() === "Invalid Date";
    res.invalidBirthDate =
      birthDate === null || birthDate.$d.toString() === "Invalid Date";
    res.invalidGagelmp = true;
    res.gagelmp = -1;
    // these are the maximal limits
    if (!res.invalidLmpDate && !res.invalidBirthDate) {
      res.gagelmp = birthDate.diff(lmpDate, "day");
      res.invalidGagelmp = res.gagelmp < 161 || res.gagelmp > 350;
    }
    res.invalidBirthhc = birthhc < 25 || birthhc > 40;
    res.invalidBirthwt = birthwt < 1000 || birthwt > 5000;
    // but there are sometimes more restricted limits based on the other value
    res.wtLims = { min: 1000, max: 5000 };
    res.hcLims = { min: 25, max: 40 };
    res.lmpLims = { min: 161, max: 350 };
    if (mod === "c") {
      if (!res.invalidBirthwt) {
        res.lmpLims = lmp4wtRange(birthwt);
        res.invalidGagelmp =
          res.gagelmp < res.lmpLims.min || res.gagelmp > res.lmpLims.max;
      }
      // if (!res.invalidLmpDate && !res.invalidBirthDate && !res.invalidGagelmp) {
      //   res.wtLims = wt4lmpRange(res.gagelmp);
      //   res.invalidBirthwt = birthwt < res.wtLims.min || birthwt > res.wtLims.max;
      // }
    } else {
      if (!res.invalidBirthwt) {
        res.hcLims = hc4wtRange(birthwt);
        res.invalidBirthhc =
          birthhc < res.hcLims.min || birthhc > res.hcLims.max;
      }
      // if (!res.invalidBirthhc) {
      //   res.wtLims = wt4hcRange(birthhc);
      //   res.invalidBirthwt = birthwt < res.wtLims.min || birthwt > res.wtLims.max;
      // }
    }
    res.dateError = false;
    res.invalidGagelmp2 =
      !res.invalidLmpDate && !res.invalidLmpDate && res.invalidGagelmp;
    res.dateMsg = `${res.gagelmp} days between birth and last menstrual period`;
    if (res.invalidLmpDate && res.invalidBirthDate) {
      res.dateMsg = "Enter a valid date for both LMP and birth";
      res.dateError = true;
    } else if (res.invalidLmpDate) {
      res.dateMsg = "Enter a valid date for LMP";
      res.dateError = true;
    } else if (res.invalidBirthDate) {
      res.dateMsg = "Enter a valid date for birth";
      res.dateError = true;
    } else if (res.gagelmp > res.lmpLims.max) {
      res.dateMsg = `Too many days (${res.gagelmp}) between LMP and birth to estimage GA for this birth weight`;
      res.dateError = true;
    } else if (res.gagelmp < res.lmpLims.min) {
      res.dateMsg = `Too few days (${res.gagelmp}) between LMP and birth to estimage GA for this birth weight`;
      res.dateError = true;
    }
    return res;
  }, [birthhc, birthwt, lmpDate, birthDate, mod]);

  const pred = useMemo(() => {
    let pred = -1;
    const validVal =
      mod === "c" ? !valid.invalidGagelmp : !valid.invalidBirthhc;
    if (validVal && !valid.invalidBirthwt) {
      const val = Number(mod === "c" ? valid.gagelmp : birthhc);
      pred = getPred(mod, val, birthwt, true);
      // pred = `${pred} days (${Math.round((pred / 7) * 100) / 100} weeks)`;
    }
    return pred;
  }, [birthhc, birthwt, mod, valid]);

  let term = "";
  if (pred > 0 && pred < 28 * 7) {
    term = "extremely preterm (less than 28 weeks)";
  } else if (pred < 32 * 7) {
    term = "very preterm (28 to 32 weeks)";
  } else if (pred < 37 * 7) {
    term = "moderate to late preterm (32 to 37 weeks)";
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          width: {
            xs: "100%",
            md: "unset",
          },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <BirthWeightInput
          birthwt={birthwt}
          valid={valid}
          handleBirthwtChange={handleBirthwtChange}
          mod={mod}
        />
        {mod === "c" && (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <DatePicker
                label="Date of last menstrual period"
                value={lmpDate}
                slotProps={{
                  textField: {
                    error: valid.invalidLmpDate || valid.invalidGagelmp2,
                  },
                }}
                format="YYYY-MM-DD"
                onChange={handleLmpDateChange}
                sx={{
                  mt: { xs: 3, md: 0 },
                  width: { xs: "50%", md: "21ch" },
                }}
              />
              <DatePicker
                label="Date of birth"
                value={birthDate}
                slotProps={{
                  textField: {
                    error: valid.invalidBirthDate || valid.invalidGagelmp2,
                  },
                }}
                format="YYYY-MM-DD"
                onChange={handleBirthDateChange}
                sx={{
                  boxSizing: "border-box",
                  ml: 1,
                  mt: { xs: 3, md: 0 },
                  width: { xs: "50%", md: "21ch" },
                }}
              />
            </Box>
            <Box
              style={{
                color: valid.dateError ? "#d32f2f" : "rgba(0, 0, 0, 0.6)",
                fontWeight: 400,
                fontSize: "0.75rem",
                lineHeight: 1.66,
                textAlign: "left",
                marginTop: 3,
                marginRight: 14,
                marginBottom: 0,
                marginLeft: 14,
              }}
            >
              {valid.dateMsg}
            </Box>
          </Box>
        )}
        {mod === "d" && (
          <TextField
            type="number"
            error={valid.invalidBirthhc}
            id="birthhc-input"
            label="Birth head circumference"
            value={birthhc}
            helperText={`Value between ${valid.hcLims.min} and ${valid.hcLims.max}`}
            sx={{
              mt: { xs: 3, md: 0 },
              width: { xs: "100%", md: "32ch" },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">cm</InputAdornment>
              ),
            }}
            onChange={handleBirthhcChange}
          />
        )}
      </Box>
      <Box
        sx={{
          width: { xs: "100%", md: "65.6ch" },
          background: "rgb(25, 118, 210)",
          opacity: pred > 0 ? 1 : 0.5,
          padding: 2,
          color: "white",
          borderRadius: 2,
          mt: 3,
          mb: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box style={{ fontSize: 14 }}>{/* */}</Box>
        <Box style={{ fontSize: 25, fontWeight: 500 }}>
          <span style={{ fontSize: 22, opacity: 0.85 }}>
            Gestational age (weeks+days):{" "}
          </span>
          {pred > 0 && `${Math.floor(pred / 7)}+${pred % 7}`}
        </Box>
        <Box>{term}</Box>
      </Box>
    </Box>
  );
}

function BirthWeightInput({ birthwt, valid, handleBirthwtChange, mod }) {
  return (
    <TextField
      type="number"
      error={valid.invalidBirthwt}
      id="birthwt-input"
      label="Birth weight"
      value={birthwt}
      helperText={`Value between ${valid.wtLims.min.toLocaleString()} and ${valid.wtLims.max.toLocaleString()}`}
      sx={{
        mr: { md: 1 },
        mt: { xs: 3, md: 0 },
        width: { xs: "100%", md: mod === "c" ? "22ch" : "33ch" },
      }}
      InputProps={{
        endAdornment: <InputAdornment position="start">g</InputAdornment>,
      }}
      onChange={handleBirthwtChange}
    />
  );
}
