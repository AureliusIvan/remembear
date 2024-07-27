#!/bin/bash

# Check if .env file exists in the parent directory
if [ ! -f ./.env ]; then
  echo ".env file not found!"
  exit 1
fi

# Export each variable from ../.env file
export $(grep -v '^#' ../.env | xargs)