import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';

export const ScoutRecommendation = ({ navigation }) => {

    const [position, setPosition] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');


    const [recommendations, setRecommendations] = useState([]);

    const handleGetRecommendations = async () => {
        try {
            const data = {
                "name": "Player3",
                "position": position, // Use dynamic user input
                "height": height,
                "weight": weight,
                "age": age

            };
            console.log(position);
            const response = await axios.post('http://10.0.2.2:5000/get_recommendations', data, {
                timeout: 5000,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const responseData = response.data;
            setRecommendations(responseData.recommendations);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>Player Recommendation System</Text>
            <TextInput
                placeholder="Enter player position"
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }}
                onChangeText={(text) => setPosition(text)}
                value={position}
            />

            <TextInput
                placeholder="Enter player height"
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }}
                onChangeText={(text) => setHeight(text)}
                value={height}
            />

            <TextInput
                placeholder="Enter player weight"
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }}
                onChangeText={(text) => setWeight(text)}
                value={weight}
            />

            <TextInput
                placeholder="Enter player age"
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }}
                onChangeText={(text) => setAge(text)}
                value={age}
            />
            <Button title="Get Recommendations" onPress={handleGetRecommendations} />

            {recommendations.length > 0 && (
                <View>
                    <Text style={{ fontSize: 18, marginTop: 20 }}>Recommendations:</Text>
                    {recommendations.map((player, index) => (
                        <Text key={index}> Name {player.fullName} - Position: {player.position} - Height: {player.height} - Weight: {player.weight} - Age: {player.age}</Text>
                    ))}
                </View>
            )}
        </View>
    );
};  