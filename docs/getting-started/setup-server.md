# Getting Started with Backend Server 🚀

## Table of Contents 📚

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
    - [Docker setup](#docker-setup)
    - [Manual setup](#manual-setup)
- [References](#references)

## Introduction

This guide will help you to setup the backend server for the Remembear app. The backend server is built with Python and
FastAPI.
We mainly use postgresql as the database for the backend server since it widely used and has good performance (initially
we used it because there's a lot of free tier hosting service for it). Even though we use postgresql as the main
database, we might use other databases like MySQL or Aurora since we use SQLAlchemy as the ORM for the database,
although we need
to test it first (please make an issue if you want to use other databases).

Second, we also use Qdrant as the vector search engine for the backend server. Qdrant is a vector search engine that
used by Mem0AI project, see more documentation about Qdrant usage on Mem0AI
project [here](https://docs.mem0.ai/platform/overview).

## Setup

### Docker setup

1. First, Run

```bash
# On root directory

cp .env.example .env

```

### Manual setup

1. Install PostgreSQL
2. Install Qdrant

## References: