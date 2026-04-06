from dataclasses import dataclass


@dataclass(frozen=True)
class TemplatePage:
    """Representa uma página renderizada por template Jinja."""

    slug: str

    @property
    def template_name(self) -> str:
        return f"{self.slug}.html"

    @property
    def component_css_path(self) -> str:
        return f"css/components/{self.slug}.css"
