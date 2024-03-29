import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity, StyleSheet, ScrollView,Image,
  Alert

} from "react-native";
import {
  doc,
  addDoc,
  collection,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { Avatar } from "react-native-paper";
import { db, auth } from "../../component/config/config";

import axios from 'axios';

export const PlayerRecommendationPage = ({ route, navigation }) => {
  const { index } = route.params;

  const [position, setPosition] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [clubName, setclubName] = useState("");
  
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
  
  useEffect(() => {
    // This effect will be called whenever `position` changes.
    handleGetRecommendations();
  }, [position]); // Only re-run the effect if `position` changes.

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coachDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (coachDoc.exists()) {
          const clubName = coachDoc.data().clubName;
          setclubName(clubName);
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  const handleGetRecommendations = async () => {
    try {
      console.log('the index', index);
      if (index === 0) {
        setPosition('LW');

        setHeight(180)
        setWeight(80)
        setAge(23)
        setAssist(200)
        setClearances(3)
        setCrosses(10)
        setGoals(999)
        setPasses(999)
        setRating(999)
        setSaves(0)
        setShotsOnTarget(999)
        setTackles(300)

      } else if (index === 1) {
        setPosition('ST');

        setHeight(180)
        setWeight(80)
        setAge(25)
        setAssist(200)
        setClearances(3)
        setCrosses(10)
        setGoals(999)
        setPasses(999)
        setRating(999)
        setSaves(0)
        setShotsOnTarget(999)
        setTackles(300)

      } else if (index === 2) {
        setPosition('RW');

        setHeight(180)
        setWeight(80)
        setAge(25)
        setAssist(200)
        setClearances(3)
        setCrosses(10)
        setGoals(999)
        setPasses(999)
        setRating(999)
        setSaves(0)
        setShotsOnTarget(999)
        setTackles(300)

      } else if (index === 3) {
        setPosition('CM');

        setHeight(170)
        setWeight(70)
        setAge(25)
        setAssist(999)
        setClearances(200)
        setCrosses(999)
        setGoals(200)
        setPasses(999)
        setRating(999)
        setSaves(0)
        setShotsOnTarget(200)
        setTackles(500)
      } else if (index === 4) {
        setPosition('CM');

        setHeight(170)
        setWeight(70)
        setAge(25)
        setAssist(999)
        setClearances(200)
        setCrosses(999)
        setGoals(200)
        setPasses(999)
        setRating(999)
        setSaves(0)
        setShotsOnTarget(200)
        setTackles(500)
      } else if (index === 5) {
        setPosition('CM');

        setHeight(170)
        setWeight(70)
        setAge(25)
        setAssist(999)
        setClearances(200)
        setCrosses(999)
        setGoals(200)
        setPasses(999)
        setRating(999)
        setSaves(0)
        setShotsOnTarget(200)
        setTackles(500)
      } else if (index === 6) {
        setPosition('LB');

        setHeight(165)
        setWeight(65)
        setAge(24)
        setAssist(200)
        setClearances(600)
        setCrosses(700)
        setGoals(10)
        setPasses(999)
        setRating(999)
        setSaves(0)
        setShotsOnTarget(0)
        setTackles(500)
      } else if (index === 7) {
        setPosition('CB');

        setHeight(180)
        setWeight(80)
        setAge(24)
        setAssist(0)
        setClearances(999)
        setCrosses(0)
        setGoals(0)
        setPasses(999)
        setRating(999)
        setSaves(0)
        setShotsOnTarget(0)
        setTackles(999)
      } else if (index === 8) {
        setPosition('CB');

        setHeight(180)
        setWeight(80)
        setAge(24)
        setAssist(0)
        setClearances(999)
        setCrosses(0)
        setGoals(0)
        setPasses(999)
        setRating(999)
        setSaves(0)
        setShotsOnTarget(0)
        setTackles(999)
      } else if (index === 9) {
        setPosition('RB');

        setHeight(165)
        setWeight(65)
        setAge(24)
        setAssist(200)
        setClearances(600)
        setCrosses(700)
        setGoals(10)
        setPasses(999)
        setRating(999)
        setSaves(0)
        setShotsOnTarget(0)
        setTackles(500)
      } else if (index === 10) {
        setPosition('GK');

        setHeight(180)
        setWeight(80)
        setAge(24)
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
      
      const response = await axios.post(
        'http://46.101.208.187/api/get_recommendations',
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

  const addPlayer = async (playerUid) => {
    // Delete the statment
    console.log("the player info is ", playerUid, "andddd", index)

    const playerRef = doc(db, "users", playerUid);
    const playerDoc = await getDoc(playerRef);

    if (!playerDoc.exists()) {
      console.log("Player document does not exist!");
      return;
    }

    const clubName = playerDoc.data().clubName;

    // Here is the Error 
    if (!clubName) {
      console.log("Club name is required");
      return
    }

    const clubRef = doc(db, "clubs", clubName);
    const clubDoc = await getDoc(clubRef);

    let currentFormation = clubDoc.data()?.formation || [];

    if (currentFormation.length >= index + 1) {
      // Update existing array at the specified index

      currentFormation[index] = {
        fullName: playerDoc.data()?.fullName || "",
        age: playerDoc.data()?.age || 0,
        height: playerDoc.data()?.height || 0,
        weight: playerDoc.data()?.weight || 0,
        level: playerDoc.data()?.level || "",
        profileImage: playerDoc.data()?.imageURL || "",
        position: playerDoc.data()?.position || "",
        uid: playerDoc.data()?.uid || "",

        assist: playerDoc.data()?.assist || 0,
        clearances: playerDoc.data()?.clearances || 0,
        crosses: playerDoc.data()?.crosses || 0,
        goals: playerDoc.data()?.goals || 0,
        passes: playerDoc.data()?.passes || 0,
        rating: playerDoc.data()?.rating || 0,
        saves: playerDoc.data()?.saves || 0,
        shotsOnTarget: playerDoc.data()?.shotsOnTarget || 0,
        tackles: playerDoc.data()?.tackles || 0,

      };
    } else {
      // If the array is smaller than the specified index, pad with empty values
      while (currentFormation.length < index) {
        currentFormation.push(null);
        console.log("stuck in the loop");
      }

      // Add the player at the specified index
      currentFormation[index] = {
        fullName: playerDoc.data()?.fullName || "",
        age: playerDoc.data()?.age || 0,
        height: playerDoc.data()?.height || 0,
        weight: playerDoc.data()?.weight || 0,
        level: playerDoc.data()?.level || "",
        profileImage: playerDoc.data()?.imageURL || "",
        position: playerDoc.data()?.position || "",
        uid: playerDoc.data()?.uid || "",

        assist: playerDoc.data()?.assist || 0,
        clearances: playerDoc.data()?.clearances || 0,
        crosses: playerDoc.data()?.crosses || 0,
        goals: playerDoc.data()?.goals || 0,
        passes: playerDoc.data()?.passes || 0,
        rating: playerDoc.data()?.rating || 0,
        saves: playerDoc.data()?.saves || 0,
        shotsOnTarget: playerDoc.data()?.shotsOnTarget || 0,
        tackles: playerDoc.data()?.tackles || 0,
      };
    }

    await updateDoc(clubRef, {
      formation: currentFormation,
      clubName,
      description: clubDoc.data()?.description || "",
      city: clubDoc.data()?.city || "",
    });
    Alert.alert("Successfully","Player added to the formation")
    console.log("Member added to the formation array!!");

  }

  const invitePlayer = async (playerUid) => {
    try {
      if (playerUid == null) {
        console.log("Player uid == null")
      }
      const coachDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const fullName = coachDoc.data().fullName;
      const imageURL = coachDoc.data().profileImage;
      // Create an invitation in Firestore
      const invitationRef = collection(db, "invitations",);
      const newInvitationDoc = await addDoc(invitationRef, {
        senderUid: auth.currentUser.uid,
        senderName: fullName,
        senderImage: imageURL,
        receiverUid: playerUid,
        status: "Pending",

        // Add any additional details you want to include in the invitation
      });

      // Notify the player about the invitation
      // You can use FCM or another notification method here

      // Optional: Update UI or provide feedback to the coach
     Alert.alert("Successfully","The Invitation Request has been sent successfully.")
      
    } catch (error) {
      console.error("Error sending invitation:", error);
    }
  }

  return (
    <View style={{ backgroundColor: "white", width: "100%" ,flex:1,}}>
       


      {recommendations.length > 0 && (
        <View  >
          <ScrollView >
           
            {recommendations.map((player, index) => (
              <>

<View  style={{width:"100%"}}>


                            
<View className="mb-9" style={styles.teamco} >
 


<TouchableOpacity
      onPress={() =>
        navigation.navigate("CoachFormationstack", {
          screen: "CoachVisitProfile",
          params: { itemId: player.uid },
        })
      }
    >
      <View className="mb-9" style={styles.teamco} >


        <Avatar.Image className="left-3 top-3" size={75} source={{ uri: player.profileImage }} />



      </View>

    </TouchableOpacity>

<Text className="font-bold  bottom-7"  style={{left:100}}>{player.fullName}{"\n"}{player.position}</Text> 

</View>

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

                {player.clubName === clubName ? (
                 <TouchableOpacity onPress={() => addPlayer(player.uid)}>
                 <Text className="self-center rounded-2xl" style={styles.Button2} >Add player</Text>
               </TouchableOpacity>
                ) : (
                  
                  <TouchableOpacity onPress={() => invitePlayer(player.uid)}>
                  <Text className="self-center rounded-2xl " style={styles.Button2} >Invite player</Text>
                </TouchableOpacity>
                )}



</View>
               

              </>
                  
            ))}</ScrollView>
        </View>
      )}
     
        
         

     
          
     
    </View>
  );
};
const styles = StyleSheet.create({
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
    fontSize: 20,
    color: "white",
    right: 4,
    fontWeight: "bold",
    padding: 15,
    backgroundColor: "#00B365",
    width: 180,
    margin: 15,
    textAlign: 'center',
  
  }
});
