# Best Practices
The practices listed here are in addition to, not exclusive of applicable [Mfapps Best Practices] [best].

1. ## Refactoring  
Given our rapid release cycle, every sprint must revolve around __present need__. As such:
  + All changes must satisfy this requirement to be in a sprint.
  + Any necessary changes that do not, must be done after all other tasks.

2. ## File Naming
All files should be named according to either the class they define or the set of functionality they encapsulate with an underscore between semantic elements of the name. For example:
> __workspace_controller.js__  
> Not *workspaceController*, *workspace-controller* or *WorkspaceController*

3. ## Checking in to [SVN] [repo]
In addition to being done frequently and regularly, each check-in should:
  + Address a single functional concern whenever possible. Keep the logs simple.
  + Reference the applicable JIRA issue. If there is not one, there should be.
  + Be followed by closing the JIRA issue (if resolved), referencing the closing commit.

4. ## Documentation
  4.1 [Wiki] [wiki]: Information necessary for anyone external to the Dev team
  To Do -

  4.2 __Automated Documentation__: Information for the Dev team.
  [Groc] [groc] has limited support for [javadoc tags] [javadoc]. So while we use these to document whenever possible, some times we must use them differently than intended because the tag we want is not yet supported. Below, we define the tags we are using and how:

    4.2.1 *Documenting Files* 
    Every file should be documented with at least the following tags:
      + _@description_  
      + _@author_ | _@authors_  
      + _@since_  
      + A _markdown style header_ naming the file is also good

    Example:  
    <code>
    /** # Workspace Controller 
    __@description__ This is the controller for a workspace. It handles...  
    __@authors__ Firstname Surname < email@mathforum.org >, ...  
    __@since__ 1.0.0  
    */
    </code>

    4.2.2 *Documenting Methods* 
    Every function should be documented with at least these tags as applicable:
      + _@public_ | _@protected_ | _@private_
      + _@method_
      + _@description_
      + _@param_
      + _@throws_
      + _@return_

    Example:
    <code>
    /** 
    __@public__  
    __@method__ doSomething  
    __@description__ This method does something given a param  
    __@param__ {Object} name    Param name is of type Object  
    __@throws__ {BadError} Throws an error of type BadError  
    __@return__ {String} A string of characters is returned  
    */
    </code>

    4.2.3 *Additional Documentation* 
    If you feel, the above are not sufficient to document a file or method, you may add these
      + _@todo_ - Use to document any changes or addition you feel are needed
      + _@howto_ - Use to give some additional description (does not have to be usage related)
      + _@example_ - Use to give usage examples (only a few canonical ones)
      + _@see_ - Use with [Markdown style links] [md] to reference relevant sources.

5. ## Code
We use [JSHint] [jshint] to enforce the [Douglas Crockford Code Conventions for JavaScript] [crockford]. For the most part, if your code passes the test you should be fine. However, the various members of our stack also have their own conventions. See below:

  5.1 [Ember Naming Conventions] [ember-best]  
  __Note__:
  + Ember relies heavily on its naming conventions to provide some automated features, so it is important we follow these.
  + The [Ember plugin] [emberI] should catch some of these.

  5.2 [Node JS Conventions] [node-best]  
  __Note__: 
  + Node JS relies heavily on callbacks, as do most modules built on top of it. As such the standard for defining methods is designed to easily make them callable:
    
    <code>function doSomething(error, parameter1, parameterN, callback)</code>

6. ## Testing
We employ [Test Driven Development] [tdd] in our process, and try hard to stick to [The 3 laws of TDD] [tdd-laws]:
  1. You are not allowed to write any production code, unless it is to pass a failing test.
  2. You are not allowed to write any more of a test than is sufficient to fail.
  3. You are not allowed to write any more production code than is sufficient to pass test.


[node]: http://nodejs.org/ "Node JS"
[grunt]: http://gruntjs.com/ "Grunt JS"
[ember]: http://emberjs.com/ "Ember JS"
[mongoose]: http://mongoosejs.com/ "Mongoose JS"
[mongo]: http://mongodb.org/ "MongoDB"
[jshint]: http://jshint.com/ "JS Hint"
[qunit]: http://qunitjs.com/ "Qunit"
[jasmine]: http://jasmine.github.io/ "Jasmine"
[repo]: http://svn.mathforum.org/websvn/listing?repname=Mathforum&path=/projects/encompass/trunk "SVN"
[ci]: http://dev.mathforum.org/jenkins/job/encompass/ "Jenkins"
[groc]: http://nevir.github.io/groc/ "Groc"
[wiki]: http://mathforum.org/pow08/index.php/Encompass "Encompass Wiki"
[javadoc]: http://docs.oracle.com/javase/1.5.0/docs/tooldocs/windows/javadoc.html/javadoctags "Javadoc Tags"
[mfapps]: http://mathforum.org/pow08/index.php/Mfapps "PoWs"
[best]: http://mathforum.org/pow08/index.php/BestPractices "PoWs best practices"
[crockford]: http://javascript.crockford.com/code.html "JS conventions"
[ember-best]: http://emberjs.com/guides/concepts/naming-conventions/ "Ember Practices"
[node-best]: http://github.com/felixge/node-style-guide "Node Practices"
[emberI]: http://chrome.google.com/webstore/search/ember%20inspector
[nodeI]: http://github.com/node-inspector/node-inspector
[md]: http://daringfireball.net/projects/markdown/syntax#link
[tdd]: http://en.wikipedia.org/wiki/Test-driven_development
[tdd-laws]: http://butunclebob.com/ArticleS.UncleBob.TheThreeRulesOfTdd
