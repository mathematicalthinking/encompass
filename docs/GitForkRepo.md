# GIT FORK REPO

1. fork this repo into your own github account (click fork in upper right of [EnCoMPASS page](https://github.com/mathematicalthinking/encompass)
1. On your own fork of this repo, click the clone or download button, and copy the ssh key link (e.g. git@github.com:--githubUserName--/encompass.git), or https web url (e.g. https://github.com/--githubUserName--/encompass.git)
1. cd to directory to be parent of repo
1. ensure there is no file or directory named encompass in it
1. git clone --your 'ssh key link' or 'https web url' here--
1. cd encompass
1. add remote repository.  first on your own fork of the repo, click the 'Clone or Download' button and copy the 'ssh key link' or 'https web url' into your clipboard:
    * through ssh, it should be:
    
      git remote add upstream git@github.com:mathematicalthinking/encompass.git
    * or through https, it should be:
    
      https://github.com/mathematicalthinking/encompass.git
1. git remote add upstream
1. git remote -v (to confirm)

