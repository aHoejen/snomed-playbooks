#!/bin/sh
cd "$(dirname "$0")"
echo "SNOMED Navigator running at http://localhost:8080 (live reload enabled)"
npx live-server --port=8080 --no-browser .
