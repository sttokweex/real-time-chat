# real-time-chat



## Table of Contents

- [About The Project](#about-the-project)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Docker Compose Commands](#docker-compose-commands)


## About The Project

This project is a **Real-Time Chat Application** that enables users to engage in live conversations within various channels. The application is designed to facilitate seamless communication among users, making it ideal for team collaboration, community discussions, or casual chatting.

### Built With

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)


## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have **Docker** installed on your machine. You can download it from [Docker's official website](https://www.docker.com/get-started).
- You have **Docker Compose** installed. Docker Desktop includes Docker Compose by default. If you need to install it separately, follow the instructions on the [Compose installation page](https://docs.docker.com/compose/install/).

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sttokweex/real-time-chat
   cd real-time-chat
2.Build the Docker images and start the containers using Docker Compose:
  ```bash
docker-compose up --build
```
This command will build the images defined in your docker-compose.yml file and start the services.
## Usage
Once the containers are running, you can access your application via:
Web Application: Open your web browser and navigate to http://localhost:3000.
## Stopping the Application
To stop the application, press CTRL + C in the terminal where Docker Compose is running or run:
```bash
docker-compose down
```

This command will stop and remove all running containers defined in your docker-compose.yml.
## Docker Compose Commands
Here are some useful Docker Compose commands:
Start services:
```bash
docker-compose up
```
Stop services:
```bash
  docker-compose down
```
  Rebuild images (useful if you've made changes):
``` bash
docker-compose up --build
```
View logs:
```bash
docker-compose logs
```
Run a one-time command in a service:
```bash
docker-compose run <service_name> <command>
```
<img width="1710" alt="image" src="https://github.com/user-attachments/assets/fe5810b6-3002-4e1b-8214-9d3497577030">
<img width="1710" alt="image" src="https://github.com/user-attachments/assets/e3f636a4-06cd-414d-b8ad-ea75b83e8afa">

