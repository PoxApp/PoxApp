const { defineConfig } = require('cypress');

module.exports = defineConfig({
  video: true,
  projectId: "2a7irk",
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
