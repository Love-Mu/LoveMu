#!/bin/sh
cd client
ng build
wait
mkdir ../core/public/
wait
mv -f dist/client/* ../core/public/
wait
cp -r ../core/uploads/* ../core/public