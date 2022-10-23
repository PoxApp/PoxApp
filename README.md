[![Open Preview of PoxApp-Charite](https://badgen.net/badge/Preview/Poxapp-Charite/blue?icon=github)](https://osprspoxappcharite.z13.web.core.windows.net/)
[![Open Preview of PoxApp-Stanford](https://badgen.net/badge/Preview/Poxapp-Stanford/blue?icon=github)](https://osprspoxappstanford.z13.web.core.windows.net/)
[![Open Preview of CovApp-Charite](https://badgen.net/badge/Preview/CovApp/blue?icon=github)](https://osprscharite.z13.web.core.windows.net/)
[![Open Preview of CovApp-Stanford](https://badgen.net/badge/Preview/CovApp-Stanford/blue?icon=github)](https://osprsstanford.z13.web.core.windows.net/)


# OSPRS - QuestionnaireApp

> 😷 Solution for assessing the risk of contagious viral infections (e.g. COVID-19, Monkeypox)

> This is the preceding project of [CovApp](https://github.com/CovOpen/CovApp-2.0), which was featured on [Nature Medicine](https://www.nature.com/articles/s41591-022-01797-0)

OSPRS can help users to assess their medical condition better, provide recommendations regarding doctor’s visits or coronavirus testing by answering a few questions. 

Additionally, every filled out questionnaire summarizes relevant medical information for future doctor’s consultation in the form of a summary page, printout or a QR code. Institutions with the technical setup can scan the provided QR code and retrieve the patient information quickly and without any physical contact.

By implementing the OSPRS - QuestionnaireApp, any medical institution can reduce the number of new incoming patients, avoid physical contact and speed up the patient registration process.

---

This repository holds a white-labeled version of the original application, free to use licensed under [MIT License](#license). Application logic, print functionality and QR code generation are still provided.

The application and underlying questionnaire logic [are versioned and future updates will be provided](#application-updates).

⚠️ **Any institution/doctor’s office is free to implement on their domains – the medical responsibility and legal liability lie with the implementing institution.**

⚠️ **This application is only meant to be set up by software developers. Unfortunately, we can't provide a non-technical solution now.**

## Technical overview

### Preview

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/OSPRS/QuestionnaireApp)

### Main
The application runs dynamically in the browser. **It can be built and deployed to any service that provides a static web server with custom routing**.

It is based on a JavaScript software stack and uses the following technologies:

- [Stencil](https://stenciljs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [WebComponents](https://www.webcomponents.org/)

### Installation and development

To get further information on how to set up and deploy your own application, see the [development documentation](./docs/DEVELOPMENT.md).

### Customization

The QuestionnaireApp provides the following customization options:

- change words or add a new language

⚠️ **Note that there are several placeholder texts you must provide yourself.**

⚠️ **Note that the default fallback language is English (en) and it has to be available.**

- change colors
- change the application logo

To learn more about these options, see the [customization documentation](./docs/CUSTOMIZATION.md).

## Support and contributing

Before you open an issue, see the [customization documentation](./docs/CUSTOMIZATION.md).

## Application updates

As long as your are staying withing the guards set by the [customization documentation](./docs/CUSTOMIZATION.md) you can easily pull updates from this repository. [GitHub provides documentation on how to sync forks](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/syncing-a-fork).
