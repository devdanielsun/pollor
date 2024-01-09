# Pollor - The Anonymous Voting System

A poll system where users can create polls and vote anonymous on polls. Tech stack: Angular, C# .NET Core, MySQL db, Github Actions and Azure as cloud host.

[![license](https://img.shields.io/github/license/devdanielsun/pollor)](https://github.com/devdanielsun/pollor/blob/main/LICENSE.txt)
[![Frontend - Build and Deploy](https://img.shields.io/github/actions/workflow/status/devdanielsun/pollor/azure-static-web-apps-witty-forest-0d354f403.yml?label=Frontend%20-%20Build%20and%20Deploy)](https://github.com/devdanielsun/pollor/actions/workflows/azure-static-web-apps-witty-forest-0d354f403.yml)
[![Backend - Build and Deploy](https://img.shields.io/github/actions/workflow/status/devdanielsun/pollor/main_pollor-backend.yml?label=Backend%20-%20Build%20and%20Deploy)](https://github.com/devdanielsun/pollor/actions/workflows/main_pollor-backend.yml)

### Requirements

* npm `10.x.x` >= `10.2.4`
* node.js `18.x.x` >= `21.3.0`
* .NET `8.x`

### Start project through Microsoft Visual Studio 2022

Clone the project and open the folder in the program. And just hit `> Start`

### Start project manually through CLI
 
Make sure the .env files are made and contain the correct values, and the mysql database is running.
Next to that those two commands should be enough the start both the server and client.
 
- 1. `cd pollor.Server`
-
- 2. `dotnet run --launch-profile https`

---

If that doesn't start up the backend and frontend, please take a look in:

The [Backend README.md](/pollor.Server/README.md) to start up the C# .NET backend

The [Frontend README.md](/pollor.client/README.md) to start up the Angular frontend