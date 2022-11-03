#!/bin/sh

if ! [ -d node ]; then
  mkdir node
  curl -L https://nodejs.org/dist/v18.12.0/node-v18.12.0-linux-x64.tar.xz \
  | tar -xJ --strip-components=1 -C node
fi

export PATH="$PWD/node/bin:$PATH"
