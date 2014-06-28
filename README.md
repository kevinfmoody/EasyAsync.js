EasyAsync.js
========
Manage the flow of asynchronous Javascript functions, as well as their function dependencies, without the need for countless nested callbacks.

Using EasyAsync.js, you can quickly create complex, asynchronous logic and execution flows, ensuring that certain code blocks always run in a predictable order.

Drop EasyAsync.js in your web directory or into a Node.js environment -- either way, it's ready to go!

Library Methods
========
**`EasyAsync.start(ActionName [, NumberOfActions]);`**
Use start() to signal the beginning of a block of code of importance -- that is, one that is depended on by another block of code. If a number of actions is specified, then that number of actions is required to be 
marked as finished before any dependent blocks of code can execute.

**`EasyAsync.finish(ActionName);`**
Use finish() to signal the end of a block of code of importance -- that is, one that is depended on by another block of code. This is often placed in asynchronous callbacks to signal the termination of the action. If a number of actions was passed in the corresponding start() call, then finish() must be that exact number of times. For example, if `EasyAsync.start('foo', 3)` is called, then `EasyAsync.finish('foo')` must be called 3 times.

**`EasyAsync.after(ActionArray, JobFunctionCallback);`**
Use after() to specify action dependencies that must be fully complete before the job function callback can be executed. Be sure to pass an array of action dependencies rather than a string, even if there is only one dependency.

Example Usage
========
```javascript

var foo = function() {

  //////////////////////////////////////////////////////////////////////////////
  // Step 1: Register the block of code as an action titled 'firstDependency' //
  //////////////////////////////////////////////////////////////////////////////
  var finish = EasyAsync.start('firstDependency');

  performSuperSlowAsynchronousCall(function(data) {

    ////////////////////////////////////////////////////////////////////////////
    // Step 2: Notify EasyAsync that the 'firstDependency' action is complete //
    ////////////////////////////////////////////////////////////////////////////
    finish();

  });

};

var bar = function() {

  ////////////////////////////////////////////////////////////////////////////
  // Step 3: Require actions 'firstDependency' and 'secondDependency' to be //
  // complete before executing the code block inside this function.         //
  ////////////////////////////////////////////////////////////////////////////
  EasyAsync.after(['firstDependency', 'secondDependency'], function() {

    doSomethingThatRequiresFirstAndSecondDependencies();

  });
  
};

var baz = function() {

  ///////////////////////////////////////////////////////////////////////////////
  // Step 4: Register the block of code as an action titled 'secondDependency' //
  ///////////////////////////////////////////////////////////////////////////////
  var finish = EasyAsync.start('secondDependency');

  performSuperSlowAsynchronousCall(function(data) {

    /////////////////////////////////////////////////////////////////////////////
    // Step 5: Notify EasyAsync that the 'secondDependency' action is complete //
    /////////////////////////////////////////////////////////////////////////////
    finish();

  });
  
  
};


/////////////////////////////////////////////////////////////////////////////////
// Step 6: Call the functions in any order and guarantee that the asynchronous //
// tasks will be completed fully prior to bar() being run.                     //
/////////////////////////////////////////////////////////////////////////////////
foo();
bar();
baz();


```