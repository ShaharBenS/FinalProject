# workflow-management-system
Software Engineering Senior Project - This project is an intra-organizational for administrative processes management for the
Student Association of Ben-Gurion University of the Negev.

### The Problem Domain
This project deals with the domain of workflow management.
The workflow management system provides an infrastructure for creation, execution and
monitoring of a defined sequence of tasks, arranged as a workflow application.

### Context
The system will be built on top of a web framework which will assist with the processing of
HTTPS requests. As well, the system will interact with the following: a database that will save
relevant information, the client’s browser, a Microsoft Outlook account service that will
authenticate users and a file system module.

### Vision
The software project’s overall goals and objectives are:
* Optimizing the ongoing work of the Student Association workers.
* Establishing order in the management of bureaucracy in the organization.
* Saving time and effort from the Student Association’s employees.
* Monitoring the intra-organizational processes.
* Exporting processes reports.

## Built With
* [NodeJS](https://nodejs.org/en/) 
* [Express.js](https://expressjs.com/) web framework.
* [mongoDB](https://www.mongodb.com/) database.

## Tested With
* [Mocha](https://mochajs.org/) - Unit & Integration tests
* [Chai](https://www.chaijs.com/) - Unit & Integration tests
* [TestCafe](https://devexpress.github.io/testcafe/) - GUI & Acceptence tests
* [Artillery.io](https://artillery.io/) - Load & Stress tests
