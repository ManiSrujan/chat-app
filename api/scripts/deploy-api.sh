#!/bin/bash

# script stops immediately if a command exits with a non-zero status
set -e

deploy() {
    # move to repo directory
    cd '~/chat-app'

    # pull latest code from git
    git checkout master
    git pull origin master

    # move to api directory
    cd api

    # install dependencies
    npm ci

    # restart the service
    sudo systemctl restart chat-application
}

deploy