# Voxieverse

[Voxieverse](https://zonomaly.com/voxieverse/)

## Description
Voxieverse is a platform designed for sharing ideas, having discussions, and discovering new perspectives. Join the conversation and explore a space where your voice matters.

## Getting started
This guide will help you set up the development environment for Voxieverse using Docker Compose

### Prerequeisites
Ensure you have the following installed on your machine:
 - Docker
 - Docker Compose

### Setting up the environment
1. git clone https://github.com/joshmasterton/voxieverse.git
2. cd voxieverse
3. create a .env.dev file in the root dir that uses these configuration:
    - POSTGRES_USER=
    - POSTGRES_PASSWORD=
    - DB_URL='postgresql://username:password@postgres:5432'
    - CLIENT_URL='http://localhost:9000'
    - VITE_API_URL='http://localhost:9001/voxieverse'
    - PORT=9001
    = ACCESS_TOKEN_SECRET=
    - REFRESH_TOKEN_SECRET=
    - AWS_ACCESS_KEY=
    - AWS_SECRET_ACCESS_KEY=
    - AWS_REGION=
    - AWS_BUCKET=
4. Build the container with docker-compose build
5. Run the container with docker-compose up -d
6. Run client tests with docker-compose run test-client
7. Run api tests with docker-compose run test-api
8. Remove a container by using docker-compose down

## Contributing
If you want to contribute to Voxieverse, please follow the standard Github workflow:
  1. For the repo
  2. Create a new branch
  3. Make your changed
  4. Push your changed and create a pull request 
