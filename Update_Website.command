#!/bin/bash
cd "$(dirname "$0")"

echo 'const myFiles = [' > files.js

if ls pdfs/*.pdf 1> /dev/null 2>&1; then
    for f in pdfs/*.pdf; do
        base_name=$(basename "$f")
        echo "  \"$base_name\"," >> files.js
    done
fi

echo '];' >> files.js

echo "==========================================="
echo "✅ Website updated successfully!"
echo "Added $(grep -c 'pdfs/' files.js) PDF files to your website."
echo "You can now safely close this window."
echo "==========================================="
