

> # Opensource customizable cloud based CRM using NodeJS, Express and MySQL                                                                                 
#### Lohith Nimmala
####  M.Sc in Comp Info Systems
####  Grand Valley State University
####  2019-02-26 19:29:58 Tuesday

## Project Background and Description

Any type of product based or service-based industry which has customer like entity irrespective of the size and domain of the industry has to handle their services using customer relationship management (CRM) platform. CRM mainly involve the Sales, Marketing, Service based business these kinds of business will be automated in CRM apps. Most part of CRM business are similar in any type of industry having similar entities at the same time each industry has its own business process and how these entities are defined as well how they communicated between them is different.

So an industry can develop such CRM app either from the scratch by themselves or be a part of organization which provides CRM apps which can be customizable. If you are choosing third party CRM most of the time it is just software as a service(SaaS), but if it also comes with database server and web server then it covers Infrastructure as a  Service(IaaS) and if that third party lets you customize with their own tools then it means they are providing Platform as a Service(PaaS).These days industries are looking for third party to handle SaaS, PaaS, IaaS that way complexity in maintenance of app would be less. One such provider is &quot;Salesforce CRM&quot; which is a licensed platform, but for organization which has very less usage compared what being provided by platforms like Salesforce its very challenging to find one such which suits as per their necessity. This project aims to develop on such application which would be fulfil that demand.

## Project Scope

As part of this project we will be developing an opensource CRM which will straight away gives a predefined CRM application to customer with certain standard CRM business process already established in it.

Some CRM entities which are common irrespective of type of domain of industry, these entities will be pre-defined and as stored in a common table for different Organization, but each organization will be able to see only their own records and Our customer can create more entities and customize the predefined as well as customer defined entities.

Customer will also be able to establish the business rules on each of these entities. Most demanding business in the CRM is case management and task management which will let user to define some rules on these entities to automate the CRM service in their application using java script functions defined and tied to respective entity. Example when a Case has been created to whom that has to be routed and what should happen when its created and closed these kinds of business can be defined using java script as per the requirement of particular industry. These java script functions act as before and after trigger actions on particular records which is being saved.

Users of particular organization will be created and its business customization will be managed by User whose profile is Admin and they can create additional profiles which will help them in customize the user access rights on each entity and their fields.

All the records will be saved in our own MySQL Database so customer don&#39;t need to maintain any webserver or database server to maintain their application ,business logic and their records

## High-Level Requirements

This system will include following High level Requirements(Major Features)

Each Major feature will be further subdivided into individual requirements and implemented later.

- MF1: Predefined CRM entities, database, page layouts are to be designed
 - MF1.1: Business logic and page layouts for predefined CRM entities
- MF2: Ability for first time user register as Admin for certain organization
- MF3: Ability for Admins to create more profiles and add users to their organization
- MF4: Ability for Admin to add new entities and customize existing and predefined entities
- MF5: Admin should be able to customize the business logic by designing the before and after triggers on each entity
- MF6: Other Users should be able to login, create, view and edit data as per the access rights set for their profiles.
- MF7: Registering as Organisation and testing all the  deliverable manually.
-  MF8: Automation Testing of the functional testing requirements using HP UFT.

## Technical Details

JavaScript&#39;s rising popularity has brought with it a lot of changes, and the face of web development today is dramatically different.it&#39;s all based on the open web stack (HTML, CSS and JS) running over the standard port 80. This all being managed using **Node.js** framework.

The main idea of Node.js: use non-blocking, event-driven I/O to remain lightweight and efficient in the face of data-intensive real-time applications that run across distributed devices.When discussing Node.js, one thing that should not be omitted is built-in support for package management using NPM, a tool that comes by default with every Node.js installation.

A full list of packaged modules can be found on the npm website or accessed using the npm CLI tool that automatically gets installed with Node.js. The module ecosystem is open to all, and anyone can publish their own module that will be listed in the npm repository.

Some of the most useful npm modules today are:

**express** - Express.js—or simply Express—a Sinatra-inspired web development framework for Node.js, and the de-facto standard for the majority of Node.js applications out there today.

**hapi** - a very modular and simple to use configuration-centric framework for building web and services applications

## Implementation Plan

Below are the stages involved in Designing this Project.

- 1.Analysis of entire business high level requirements and design the plan and requirement specifications

- 2.Register for Webserver(Heroku-Nodejs) and Database server(AWS-MySQL) , creating sandbox for development(my device) , initial database setup and deployment management(github).

- 3.Creating a Database in AWS and setup the required pre defined tables.

- 4.Creating the application which can connect to predefined tables and display the forms to  create , view and edit data.

- 5.Creating the logic which will let user to add new fields and manage them on new entities and pre defined entities.

- 6.Designing the logics for new user registration and Admin level manageable activities

- 7.Designing the test cases for each requirement and managing the deployment of each requirement before closing a requirement

- 8.Automation testing each set of requirement at end end of each Major deliverable

## Innovativeness &amp; Usefulness

Open source Customer Relationship Management (CRM) systems have a lot going for them: they&#39;re often less expensive, are more easily modified if you have an open-source-savvy IT staff, and if you lack that staff you can find developers readily and often at a less costly rate than for commercial or proprietary CRM applications. Open source CRM isn&#39;t for everyone, but if your business, or not for profit, has a pressing need to test-drive software before it buys, or to make some particular modifications to suit unique business requirements, open source business software systems should be a consideration.

Few of the open source CRMs are like SugarCRM, vTiger, SplendidCRM, CentraView but what this project make is unique is the above platforms are to be installed and managed at webserver and database server level but the organization instead our platform provides the All the servicer Saas,Pass and Iaas which is the most demanding aspect in IT services these days to have someone who can provide all the necessities. This application also has huge scope of defining and managing the high level of custom business as per organization rather than follow as per the set rules given by the open source crm apps.
