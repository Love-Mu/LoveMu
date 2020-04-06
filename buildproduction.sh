#!/bin/sh
cd client
ng build --prod
wait
mkdir ../core/public/
wait
mv -f dist/client/* ../core/public/
wait
mkdir ../core/public/uploads
wait
cp -r ../core/temp/* ../core/dist/client/uploads