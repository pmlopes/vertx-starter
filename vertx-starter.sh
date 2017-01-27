#!/bin/sh
set -e

# validate build tool
case $1 in
    maven)
        tool=$1
        shift
        ;;
    gradle)
        tool=$1
        shift
        ;;
    npm)
        tool=$1
        shift
        ;;
    stack)
        tool=$1
        shift
        ;;
esac

if [ ! -z "$tool" ]; then
    url="http://www.jetdrone.xyz/vertx-starter/#$tool?dependencies="
    # concatenate the dependencies
    for var in "$@"
    do
        url="$url$var,"
    done
    xdg-open $url
else
    echo "Error: No build tool selected."
    echo "  e.g.: $0 maven [[dependency], [dependency]...]"
    exit 1
fi
