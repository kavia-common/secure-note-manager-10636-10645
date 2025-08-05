#!/bin/bash
cd /home/kavia/workspace/code-generation/secure-note-manager-10636-10645/notes_masking_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

