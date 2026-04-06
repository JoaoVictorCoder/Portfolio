from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parent
SOURCE_DIR = PROJECT_ROOT / 'src'

if str(SOURCE_DIR) not in sys.path:
    sys.path.insert(0, str(SOURCE_DIR))

from portfolio import create_flask_app

app = create_flask_app()


if __name__ == '__main__':
    app.run(debug=True)
