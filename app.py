from flask import Flask, abort, render_template
from jinja2 import TemplateNotFound

app = Flask(__name__)


@app.route("/")
def index() -> str:
    return render_template("index.html", component_css="css/components/index.css")


@app.route("/<name_page>")
def page(name_page: str) -> str:
    template_name = f"{name_page}.html"
    try:
        return render_template(template_name, component_css=f"css/components/{name_page}.css")
    except TemplateNotFound:
        abort(404)


if __name__ == "__main__":
    app.run(debug=True)
