
#!/bin/sh

# Set the user name and email to match the API token holder
# This will make sure the git commits will have the correct photo
# and the user gets the credit for a checkin
git config --global user.email "pmlopes@gmail.com"
git config --global user.name "pmlopes"
git config --global push.default current

# Get the credentials from a file
git config credential.helper "store --file=.git/credentials"

# This associates the token with the account
echo "https://${GITHUB_TOKEN}:@github.com" > .git/credentials

# Make sure that the workspace is clean
# It could be "dirty" if
# 1. package-lock.json is not aligned with package.json
# 2. npm install is run
git checkout -- .

# Update sw.js and index.html versions
gulp kill-cache
git add dist/sw.js dist/index.html

# Echo the status to the log so that we can see it is OK
git status

# Run the deploy build and increment the package versions
# %s is the placeholder for the created tag
npm version patch -m "Release version %s [skip ci]"

# This pushes the new version release
git push
git push --tags

echo "Bumped new release"