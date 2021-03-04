#!/bin/bash
set -eux
python3 -m http.server 8001 &
xdg-open http://localhost:8001/base.html

