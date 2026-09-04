from flask import Flask, request, jsonify
import subprocess
import json
import os

app = Flask(__name__)

NODE_SCRIPT_PATH = os.path.join(os.path.dirname(__file__), "www", "js", "run_segments.js")


@app.route("/HtmltoSegments", methods=["POST"])
def html_to_segments():
    data = request.get_json(silent=True) or {}
    html = data.get("html", "")

    if not html or not html.strip():
        return jsonify({"result": "Content for translate is not given or is empty"}), 500

    try:
        proc = subprocess.run(
            ["node", NODE_SCRIPT_PATH],
            input=html and json.dumps({"html": html}),
            capture_output=True,
            text=True,
            encoding="utf-8",
            timeout=60,
        )
    except subprocess.TimeoutExpired:
        return jsonify({"result": "Processing timed out"}), 500
    except FileNotFoundError:
        return jsonify({"result": "Node.js executable not found. Make sure 'node' is installed and in PATH."}), 500

    if not proc.stdout.strip():
        return jsonify({"result": proc.stderr or "Unknown error from Node process"}), 500

    try:
        output = json.loads(proc.stdout)
    except json.JSONDecodeError:
        return jsonify({"result": f"Invalid response from Node: {proc.stdout}"}), 500

    if proc.returncode != 0 or "error" in output:
        return jsonify({"result": output.get("error", "Unknown error")}), 500

    return jsonify({"result": output["result"]})


if __name__ == "__main__":
    app.run(port=5000, debug=True)
