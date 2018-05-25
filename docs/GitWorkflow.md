

# GIT REBASE WORKFLOW

1. `git checkout master`
1. `git pull --rebase upstream master`
1. `git push origin master`
1. `git checkout -b feature-branch`
1. `git add/git commit` (on feature branch)
1. `git pull --rebase upstream master`
1. `git push origin feature-branch`
1. Submit pull request (your feature branch to origin master)

## More Work to do
* Go to Step 1 in Git Rebase flow.

## Pull Reqeust Accepted? 
1. `git checkout master`
1. `git pull --rebase upstream master`
1. `git push origin master`


## Totally done
1. `git checkout master`
1. `git branch -d feature-branch`


## Troubleshooting
* `git remote -v` to see remote origins
* `git remote add upstream https://github.com/mathematicalthinking/encompass.git`
* if existing upsteam `git remote rm upstream`
