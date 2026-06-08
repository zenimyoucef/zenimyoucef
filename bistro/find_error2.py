import re

with open("bistro/index.html", "r", encoding="utf-8") as f:
    content = f.read()

m = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
if m:
    js = m.group(1)
    
    # Try to compile the full script
    try:
        compile(js, '<script>', 'exec')
        print("NO SYNTAX ERRORS")
    except SyntaxError as e:
        print(f"ERROR: {e.msg}")
        print(f"Line: {e.lineno}, Offset: {e.offset}")
        if e.lineno:
            lines = js.split('\n')
            if e.lineno <= len(lines):
                line = lines[e.lineno - 1]
                print(f"Line content ({len(line)} chars):")
                print(f"  {line[:200]}")
                if e.offset and e.offset <= len(line):
                    start = max(0, e.offset - 40)
                    end = min(len(line), e.offset + 40)
                    print(f"  Around error: {repr(line[start:end])}")
                    marker = ' ' * (e.offset - start - 1 if e.offset > start else 0) + '^'
                    print(f"  {marker}")
