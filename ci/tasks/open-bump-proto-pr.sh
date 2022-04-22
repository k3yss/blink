#!/bin/bash

set -eu

cd repo

gh pr close ${BOT_BRANCH} || true
gh pr create -f\
  --title "chore(deps): bump dealer proto" \
  --base ${BRANCH} \
  --head ${BOT_BRANCH} \
  --label galoybot \
