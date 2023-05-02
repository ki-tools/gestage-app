import { KNOTS, COEFS } from "./consts";

function diffTable(x, ndiff, curs, knots) {
  const rdel = new Array(ndiff);
  const ldel = new Array(ndiff);
  let i;
  for (i = 0; i < ndiff; i++) {
    rdel[i] = knots[curs + i] - x;
    ldel[i] = x - knots[curs - (i + 1)];
  }
  return { rdel, ldel };
}

function getCursor(x, knots, ord) {
  let i;
  let curs = -1;
  for (i = 0; i < knots.length; i++) {
    if (knots[i] >= x) curs = i;
    if (knots[i] > x) break;
  }
  if (curs > knots.length - ord) {
    let lastLegit = knots.length - ord;
    if (x === knots[lastLegit]) {
      curs = lastLegit;
    }
  }
  return curs;
}

function getBasis(knots, ord, x) {
  const ordm1 = ord - 1;
  const curs = getCursor(x, knots, ord);

  const b = new Array(4);
  b[0] = 1;

  for (let j = 1; j <= ordm1; j++) {
    let saved = 0;
    const { rdel, ldel } = diffTable(x, ordm1, curs, knots);
    for (let r = 0; r < j; r++) {
      // do not divide by zero
      const den = rdel[r] + ldel[j - 1 - r];
      if (den !== 0) {
        const term = b[r] / den;
        b[r] = saved + rdel[r] * term;
        saved = ldel[j - 1 - r] * term;
      } else {
        if (r !== 0 || rdel[r] !== 0) b[r] = saved;
        saved = 0;
      }
    }
    b[j] = saved;
  }
  return {
    b,
    curs,
  };
}

// lookupVal is gagelmp for model C and birthhc for model D
export default function getPred(mod, lookupVal, x, round) {
  const ord = 4;

  let rowRef = "";
  if (mod === "c") {
    rowRef = `g${Math.round(lookupVal)}`;
  } else {
    rowRef = `h${10 * Math.round(lookupVal)}`;
  }

  const knots = KNOTS[mod];
  const coefs = COEFS[mod][rowRef];

  const { b, curs } = getBasis(knots, ord, x);

  const idx = curs - ord;

  let res = coefs[0];
  const startval = idx === 0 ? 1 : 0;
  for (let ii = startval; ii < b.length; ii++) {
    res += coefs[idx + ii] * b[ii];
  }

  if (round) {
    res = Math.round(res);
  }
  return res;
}

export function hc4wtRange(wt) {
  let max = 40;
  if (wt < 1680) {
    max = 25 + 0.006 * wt;
  }
  return {
    min: 25,
    max: Math.round(10 * max) / 10
  };
}

export function wt4hcRange(hc) {
  let min = 1000;
  if (hc > 35.2) {
    min = 1680;
  } else if (hc >= 30.8 && hc <= 35.2) {
    min = -3760 + 154.5455 * hc;
  }
  return {
    min: Math.round(min),
    max: 5000
  }
};

export function lmp4wtRange(wt) {
  let max = 350;
  if(wt <= 1550) {
    max = 205 + 0.048 * wt;
  } else if(wt > 1550 && wt < 1650) {
    max = -30 + 0.23 * wt;
  }
  return {
    min: 161,
    max: Math.round(max)
  };
}

export function wt4lmpRange(lmp) {
  let min = 1000;
  if (lmp > 254 && lmp <= 281) {
    min = -4268.214 + 20.741 * lmp;
  } else if (lmp <= 326 & lmp > 281) {
    min = 1560;
  } else if(lmp > 326) {
    min = 307.7 + 3.846 * lmp;
  }
  return {
    min: Math.round(min),
    max: 5000
  };
}
