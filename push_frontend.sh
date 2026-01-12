#!/bin/bash
set -e

# 1. Initialize Git
if [ ! -d ".git" ]; then
    git init
    echo "Initialized empty Git repository."
else
    echo "Git repository already initialized."
fi

# 2. Configure Remote
REMOTE_URL="https://github.com/Nakul-28/BrAInwave-2.0-Project.git"
if git remote get-url origin > /dev/null 2>&1; then
    git remote set-url origin "$REMOTE_URL"
    echo "Remote 'origin' updated."
else
    git remote add origin "$REMOTE_URL"
    echo "Remote 'origin' added."
fi

# 3. Add & Commit
git add .
if ! git diff-index --quiet HEAD --; then
    git commit -m "Snapshot: Frontend and Demo ML Refactor"
    echo "Changes committed."
else
    echo "No changes to commit."
fi

# 4. Branch & Push
BRANCH_NAME="frontend_and_demo_ml"
# Create branch if not exists, else switch
git checkout -B "$BRANCH_NAME"
echo "Switched to branch '$BRANCH_NAME'."

echo "Pushing to GitHub..."
git push -u origin "$BRANCH_NAME"
echo "✅ Done!"
