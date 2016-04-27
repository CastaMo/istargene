#!/bin/bash

rm -rf ./static
rm -rf ./views
cp -r public/bin ./static
cp -r public/views ./views
