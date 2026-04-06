from flask import Flask
from pathlib import Path

from portfolio.presentation.web.routes import web_blueprint


def create_flask_app() -> Flask:
    """Cria e configura a aplicação Flask."""

    project_root = Path(__file__).resolve().parents[4]
    flask_app = Flask(
        __name__,
        template_folder=str(project_root / 'templates'),
        static_folder=str(project_root / 'static'),
        static_url_path='/static',
    )
    flask_app.register_blueprint(web_blueprint)
    return flask_app
