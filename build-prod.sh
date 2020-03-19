#!/bin/sh
cd client
ng build --prod
wait
rm -r ../core/dist
wait
mv dist ../core/
