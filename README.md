# AMANHI Gestational Age Tool

This tool implements models built on the WHO Alliance for Maternal and Newborn Health Improvement (AMANHI) study for estimating newborn gestational age (GA). The estimates from these models have greater accuracy and precision than traditional methods while requiring fewer inputs. These models are particularly suited for use in low resource settings.

Two models are implemented in this app.

- **Model C**: Inputs are birth weight and days since last menstrual period (LMP). This model had 95% limits of agreement (LoA) of ±16.7 days and high diagnostic accuracy with area under the curve (AUC) of 0.88.
- **Model D**: Inputs are birth weight and birth head circumference (HC). This model had 95% LoA of ±18.4 days and AUC of 0.84.

For more information on these models, see [here](https://gh.bmj.com/content/6/9/e005688)

## About this App

The app provides a simple JavaScript interface to algorithms implemented in an R package that can be found [here](https://github.com/ki-tools/gestage). The model estimates are provided through interpolation of the black-box models evaluated at a very fine grid of combinations of the input parameters. This allows us to share the model results in a compact manner without sharing the underlying model objects which contain sensitive data. The R package uses B-splines to interpolate the model results. We adapt those B-splines to JavaScript in this app.

## Developer Notes

The app is built using React and a few standard JavaScript libraries. It is built using Create React App. Because it is a very simple interface, the app does not make use of any complicated state management libraries. Any JavaScript developer with experience with React should be able to jump in and update the app with minimal effort.

The most difficult parts of the app to understand will be the B-spline algorithms. Knot locations and spline coefficients for models C and D can be found in `src/consts.js`. The B-spline algorithms are implemented in `src/models.js`. There are some currently-unused components that would provide a lookup table and a chart of the results but are not currently in the app for simplicity.

Anyone who might jump in to develop the app is encouraged to compare results from the app to results from the R package. The R package is the source of truth for the model results. The app is just a simple interface to those results.

The app is designed to be a single page application (SPA) with a single route. It is designed to be responsive and should work on mobile devices. 

You can jump into developing the app with the following after checking out the repo:

```
yarn install

yarn start
```

The app is a standalone JavaScript app that can easily be hosted from any static file server. The app is currently hosted on Netlify.

To deploy the app somewhere else, run `yarn build` and then copy the contents of the `build` directory to the server.
