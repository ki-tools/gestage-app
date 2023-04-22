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
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import dayjs from "dayjs";
// import Lookups from "./Lookups";
import getPred from "../models";

export default function Content() {
  const [selectedMod, setSelectedMod] = useState("c");
  const [birthhc, setBirthhc] = useState(35);
  const [lmpDate, setLmpDate] = useState(dayjs().subtract(40, "week"));
  const [birthDate, setBirthDate] = useState(dayjs());
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

function MyDay(props) {
  // return <PickersDay {...props} />;
  return 'hi'
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

  const invalidBirthhc = birthhc < 25 || birthhc > 40;
  const invalidBirthwt = birthwt < 1000 || birthwt > 5000;
  const invalidLmpDate = lmpDate === null || lmpDate.$d.toString() === "Invalid Date";
  const invalidBirthDate = birthDate === null || birthDate.$d.toString() === "Invalid Date";
  let invalidGagelmp = true;
  let dateError = false;
  let gagelmp = -1;
  if (!invalidLmpDate && !invalidBirthDate) {
    gagelmp = birthDate.diff(lmpDate, "day");
    invalidGagelmp = gagelmp < 161 || gagelmp > 350;
  }
  const invalidGagelmp2 = !invalidLmpDate && !invalidLmpDate && invalidGagelmp;
  let dateMsg = `${gagelmp} days between birth and last menstrual period`;
  if (invalidLmpDate && invalidBirthDate) {
    dateMsg = "Enter a valid date for both LMP and birth";
    dateError = true;
  } else if (invalidLmpDate) {
    dateMsg = "Enter a valid date for LMP";
    dateError = true;
  } else if (invalidBirthDate) {
    dateMsg = "Enter a valid date for birth";
    dateError = true;
  } else if (gagelmp > 350) {
    dateMsg = `Too many days (${gagelmp}) between LMP and birth to estimage GA`;
    dateError = true;
  } else if (gagelmp < 161) {
    dateMsg = `Too few days (${gagelmp}) between LMP and birth to estimage GA`;
    dateError = true;
  }

  const pred = useMemo(() => {
    let pred = -1;
    const validVal = mod === "c" ? !invalidGagelmp : !invalidBirthhc;
    if (validVal && !invalidBirthwt) {
      const val = Number(mod === "c" ? gagelmp : birthhc);
      pred = getPred(mod, val, birthwt, true);
      // pred = `${pred} days (${Math.round((pred / 7) * 100) / 100} weeks)`;
    }
    return pred;
  }, [
    birthhc,
    birthwt,
    gagelmp,
    invalidBirthhc,
    invalidGagelmp,
    invalidBirthwt,
    mod,
  ]);

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
        {mod === "c" && (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <DatePicker
                label="Date of last menstrual period"
                value={lmpDate}
                slotProps={{
                  textField: {
                    error: invalidLmpDate || invalidGagelmp2,
                  },
                }}
                slots={{
                  Day: MyDay,
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
                    error: invalidBirthDate || invalidGagelmp2,
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
                color: dateError ? "#d32f2f" : "rgba(0, 0, 0, 0.6)",
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
              {dateMsg}
            </Box>
          </Box>
        )}
        {mod === "d" && (
          <TextField
            type="number"
            error={invalidBirthhc}
            id="birthhc-input"
            label="Birth head circumference"
            value={birthhc}
            helperText="Value between 25 and 40"
            sx={{ width: { xs: "100%", md: "32ch" } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">cm</InputAdornment>
              ),
            }}
            onChange={handleBirthhcChange}
          />
        )}
        <BirthWeightInput
          birthwt={birthwt}
          invalidBirthwt={invalidBirthwt}
          handleBirthwtChange={handleBirthwtChange}
          mod={mod}
        />
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
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box style={{ fontSize: 14 }}>{/* asdf */}</Box>
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

function BirthWeightInput({
  birthwt,
  invalidBirthwt,
  handleBirthwtChange,
  mod,
}) {
  return (
    <TextField
      type="number"
      error={invalidBirthwt}
      id="birthwt-input"
      label="Birth weight"
      value={birthwt}
      helperText="Value between 1,000 and 5,000"
      sx={{
        ml: { md: 1 },
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
