# -*- coding: utf-8 -*-
with open("bistro/index.html", "r", encoding="utf-8") as f:
    content = f.read()

import re
m = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
if m:
    js = m.group(1)
    print(f"Script length: {len(js)} chars")
    print(f"Script starts with: {js[:100]}")
    print()
    
    # Try to find the exact error by narrowing down
    for end in range(1, len(js)+1):
        try:
            compile(js[:end], '<script>', 'exec')
        except SyntaxError as e:
            print(f"Syntax error at position {end} (line {js[:end].count(chr(10))+1}): {e.msg}")
            # Show context around the error
            start = max(0, end-80)
            ctx = js[start:end+40]
            print(f"  Context: ...{repr(ctx)}...")
            print(f"  Error at: ...{repr(js[max(0,end-30):end])}[HERE]{repr(js[end:min(len(js),end+30)])}...")
            break
    else:
        try:
            compile(js, '<script>', 'exec')
            print("No syntax errors found")
        except SyntaxError as e:
            print(f"Full script error: {e.msg} at line {e.lineno}")
