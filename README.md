# Getting started

This file-archive app has the following functionalites:

- Uploading of jpg, xml and pdf files.
- Listing of all uploaded files with metadata
- Deletion of uploaded files
- Downloading of uploaded files (click on file name)
- Sorting of file listing
- Rename file on upload

The file listing shows at maximum 5 files at a time but the whole list is fetched at once. In other words, there is no pagination present. The file listing is saved in json file in the backend folder, its called "data.json".

Main technologies used:
- Express.js
- JavaScript
- React.js
- TypeScript
- Material UI
- CSS

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Prerequisites

- NPM (works with v8.6.0)
- Node (works with v18.0.0)

## Installation

Run `npm install` in the root directory to install all the dependencies. That should be it! Then start the backend server and front end app with the scripts below.

## Available Scripts

In the project directory, you can run:

### `npm run server`

This runs the Express server in the backend folder.

### `npm run watchServer`

This runs the Express server with Nodemon and watches for file changes (needs Nodemon to be installed).

### `npm start`

Runs the front end app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the front end app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can???t go back!**

If you aren???t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you???re on your own.

You don???t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn???t feel obligated to use this feature. However we understand that this tool wouldn???t be useful if you couldn???t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
