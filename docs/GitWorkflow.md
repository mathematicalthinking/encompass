

# GIT REBASE WORKFLOW

1. `git checkout master`
1. `git pull --rebase upstream master`
1. `git push origin master`
1. `git checkout -b feature-branch`
1. `git add/git commit` (on feature branch)
    * To close an issue, add 'closed #[github issue number]' to commit message
1. `git pull --rebase upstream master` (on feature branch)
1. `git push origin feature-branch`
1. Submit pull request (your feature branch to upstream master)

## More Work to do (Pull Request not accepted)
* Go to Step 5 in Git Rebase flow.

## Pull Request Accepted?
1. `git checkout master`
1. `git pull --rebase upstream master`
1. `git push origin master`


## Totally done
1. `git checkout master`
1. `git branch -d feature-branch`


## Troubleshooting
* `git remote -v` to see remote origins
* `git remote add upstream https://github.com/mathematicalthinking/encompass.git`
* if existing upstream `git remote rm upstream`
