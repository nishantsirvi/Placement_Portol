#!/bin/bash
# Exit on error
set -e

echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
