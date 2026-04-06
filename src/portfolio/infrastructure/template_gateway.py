from flask import render_template
from jinja2 import TemplateNotFound

from portfolio.domain.pages import TemplatePage


class TemplateRenderError(Exception):
    """Erro de renderização de template no gateway de infraestrutura."""


class FlaskTemplateGateway:
    """Adapter de renderização baseado no Flask/Jinja2."""

    @staticmethod
    def render(page: TemplatePage) -> str:
        try:
            return render_template(
                page.template_name,
                component_css=page.component_css_path,
            )
        except TemplateNotFound as error:
            raise TemplateRenderError from error
