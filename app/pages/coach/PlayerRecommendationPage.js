import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import axios from 'axios';

export const PlayerRecommendationPage = ({ route, navigation }) => {
  const { index } = route.params;

  const [position, setPosition] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // This effect will be called whenever `position` changes.
    handleGetRecommendations();
  }, [position]); // Only re-run the effect if `position` changes.

  const handleGetRecommendations = async () => {
    try {
      console.log('the index', index);
      if (index === 1) {
        setPosition('ST');
      }

      console.log('the position', position);
      if (!position) {
        console.error('Position is required');
        return;
      }

      const data = {
        fullName: 'Player3',
        position: position,
        height: 185,
        weight: 80,
        age: 9,
      };

      console.log(position);
      const response = await axios.post(
        'http://10.0.2.2:5000/get_recommendations',
        data,
        {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const responseData = response.data;
      setRecommendations(responseData.recommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        Player Recommendation System
      </Text>
      <Button title="Get Recommendations" onPress={handleGetRecommendations} />

      {recommendations.length > 0 && (
        <View>
          <Text style={{ fontSize: 18, marginTop: 20 }}>
            Recommendations:
          </Text>
          {recommendations.map((player, index) => (
            <Text key={index}>
              {player.fullName} - Position: {player.position}, Age: {player.age},
              Height: {player.height}, Weight: {player.weight}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};
