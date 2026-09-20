#!/usr/bin/env bash
K="${1:-$(grep '^GOOGLE_API_KEY=' .env | cut -d= -f2-)}"
C="${2:-$(grep '^GOOGLE_SEARCH_ENGINE_ID=' .env | cut -d= -f2-)}"
curl -s "https://www.googleapis.com/customsearch/v1?q=test&key=$K&cx=$C" --max-time 30 \
  | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{const d=JSON.parse(s);console.log(d.error?('FAIL '+d.error.code+': '+d.error.message):('OK - '+((d.items||[]).length)+' results'))}catch(e){console.log('unparseable: '+s.slice(0,200))}})"
