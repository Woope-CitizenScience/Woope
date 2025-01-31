# Regeneration of Standing Rock’s Lakota and Dakota Nations

## Overview
Addressing environmental and socio-economic challenges in Standing Rock’s Lakota and Dakota Nations, focusing on people, land, water, and air.

## Local Setup
- Install Node v20, I recommend using [Node Version Manager](https://github.com/nvm-sh/nvm)
- You will need to place `.env` files in the `api` and `Citizen-Science` directories with the following contents:
  - `api/.env`:
    ```
    ACCESS_TOKEN_SECRET=39b3cfd461ccb82ba097358c1c0557bbfac4a1a9fbd9bfc6e1bac511e7c9ca60
    ACCESS_TOKEN_LIFE=15m
    REFRESH_TOKEN_SECRET=8c3cd2786ddf92f44f85af2694572241c9c0571cfc4e173e5c86a4fa82dd51cc
    REFRESH_TOKEN_LIFE=30d
    ```
  - `Citizen-Science/.env`:
    ```
    EXPO_PUBLIC_API_URL=http://<YOUR IP ADDRESS OF THE COMPUTER RUNNING THE API>:3000
    example: EXPO_PUBLIC_API_URL=http://192.168.0.100:3000
    ```
- `cd Citizen-Science` to enter the React Native project
- `npm install` to install dependencies
- `npx expo start` to start the Expo server
- Download the Expo app on your phone and scan the QR code to run the app on your phone
- Install Docker Desktop
- Now `cd` into the `api` directory
- `npm install`
- Run `docker compose build` to build the API and PostgreSQL image
- Run `docker compose up` to start the API and PostgreSQL server
- Once Postgres is running, run `npx db-migrate up` in the `api` directory to run the migrations
- You can now access the API at `localhost:3000`, check `/health`

### Admin Website Local Setup

- From the `Woope` directory, `cd` into the `woope-admin` directory
- `npm install` to install dependencies
- Create a new `.env` file with the following contents:
  - VITE_API_URL=http://localhost:3000
- `npm run dev` to start the Vite server
- In the terminal where it says Local: http://localhost:5173/, `ctrl + click` on the link to open the website in your default browser

## Challenges & Focus
- **Challenges:** Poverty, unemployment, limited healthy living options, restricted data access.
- **Regeneration Focus:** Environmental issues, language identity, health impacts of air and water, healthy food systems, technology access, sustainable living.

## Citizen Science Team
Collaboration among CSUN ARCS, Sitting Bull College FIARE & PERC Centers, community collaborators, industry experts, JPL collaborators, and students.

## Vision & Goals
Enhancing NASA and EPA scientific data, understanding atmospheric systems, informing policies, improving environmental health, and bettering the quality of life for the Dakota/Lakota Nation.

## Mobile Application
A platform for crowdsourcing data, interpreting weather impacts, and fostering community engagement.

## Collaborators
- CSUN ARCS
- Sitting Bull College (FIARE, PERC)
- Local Community Groups
- JPL [Ideas Digital Twin](https://ideas-digitaltwin.jpl.nasa.gov/aqacf/)
- Standing Rock Telecom

## Project Outcomes
Advocacy for human rights, social and environmental justice, community empowerment, and sustainable practices.

## Work Plan
From project initiation to app launch, including team formation, design, prototype development, and testing.

## Citizen Science Goals & Community Needs
Enhancing atmospheric models, community engagement, data sharing, and addressing local needs like RideShare and Arts in the Park.

## Development Process
- **Methodology:** Agile Development with bi-weekly sprints.
- **Tools:** Slack, Jira, GitHub.

## Team Organization
Focus on discovery, requirements, authentication, architecture, coding, testing, and community needs.

## Transforming Needs to Software Requirements
Capturing community discussions, facilitating focus groups, and integrating community input.

