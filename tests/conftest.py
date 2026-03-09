import sys
import os

# Make backend package importable from the top-level tests directory
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))
