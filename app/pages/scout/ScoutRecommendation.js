import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import axios from 'axios';

export const ScoutRecommendation = ({ navigation }) => {

    const [position, setPosition] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');

    // const [age, setAge] = useState('');
    // const [age, setAge] = useState('');
    // const [age, setAge] = useState('');
    // const [age, setAge] = useState('');
    // const [age, setAge] = useState('');
    // const [age, setAge] = useState('');
    // const [age, setAge] = useState('');

    // assist: 22,
    // clearances: 23,
    // crosses: 22,
    // goals:60,
    // passes:100,
    // rating: 10,
    // saves: 0,
    // shotsOnTarget: 99,
    // tackles: 100
    const [recommendations, setRecommendations] = useState([]);

    const handleGetRecommendations = async () => {
        try {
            const data = {
                "name": "Player3",
                "position": position, // Use dynamic user input
                "height": height,
                "weight": weight,
                "age": age,
                "rating": 10,

                "assist": 999,
                "clearances": 999,
                "crosses": 999,
                "goals": 999,
                "passes": 999,
                "saves": 999,
                "shotsOnTarget": 999,
                "tackles": 999
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
                    <Text style={{ fontSize: 18, marginTop: 20 }}>
                        Recommendations:
                    </Text>
                    {recommendations.map((player, index) => (
                        <><Text key={index}>
                            {player.fullName} - Position: {player.position}, Age: {player.age},
                            Height: {player.height}, Weight: {player.weight}, assist: {player.assist},
                            clearances: {player.clearances}, goals: {player.goals}, passes: {player.passes},
                            rating: {player.rating}, saves: {player.saves}, shotsOnTarget: {player.shotsOnTarget},
                            tackles: {player.tackles} , crosses: {player.crosses}
                        </Text>


                        </>

                    ))}
                </View>
            )}
        </View>
    );
};  