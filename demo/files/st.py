from dash import Dash, Input, Output, callback, dcc, html

app = Dash(__name__)
md = """
# Dash demo

See [The dash examples index](https://dash-example-index.herokuapp.com/) for more examples.
"""

app.layout = html.Div(
    children=[
        dcc.Markdown(children=md, link_target="_blank"),
        dcc.Dropdown(id="dropdown", options=["red", "green", "blue", "orange"]),
        dcc.Markdown(id="markdown", children=["## Hello World"]),
    ]
)


@callback(
    Output("markdown", "style"),
    Input("dropdown", "value"),
)
def update_markdown_style(color):
    return {"color": color}

print(app.server)