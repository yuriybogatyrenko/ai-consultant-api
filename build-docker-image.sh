#!/usr/bin/env bash
###########################################################################
# Builds docker image and pushes as latest to the registry
###########################################################################

# Variables
TAG=`date '+%Y-%m-%d'`
NAME=myassistants
IMAGENAME=${NAME}:latest

# Git pull
echo "Running git pull..."
git pull
GIT_STATUS=$?

if [ $GIT_STATUS -ne 0 ]; then
  echo "Error: git pull failed. Please resolve any conflicts and try again."
  exit 1
fi

echo "git pull successful."

# Build docker image
echo "Building Docker image..."
docker build -t ${IMAGENAME} -f docker/Dockerfile .

# Deploy
echo "Deploying application..."
docker compose down && docker compose up -d

# Clear
echo "Cleaning up Docker system..."
docker system prune -a -f

# Push docker image
# echo "Pushing Docker image..."
# docker push ${IMAGENAME}

# Retag as latest
# LATEST_IMAGENAME=${NAME}:latest
# docker tag ${IMAGENAME} ${LATEST_IMAGENAME}

# Push the latest tag
# docker push ${LATEST_IMAGENAME}

echo "Deployment completed successfully."
