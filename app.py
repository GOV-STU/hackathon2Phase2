#!/usr/bin/env python3
"""
Hugging Face Space Compatibility Wrapper
This file ensures compatibility with Hugging Face Spaces
"""

import os
import sys

# Import the main app from backend
try:
    from backend.app.main import app
except ImportError:
    # If the import fails, provide helpful error message
    print("❌ Could not import backend application")
    print("Make sure:")
    print("1. Backend directory exists with app/ subdirectory")
    print("2. All dependencies are installed")
    print("3. main.py exists in backend/app/")
    sys.exit(1)

if __name__ == "__main__":
    import uvicorn

    # Get port from Hugging Face environment
    port = int(os.environ.get("PORT", 8000))
    host = "0.0.0.0"

    print(f"🚀 Starting FastAPI server on {host}:{port}")
    print(f"📊 Health check: http://localhost:{port}/health")
    print(f"📚 API Docs: http://localhost:{port}/docs")

    uvicorn.run(
        app,
        host=host,
        port=port,
        reload=False,
        log_level="info"
    )