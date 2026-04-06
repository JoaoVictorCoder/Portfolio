from portfolio.domain.pages import TemplatePage

HOME_PAGE_SLUG = "index"


def get_home_page() -> TemplatePage:
    """Retorna o descritor da página inicial."""

    return TemplatePage(slug=HOME_PAGE_SLUG)


def get_dynamic_page(page_slug: str) -> TemplatePage:
    """Retorna o descritor da página dinâmica solicitada pela rota."""

    return TemplatePage(slug=page_slug)
