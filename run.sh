#!/bin/bash
set -eux
< /dev/urandom base64 | head -n 1000000 >random
< random base64 | gzip >random.64.gz
python3 -m http.server 8001 &
xdg-open http://localhost:8001/base.html

