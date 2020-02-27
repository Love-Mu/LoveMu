#!/bin/sh
cd client
ng build
wait
rm -r ../core/dist
wait
mv dist ../core/
