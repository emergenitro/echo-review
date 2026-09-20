#!/usr/bin/env bash
K="${1:-$(grep '^TAVILY_API_KEY=' .env | cut -d= -f2-)}"
curl -s https://api.tavily.com/search \
  -H "Authorization: Bearer $K" \
  -H "Content-Type: application/json" \
  -d '{"query":"test","max_results":1}' \
  --max-time 30 \
  | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{const d=JSON.parse(s);console.log(d.detail?('FAIL: '+JSON.stringify(d.detail)):('OK - '+((d.results||[]).length)+' results'))}catch(e){console.log('unparseable: '+s.slice(0,200))}})"
