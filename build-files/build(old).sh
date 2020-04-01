#!/bin/sh
cd client
ng build
wait
rm -r ../core/dist
wait
mv dist ../core/
wait
cd ../core/
mkdir uploads
cd temp
cp * ../uploads
wait
cd ..
mv uploads dist/client