#Articulate ReadMe

##Dependancies

Election: 1.2.2
Node: v6.2.1

##Building a test release

This will quickly build release for all platforms in ./build/test/

    npm run build-test

This is a quick preview release suitable for testing, but not for release.


##Building a production release

To build a production release you will need to have SSL certificates suitable for signing installed.

This will build production-ready releases for all platforms in ./build/

    npm run build-release