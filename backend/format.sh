#!/bin/bash
# Format all Python files using Ruff
echo "Formatting Python files with Ruff..."
python -m ruff format .
python -m ruff check --fix .

echo "Formatting complete!"