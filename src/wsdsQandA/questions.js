
/*
This file contains an array of functions that must be executed on the browser. 
Two values are returned, the domain used by the browser page and key found at 
the position defined in the function
*/


var document = {domain: 'answer domain'};
function questions(){
    return [
      function(keys) {var domain = document.domain;var keychain = keys();return {domain: domain, key: keychain.keys[0]};},
      function(keys) {var domain = document.domain;var keychain = keys();return {domain: domain, key: keychain.keys[11]};},
      function(keys) {var domain = document.domain;var keychain = keys();return {domain: domain, key: keychain.keys[21]};},
      function(keys) {var domain = document.domain;var keychain = keys();return {domain: domain, key: keychain.keys[34]};},
      function(keys) {var domain = document.domain;var keychain = keys();return {domain: domain, key: keychain.keys[45]};},
      function(keys) {var domain = document.domain;var keychain = keys();return {domain: domain, key: keychain.keys[54]};},
      function(keys) {var domain = document.domain;var keychain = keys();return {domain: domain, key: keychain.keys[67]};},
      function(keys) {var domain = document.domain;var keychain = keys();return {domain: domain, key: keychain.keys[72]};},
      function(keys) {var domain = document.domain;var keychain = keys();return {domain: domain, key: keychain.keys[88]};},
      function(keys) {var domain = document.domain;var keychain = keys();return {domain: domain, key: keychain.keys[90]};},
    ];
}

module.exports = questions;
