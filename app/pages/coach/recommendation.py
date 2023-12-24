from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.neighbors import NearestNeighbors

app = Flask(__name__)
cors = CORS(app, resources={r"/get_recommendations": {"origins": "http://10.0.2.2:5000"}})

# Existing player_profiles array
player_profiles = [
    {"name": "Player1", "position": "Forward", "height": 180, "weight": 75, "rating": 8},
    {"name": "Player2", "position": "Midfielder", "height": 170, "weight": 70, "rating": 7},
    {"name": "Player3", "position": "Defender", "height": 185, "weight": 80, "rating": 9},
    {"name": "Player4", "position": "Forward", "height": 175, "weight": 72, "rating": 7},
    {"name": "Player5", "position": "Midfielder", "height": 172, "weight": 68, "rating": 8},
    {"name": "Player6", "position": "Defender", "height": 183, "weight": 78, "rating": 8},
    {"name": "AAli", "position": "Defender", "height": 190, "weight": 88, "rating": 10},
    {"name": "Player7", "position": "Forward", "height": 177, "weight": 85, "rating": 3},
    {"name": "Player8", "position": "Midfielder", "height": 172, "weight": 70, "rating": 2},
    {"name": "Player9", "position": "Defender", "height": 169, "weight": 60, "rating": 10},
    {"name": "Player92", "position": "Defender", "height": 170, "weight": 61, "rating": 10},
    {"name": "Player93", "position": "Defender", "height": 168, "weight": 59, "rating": 10},
    {"name": "Player11", "position": "Forward", "height": 180, "weight": 75, "rating": 8},
    {"name": "Player22", "position": "Midfielder", "height": 170, "weight": 90, "rating": 7},
    {"name": "Player47", "position": "Defender", "height": 182, "weight": 87, "rating": 9},
    {"name": "Player77", "position": "Forward", "height": 178, "weight": 66, "rating": 8},
    {"name": "Player99", "position": "Midfielder", "height": 200, "weight": 90, "rating": 4},
    {"name": "Player85", "position": "Defender", "height": 160, "weight": 60, "rating": 6},
    {"name": "Player100", "position": "GK", "height": 160, "weight": 60, "rating": 6},
    {"name": "Player100", "position": "GK", "height": 170, "weight": 60, "rating": 6},
    {"name": "Player100", "position": "GK", "height": 180, "weight": 60, "rating": 6},
    {"name": "Player100", "position": "GK", "height": 190, "weight": 60, "rating": 6},
    {"name": "Player100", "position": "GK", "height": 130, "weight": 60, "rating": 6},
]

def euclidean_distance_weighted(player1, player2, weights):
    features = ["height", "weight", "rating"]

    if player1["position"] == player2["position"]:
        dist = np.linalg.norm([(player1[feature] - player2[feature]) * weights[feature] for feature in features])
        return dist

    return np.inf  # Set a high value for distance if positions are different

def get_recommendations_weighted_knn(player_profiles, input_player, weights, num_recommendations=3, k_neighbors=4):
    valid_profiles = [
        player for player in player_profiles
        if player["position"] == input_player["position"] and player["name"] != input_player["name"]
    ]

    X = np.array([[player["height"], player["weight"], player["rating"]] for player in valid_profiles])
    input_features = np.array([input_player["height"], input_player["weight"], input_player["rating"]]).reshape(1, -1)

    knn = NearestNeighbors(n_neighbors=k_neighbors, metric='euclidean')
    knn.fit(X)

    distances, indices = knn.kneighbors(input_features)

    top_recommendations = [valid_profiles[i] for i in indices[0]][:num_recommendations]

    return top_recommendations

@app.route('/get_recommendations', methods=['POST'])
def get_recommendations_endpoint():
    try:
        input_data = request.json

        input_player = {
            "name": "InputPlayer",  # You can set a default name or get it from the input_data if available
            "position": input_data["position"],
            "height": input_data.get("height", 180),
            "weight": input_data.get("weight", 75),
            "rating": input_data.get("rating", 8),
        }
        print(input_player.get.height)

        attribute_weights = {"height": 1, "weight": 1, "rating": 1}

        recommendations = get_recommendations_weighted_knn(
            player_profiles, input_player, weights=attribute_weights, num_recommendations=3, k_neighbors=5
        )

        return jsonify({"recommendations": recommendations})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred"}), 500

if __name__ == '__main__':
    app.run(debug=True)
