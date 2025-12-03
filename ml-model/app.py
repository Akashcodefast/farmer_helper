from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

model = joblib.load("model.pkl")
le = joblib.load("label_encoder.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    user_input = [[
        data["N"], data["P"], data["K"],
        data["temperature"], data["humidity"],
        data["ph"], data["rainfall"]
    ]]

    probs = model.predict_proba(user_input)[0]
    labels = le.inverse_transform(np.arange(len(probs)))

    top_indices = np.argsort(probs)[-5:][::-1]
    top_crops = [labels[i] for i in top_indices]
    top_scores = [round(float(probs[i]), 2) for i in top_indices]

    return jsonify({
        "crops": top_crops,
        "scores": top_scores
    })

if __name__ == "__main__":
    app.run(port=5001)
