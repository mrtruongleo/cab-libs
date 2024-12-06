#!/bin/bash

# Define variables
LOCKFILE="/tmp/updateCoinlist.lock"
REPO_DIR="/root/update-coinlist"
FILE_PATH="$REPO_DIR/coinlist.json"
BRANCH="main" # Change to your branch name if different

# Check if the file has changed
if git diff --exit-code $FILE_PATH; then
    echo "No changes detected in $FILE_PATH."
else
    # Add, commit, and push changes if any
    git add $FILE_PATH
    git commit -m "Update coinlist.json"
    git push origin $BRANCH
    echo "Commited coinlist.json"
fi
