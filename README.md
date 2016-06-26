#Articulate ReadMe

This is work-in-progress prototype of a smart editor for journalists.

It builds and works (ish!) but isn't anywhere ready for use yet.

Version 1.0 will be released sometime in Summer 2016.

If you would like to know more, or help sponsor development of this project or be involved in it please get in touch with articulate@glitch.digital.

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
