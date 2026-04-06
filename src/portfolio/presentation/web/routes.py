from flask import Blueprint, abort

from portfolio.application.page_service import get_dynamic_page, get_home_page
from portfolio.infrastructure.template_gateway import FlaskTemplateGateway, TemplateRenderError

web_blueprint = Blueprint("web", __name__)


@web_blueprint.route("/")
def index() -> str:
    home_page = get_home_page()
    return FlaskTemplateGateway.render(home_page)


@web_blueprint.route("/<name_page>")
def page(name_page: str) -> str:
    requested_page = get_dynamic_page(name_page)
    try:
        return FlaskTemplateGateway.render(requested_page)
    except TemplateRenderError:
        abort(404)
