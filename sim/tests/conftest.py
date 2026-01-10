import sys
from pathlib import Path

# Ensure both the `sim/src` and its parent `sim` directories are on sys.path
# so tests can import `app` (under sim/src) and `src` (the package) correctly.
ROOT = Path(__file__).resolve().parents[1]  # sim/
SRC = ROOT / "src"  # sim/src
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

