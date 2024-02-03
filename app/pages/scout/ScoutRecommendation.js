import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { Avatar } from "react-native-paper";
import {
    SelectList,
} from "react-native-dropdown-select-list";

export const ScoutRecommendation = ({ navigation }) => {

    const [position, setPosition] = useState('');

    const [recommendations, setRecommendations] = useState([]);

    
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [age, setAge] = useState(null);
  const [assist, setAssist] = useState(null);
  const [clearances, setClearances] = useState(null);
  const [crosses, setCrosses] = useState(null);
  const [goals, setGoals] = useState(null);
  const [passes, setPasses] = useState(null);
  const [rating, setRating] = useState(null);
  const [saves, setSaves] = useState(null);
  const [shotsOnTarget, setShotsOnTarget] = useState(null);
  const [tackles, setTackles] = useState(null);


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

          if (position === "LW") {
           
            setAssist(200)
            setClearances(3)
            setCrosses(10)
            setGoals(999)
            setPasses(999)
            setRating(999)
            setSaves(0)
            setShotsOnTarget(999)
            setTackles(300)
    
          } else if (position === "ST") {
            
            setAssist(200)
            setClearances(3)
            setCrosses(10)
            setGoals(999)
            setPasses(999)
            setRating(999)
            setSaves(0)
            setShotsOnTarget(999)
            setTackles(300)
    
          } else if (position === "RW") {
    
            
            setAssist(200)
            setClearances(3)
            setCrosses(10)
            setGoals(999)
            setPasses(999)
            setRating(999)
            setSaves(0)
            setShotsOnTarget(999)
            setTackles(300)
    
          } else if (position === "CM") {
    
            setAssist(999)
            setClearances(200)
            setCrosses(999)
            setGoals(200)
            setPasses(999)
            setRating(999)
            setSaves(0)
            setShotsOnTarget(200)
            setTackles(500)
          } else if (position === "LB") {    
            
            setAssist(200)
            setClearances(600)
            setCrosses(700)
            setGoals(10)
            setPasses(999)
            setRating(999)
            setSaves(0)
            setShotsOnTarget(0)
            setTackles(500)
          } else if (position === "CB") {
    
            
            setAssist(0)
            setClearances(999)
            setCrosses(0)
            setGoals(0)
            setPasses(999)
            setRating(999)
            setSaves(0)
            setShotsOnTarget(0)
            setTackles(999)
          }  else if (position === "RB") {
                
            
            setAssist(200)
            setClearances(600)
            setCrosses(700)
            setGoals(10)
            setPasses(999)
            setRating(999)
            setSaves(0)
            setShotsOnTarget(0)
            setTackles(500)
          } else if (position === "GK") {
            
            setAssist(0)
            setClearances(3)
            setCrosses(0)
            setGoals(0)
            setPasses(600)
            setRating(999)
            setSaves(999)
            setShotsOnTarget(0)
            setTackles(0)
          }
    
          if (!position) {
            console.log('Position is required');
            return;
          }

            const data = {
                fullName: 'Player3',
                position: position,
                height: height,
                weight: weight,
                age: age,
                assist: assist,
                clearances: clearances,
                crosses: crosses,
                goals: goals,
                passes: passes,
                rating: rating,
                saves: saves,
                shotsOnTarget: shotsOnTarget,
                tackles: tackles
             
            };
            console.log(data)
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
                        placeholder="Select Position"
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

                                <View style={{flexDirection: 'row',alignSelf:"center", borderBottomColor: "ddd",borderBottomWidth: StyleSheet.hairlineWidth,marginTop:30}} >



<View  style={styles.inputContainer}>

<Text className=" text-center  pb-2 font-bold" key={index}>Age</Text>
<Text   style={styles.input}>{player.age}</Text>
</View>

<View  style={styles.inputContainer}>
<Text className=" text-center  pb-2 font-bold" key={index}>Height</Text>
<Text  style={styles.input}>{player.height}</Text>
</View>

<View  style={styles.inputContainer}>
<Text className=" text-center  pb-2 font-bold" key={index}>Weight</Text>
<Text  style={styles.input}>{player.weight}</Text>
</View>

<View  style={styles.inputContainer}>
<Text className=" text-center  pb-2 font-bold" key={index}>Rating</Text>
<Text  style={styles.input}>{player.rating.toFixed(0)}</Text>
</View>
</View>




<View style={{flexDirection: 'row',alignSelf:"center", borderBottomColor: "ddd",borderBottomWidth: StyleSheet.hairlineWidth,marginTop:30}} >



<View  style={styles.inputContainer}>

<Text className=" text-center  pb-2 font-bold" key={index}>Goals</Text>
<Text   style={styles.input}>{player.goals}</Text>
</View>


<View  style={styles.inputContainer}>
<Text className=" text-center  pb-2 font-bold" key={index}>Assists</Text>
<Text  style={styles.input}>{player.assist}</Text>
</View>

<View  style={styles.inputContainer}>
<Text className=" text-center  pb-2 font-bold" key={index}>Shots On Target</Text>
<Text  style={styles.input}>{player.shotsOnTarget}</Text>
</View>

<View  style={styles.inputContainer}>
<Text className=" text-center  pb-2 font-bold" key={index}>Crosses</Text>
<Text  style={styles.input}>{player.crosses}</Text>
</View>

</View>

<View style={{flexDirection: 'row',alignSelf:"center", borderBottomColor: "ddd",borderBottomWidth: StyleSheet.hairlineWidth,marginTop:30}} >



<View  style={styles.inputContainer}>

<Text className=" text-center  pb-2 font-bold" key={index}>Saves</Text>
<Text   style={styles.input}>{player.saves}</Text>
</View>


<View  style={styles.inputContainer}>
<Text className=" text-center  pb-2 font-bold" key={index}>Clearances</Text>
<Text  style={styles.input}>{player.clearances}</Text>
</View>

<View  style={styles.inputContainer}>
<Text className=" text-center  pb-2 font-bold" key={index}>Tackles</Text>
<Text  style={styles.input}>{player.tackles}</Text>
</View>

<View  style={styles.inputContainer}>
<Text className=" text-center  pb-2 font-bold" key={index}>Passes</Text>
<Text  style={styles.input}>{player.passes}</Text>
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
         height:30,
         width:50,
     textAlign:"center",
     padding:5,
     borderRadius:15,
     marginBottom:30
     
    
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
      width: "100%",
      height: 40,
      fontSize: 20,
      paddingTop: 5,
      paddingLeft: 5,
  
    }, teamco2: {
      backgroundColor: "#FFD14E",
      width: "100%",
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
  