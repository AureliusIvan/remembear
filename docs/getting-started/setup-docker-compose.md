# Setup with Docker Compose 🐳

## Introduction

This guide will help you to setup the backend server for the Remembear app using Docker Compose.

## Setup

1. First, Run

```bash
# On root directory

# for development
docker compose -f docker/dev.docker-compose.yml --env-file=./.env up -d 

  
# for production
docker compose -f docker/prod.docker-compose.yml --env-file=./.env up -d
```

2. Then, you can access the backend server on `http://localhost:8000`

## References:

1. [Docker Compose Documentation](https://docs.docker.com/compose/)

