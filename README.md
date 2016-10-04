#Articulate ReadMe

This is work-in-progress prototype of a smart editor for journalists.

It builds and works (ish!) but isn't anywhere ready for use yet. It's a test bed for some of the tech we want to try out and see how well we might be able to turn into a real product, but we have now pushed back from targeting a specific release date (though some of the things we have learned from this will likely show up in other projects first).

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
