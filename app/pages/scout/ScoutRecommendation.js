import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { Avatar } from "react-native-paper";
import {
    SelectList,
} from "react-native-dropdown-select-list";

export const ScoutRecommendation = ({ navigation }) => {

    const [position, setPosition] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');
    const [recommendations, setRecommendations] = useState([]);

    const positionData = [
        { key: "GK", value: "GK" },
        { key: "CB", value: "CB" },
        { key: "RB", value: "RB" },
        { key: "LB", value: "LB" },
        { key: "CM", value: "CM" },
        { key: "RW", value: "RW" },
        { key: "LW", value: "LW" },
        { key: "ST", value: "ST" },
    ];




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
            const response = await axios.post('http://46.101.208.187/api/get_recommendations', data, {
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
        <View style={{ flex: 1, backgroundColor: "#00B365" }}>

<ScrollView >

<Image className="self-center top-5"
          source={require("../../assets/scoutreco.png")}
          style={{ width: 210, height: 200 }}
        />

            <View className="px-8 pt-8 bg-white top-9 " style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, borderBottomRightRadius: 50, borderBottomLeftRadius: 50 ,marginBottom:50}}>

                <View className="text-gray-700 mb-2  ">



                    <SelectList
                        setSelected={(val) => setPosition(val)}
                        data={positionData}
                        save="value"
                    />
                </View>

                <TextInput className="py-3  top-1 text-gray-700 rounded-2xl"
                    placeholder="Enter player height"
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }}
                    onChangeText={(text) => setHeight(text)}
                    value={height}
                />

                <TextInput className="p-3 top-1 text-gray-700 rounded-2xl"
                    placeholder="Enter player weight"
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }}
                    onChangeText={(text) => setWeight(text)}
                    value={weight}
                />

                <TextInput className="p-3 top-1 text-gray-700 rounded-2xl"
                    placeholder="Enter player age"
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }}
                    onChangeText={(text) => setAge(text)}
                    value={age}
                />


                <TouchableOpacity onPress={handleGetRecommendations}>
                    <Text className="self-center   rounded-3xl" style={styles.Button2} >Get Recommendations</Text>
                </TouchableOpacity>

            </View>

            {recommendations.length > 0 && (
                <View style={{ backgroundColor: "white", width: "100%", flex: 1, }}>
                    

                        {recommendations.map((player, index) => (
                            <>

                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate("ScoutRecommendationstack", {
                                            screen: "ScoutVisitProfile",
                                            params: { itemId: player.uid },
                                        })
                                    }
                                >
                                    <View className="mb-9" style={styles.teamco} >


                                        <Avatar.Image className="left-3 top-3" size={75} source={{ uri: player.profileImage }} />



                                    </View>

                                </TouchableOpacity>
                                <Text className="font-bold left-24 bottom-7 "  >{player.fullName}{"\n"}{player.position}</Text>

                                <View style={{ flexDirection: 'row', alignSelf: "center", borderBottomColor: "ddd", borderBottomWidth: StyleSheet.hairlineWidth, }} >


                                    <View style={styles.inputContainer}>
                                        <Text className=" text-center   pb-2 font-bold" key={index}> Age {"\n"}{"\n"}

                                            <View style={styles.bigBox}>
                                                <Text style={styles.text}>{player.age}</Text>
                                            </View>

                                        </Text>

                                    </View>



                                    <View style={styles.inputContainer}>
                                        <Text className=" text-center   pb-2 font-bold" key={index}> Height {"\n"}{"\n"}

                                            <View style={styles.bigBox}>
                                                <Text style={styles.text}>{player.height}</Text>
                                            </View>

                                        </Text>

                                    </View>


                                    <View style={styles.inputContainer}>
                                        <Text className=" text-center   pb-2 font-bold" key={index}> Weight {"\n"}{"\n"}

                                            <View style={styles.bigBox}>
                                                <Text style={styles.text}>{player.weight}</Text>
                                            </View>

                                        </Text>

                                    </View>



                                    <View style={styles.inputContainer}>
                                        <Text className=" text-center   pb-2 font-bold" key={index}> Rating {"\n"}{"\n"}

                                            <View style={styles.bigBox}>
                                                <Text style={styles.text}>{player.rating}</Text>
                                            </View>

                                        </Text>
                                        <View className="my-2"></View>
                                    </View>
                                    <View className="my-2"></View>
                                </View>

                                <View className="my-3"></View>
                                <View style={{ flexDirection: 'row', alignSelf: "center", borderBottomColor: "ddd", borderBottomWidth: StyleSheet.hairlineWidth, }} >


                                    <View style={styles.inputContainer}>
                                        <Text className=" text-center   pb-2 font-bold" key={index}> Goals {"\n"}{"\n"}

                                            <View style={styles.bigBox}>
                                                <Text style={styles.text}>{player.goals}</Text>
                                            </View>

                                        </Text>

                                    </View>



                                    <View style={styles.inputContainer}>
                                        <Text className=" text-center   pb-2 font-bold" key={index}> Assists {"\n"}{"\n"}

                                            <View style={styles.bigBox}>
                                                <Text style={styles.text}>{player.assist}</Text>
                                            </View>

                                        </Text>

                                    </View>


                                    <View style={styles.inputContainer}>
                                        <Text className=" text-center   pb-2 font-bold" key={index}>Shots On Target{"\n"}{"\n"}

                                            <View style={styles.bigBox}>
                                                <Text style={styles.text}>{player.shotsOnTarget}</Text>
                                            </View>

                                        </Text>

                                    </View>



                                    <View style={styles.inputContainer}>
                                        <Text className=" text-center   pb-2 font-bold" key={index}> Crosses {"\n"}{"\n"}

                                            <View style={styles.bigBox}>
                                                <Text style={styles.text}>{player.crosses}</Text>
                                            </View>

                                        </Text>

                                        <View className="my-2"></View>
                                    </View>
                                    <View className="my-2"></View>
                                </View>

                                <View className="my-3"></View>
                                <View style={{ flexDirection: 'row', alignSelf: "center", borderBottomColor: "ddd", borderBottomWidth: StyleSheet.hairlineWidth, }} >


                                    <View style={styles.inputContainer}>
                                        <Text className=" text-center   pb-2 font-bold" key={index}> Saves {"\n"}{"\n"}

                                            <View style={styles.bigBox}>
                                                <Text style={styles.text}>{player.saves}</Text>
                                            </View>

                                        </Text>

                                    </View>



                                    <View style={styles.inputContainer}>
                                        <Text className=" text-center   pb-2 font-bold" key={index}>Clearances {"\n"}{"\n"}

                                            <View style={styles.bigBox}>
                                                <Text style={styles.text}>{player.clearances}</Text>
                                            </View>

                                        </Text>

                                    </View>


                                    <View style={styles.inputContainer}>
                                        <Text className=" text-center   pb-2 font-bold" key={index}>Tackles {"\n"}{"\n"}

                                            <View style={styles.bigBox}>
                                                <Text style={styles.text}>{player.tackles}</Text>
                                            </View>

                                        </Text>

                                    </View>



                                    <View style={styles.inputContainer}>
                                        <Text className=" text-center   pb-2 font-bold" key={index}>Passes {"\n"}{"\n"}

                                            <View style={styles.bigBox}>
                                                <Text style={styles.text}>{player.passes}</Text>


                                            </View>

                                        </Text>

                                    </View>




                                </View>









                            </>

                        ))}
                </View>
            )}
</ScrollView>
        </View>
    );
}; const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",


    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 1,
        marginTop: 39,
        color: "white"
    },
    playerContainer: {
        marginBottom: 16,
    },
    inputContainer: {
        flexDirection: "column",
        alignItems: "center",

        paddingHorizontal: 13,


    },
    input: {

        borderWidth: 1,
        borderColor: 'grey',
        height: 32,
        padding: 30,
        backgroundColor: "grey",
        paddingHorizontal: 30
    }, goalscon: {
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 8,
        padding: 20,
        left: 42

    }, hi: {
        borderBottomColor: "ddd",
        borderBottomWidth: StyleSheet.hairlineWidth,

        marginBottom: 15,
    }, bgcolor: {

        backgroundColor: "#00B365"
    }, teamco: {
        backgroundColor: "#00B365",
        width: "100%",
        height: 40,
        fontSize: 28,

    }, teampl: {
        backgroundColor: "#00B365",
        width: 400,
        height: 40,
        fontSize: 20,
        paddingTop: 5,
        paddingLeft: 5,

    }, teamco2: {
        backgroundColor: "#FFD14E",
        width: 400,
        height: 40,
        fontSize: 28,
    }, button1: {
        backgroundColor: "#00b365",

    }, bigBox: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        width: 50, // Adjust the width as needed
        height: 50, // Adjust the height as needed
        justifyContent: 'center', // Center the text vertically
        alignItems: 'center', // Center the text horizontally
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    }, Button2: {
        fontSize: 18,
        color: "white",
        right: 4,
        fontWeight: "bold",
        padding: 15,
        backgroundColor: "#00B365",
        width: 260,
        margin: 15,
        textAlign: 'center'


    }
});
