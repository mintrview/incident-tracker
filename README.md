# Incident Tracker

A simple UI and node.js server to keep track of vehicle incidents by VIN.

# System Requirements

- Node.js (v14.15.5)
- Latest versions of Firefox, Safari, or Chrome

# Development

1. Make sure you are running the correct version of node pinned to the project. You can use [nvm](https://github.com/nvm-sh/nvm) to manage different node versions.

2. Run `npm install` to install required dependencies.

3. Run `npm run start` to start a development server and visit [http://localhost:3000](http://localhost:3000).

4. To run the application in production, run `npm run build`, then `npm run start` with the `NODE_ENV` environment variable set to `production`.

**NOTE: It was observed that the vpic API was experiencing some latency issues. To enable mocks, set the `MOCKS` environment variable to `1`.**

# Testing

Unit tests can be run with:

`npm run test`

# Additional Areas of Improvement

- Pagination for large sets of incidents
- Responsive UI for mobile
- Sticky incident submission form
- Use websocket for realtime list updates for multiple clients
- Create swagger spec and auto-generated client
- Factor out inline stylesheet colors into a common set of variables
