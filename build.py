import re
import json

with open("src/globals.json") as json_f:
    glob = json.load(json_f)

with open("src/styles.css") as css_in:
    css = css_in.read()
    for key, value in glob.items():
        css = css.replace("$"+key+"$", str(value))

    with open("static/styles.css", "w") as css_out:
        css_out.write(css)
