#!/bin/bash

# Define variables
LOCKFILE="/tmp/updateCoinlist.lock"
REPO_DIR="/root/cab-libs"
FILE_PATH="$REPO_DIR/coinlist.json"
BRANCH="main" # Change to your branch name if different

# Export PATH to ensure the correct Node version is used
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # Loads NVM if it's installed

# Check if the lock file already exists
if [ -e $LOCKFILE ]; then
    echo "Job is already running."
    exit 1
fi

# Create the lock file
touch $LOCKFILE

# Define cleanup function to remove the lock file upon script exit
cleanup() {
    rm -f $LOCKFILE
}

# Register the cleanup function to be called on exit
trap cleanup EXIT

# Change to repository directory
cd $REPO_DIR
echo "Updating coinlist..."

# Check Node.js version for debugging
# echo "Node version: $(node -v)" >> /root/update.log

# Run the update job
npm run updateCoinlist >> /root/update.log 2>&1
echo "Update Done, ... committing.."
# pull new update
git pull
# Check if the file has changed
if git diff --exit-code $FILE_PATH; then
    echo "No changes detected in $FILE_PATH."
else
    # Add, commit, and push changes if any
    git add $FILE_PATH
    git commit -m "Update coinlist.json"
    git push origin $BRANCH
fi