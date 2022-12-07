[![Open Preview of PoxApp-Charite](https://badgen.net/badge/Preview/Poxapp-Charite/blue?icon=github)](https://osprspoxappcharite.z13.web.core.windows.net/)
[![Open Preview of PoxApp-Stanford](https://badgen.net/badge/Preview/Poxapp-Stanford/blue?icon=github)](https://osprspoxappstanford.z13.web.core.windows.net/)

# PoxApp - a web-based personalized recommendation system for the mpox (monkeypox) virus.

PoxApp can help users to assess their medical condition better, prepare an appointment with a physician or get information on mpox virus (MPXV) testing and post-exposure vaccination. 

PoxApp was developed by a multidisciplinary planel of physicians, data scientists and researchers at Stanford University, Charité Universitätsmedizin Berlin, Berlin Institute of Health at Charité (BIH), Robert Koch Institute and Hasso Plattner Institute.

PoxApp combines a survey with picture-taking of skin lesions. PoxApp uses artificial intelligence (AI) and medical expert knowledge to assess the risk of a MPXV infection.

Every filled out questionnaire summarizes relevant medical information for future doctor’s consultation in the form of a summary page, printout or a QR code. Institutions with the technical setup can scan the provided QR code and retrieve the patient information quickly and without any physical contact.

By implementing the PoxApp, medical institution can speed up the patient registration process.

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
