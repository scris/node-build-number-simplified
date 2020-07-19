# NBNS
This package (`node-build-number-simplified`, abbreviated as "NBNS") is build upon `node-build-number` , which updates the `package.json` of your project with build information. Different from the original package, **NBNS simplifies the metadata**.

You only need to add the `nbns` cli command to your build steps to have the build info updated,
and the build number incremented. 

    "scripts": {
        "build": "nbns && npm run project-dist-task"
    }

## Example of build metadata in package.json

    "build": {
        "number": 4,
        "timestamp": "6/16/2020, 8:24:38 PM"
    }
      
## Incrementing the Version Number

Supposing you have a project with version 0.3.6 and build 12. The following commands will bump the version up 
as shown in the examples below.

    nbns --major
    
Version 1.0.0 build 0.
    
    nbns --minor
    
Version 0.4.0 build 0.

    nbns --rev
    
Version 0.3.7 build 0.