/**
 * EasyAsync.js
 * https://github.com/kevinfmoody/EasyAsync.js
 *
 * Copyright 2014 Kevin Moody
 * Released under the MIT license
 *
 * Manage the flow of asynchronous Javascript functions, as well
 * as their function dependencies, without the need for countless
 * nested callbacks. For quick start instructions and examples, visit
 * the EasyAsync.js GitHub page. 
 */


"use strict";


var EasyAsync = {};


// Requirements and jobs
EasyAsync._reqs = {};
EasyAsync._jobs = [];


/**
 * Registers a named action. If the second, optional parameter
 * is specified, a group of actions is instead registered, and the
 * number of actions specified must be completed before any
 * dependencies will be run.
 *
 * @param {String} name: The name of the action or action group to
 *                       be registered. This must be unique from
 *                       any previously registered actions.
 * 
 * @param {Int} [Optional] num: The number of actions that must
 *                              be completed before any dependent
 *                              functions will be executed.
 *
 * @return {Function} finish: A wrapped version of this.finish()
 *                            bound to the specified action name.
 */
EasyAsync.start = function(name, num) {
  num || (num = 1);
  if (this._isRegistered(name)) {
    if (this._reqs[name].count == -1) {
      this._reqs[name].count = num;
    } else {
      throw 'Task name already registered.';
    }
  } else {
    this._reqs[name] = {
      count: num,
      jobIds: []
    };
  }
  return function() {
    this.finish(name);
  }.bind(this);
};


/**
 * Marks an action or action group as finished. If the action was
 * registered as an action group with a number of sub actions,
 * then finish must be called that number of times before
 * dependecies are triggered.
 *
 * @param {String} name: The name of the action or action group
 *                       to be marked as finished. The action must
 *                       first be registered.
 */
EasyAsync.finish = function(name) {
  if (!this._isRegistered(name)) {
    throw 'Task name not registered.';
  }
  this._reqs[name].count <= 0 || this._reqs[name].count--;
  this._runJobs(name);
};


/**
 * Registers a job to be completed after the listed actions
 * have completed.
 *
 * @param {String} name: The name of the actions that must be
 *                       marked as fully completed before the job
 *                       will begin.
 * 
 * @param {Function} job: The function job to be executed after
 *                        the provided actions are complete.
 */
EasyAsync.after = function(names, job) {
  var jobId = this._jobs.length;
  this._jobs[jobId] = {
    job: job,
    reqs: names
  };
  var numNames = names.length;
  for (var i = 0; i < numNames; i++) {
    var name = names[i];
    if (this._isRegistered(name)) {
      this._reqs[name].jobIds.push(jobId);
      this._runJobs(name);
    } else {
      this._reqs[name] = {
        count: -1,
        jobIds: [jobId]
      };
    }
  }
};


// Check if action name has already been registered
EasyAsync._isRegistered = function(name) {
  return typeof this._reqs[name] !== 'undefined';
};


// Run dependent jobs if action has completed
EasyAsync._runJobs = function(name) {
  var jobIds = this._reqs[name].jobIds,
      numJobs = jobIds.length,
      remainingJobIds = [];
  for (var i = 0; i < numJobs; i++) {
    if (!this._runJob(jobIds[i])) {
      remainingJobIds.push(jobIds[i]);
    }
  }
  this._reqs[name].jobIds = remainingJobIds;
};


// Run dependent job if all actions have completed
EasyAsync._runJob = function(jobId) {
  var reqs = this._jobs[jobId].reqs,
      numReqs = reqs.length;
  for (var i = 0; i < numReqs; i++) {
    if (!this._isRegistered(reqs[i]) || this._reqs[reqs[i]].count != 0) {
      return false;
    }
  }
  this._jobs[jobId].job();
  delete this._jobs[jobId];
  return true;
};


// For Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EasyAsync;
}