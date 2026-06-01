#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🚀 GSC Auto-Submit Runner"
echo "========================="

PYTHON_CMD=""
if command -v python3 &>/dev/null; then
  PYTHON_CMD="python3"
elif command -v python &>/dev/null; then
  PYTHON_CMD="python"
else
  echo "❌ Python not found. Please install Python 3."
  exit 1
fi

if ! $PYTHON_CMD -c "import google.oauth2" 2>/dev/null; then
  echo "📦 Installing Google API dependencies..."
  $PYTHON_CMD -m pip install google-auth google-api-python-client --quiet
fi

DAYS="${1:-1}"
echo ""
echo "📅 Checking articles from the last $DAYS day(s)..."
echo ""

cd "$PROJECT_DIR"
$PYTHON_CMD scripts/auto-submit-gsc.py --days "$DAYS"

echo ""
echo "✅ Done!"
