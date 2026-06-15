#!/bin/sh
cd "$(dirname "$0")"
echo "SNOMED Navigator running at http://localhost:8080"
python3 -m http.server 8080
