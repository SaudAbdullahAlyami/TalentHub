import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,TouchableOpacity,Image,ScrollView
} from "react-native";
import { db, auth, firebase } from "../../component/config/config";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

export const TournamentOrgRating = ({ route, navigation }) => {
  const { team1, team2, matchIndex,whoWin,round } = route.params;
  var WhoWin=""
  const [team1Goals, setTeam1Goals] = useState("0");
  const [team2Goals, setTeam2Goals] = useState("0");
  const [player1Ratings, setPlayer1Ratings] = useState(team1.players);
  const [player2Ratings, setPlayer2Ratings] = useState(team2.players);
  const [goal1, setGoal1] = useState("0");
  const [rating1, setRating1] = useState("0");
  const [goal2, setGoal2] = useState("0");
  const [rating2, setRating2] = useState("0");

  const [assist, setAssist] = useState("0");
const [clearances, setClearances] = useState("0");
const [crosses, setCrosses] = useState("0");
const [passes, setPasses] = useState("0");
const [saves, setSaves] = useState("0");
const [shotsOnTarget, setShotsOnTarget] = useState("0");
const [tackles, setTackles] = useState("0");

  const handleSave = async () => {
    try {
      if (parseFloat(team1Goals) > parseFloat(team2Goals)) {
        WhoWin = team1.name;
      } else if (parseFloat(team1Goals) < parseFloat(team2Goals)) {
        WhoWin = team2.name;
      }

      const tournamentOrganizerRef = doc(db, "users", auth.currentUser.uid);

      const unsubscribeOrganizer = onSnapshot(
        tournamentOrganizerRef,
        async (orgDoc) => {
          if (orgDoc.exists()) {
            const tournamentName = orgDoc.data().tournament;

            const tournamentRef = doc(db, "tournament", tournamentName);

            // Fetch the current state of the tournament
            const tournamentDoc = await getDoc(tournamentRef);
            const tournamentData = tournamentDoc.data();

            // Assuming matchIndex is the index of the match you want to update
            if(round==1){
            const updatedMatchs = [...tournamentData.matchs];

            // Update the WhoWin property for the specified matchIndex
            updatedMatchs[matchIndex].whoWin = WhoWin;
            updatedMatchs[matchIndex].team1Goals = team1Goals;
            updatedMatchs[matchIndex].team2Goals = team2Goals;

            // Update the tournament document with the modified matchs array
            await updateDoc(tournamentRef, { matchs: updatedMatchs });
          }else if (round==2){
            const updatedMatchs = [...tournamentData.matchsRound2];

            // Update the WhoWin property for the specified matchIndex
            updatedMatchs[matchIndex].whoWin = WhoWin;
            updatedMatchs[matchIndex].team1Goals = team1Goals;
            updatedMatchs[matchIndex].team2Goals = team2Goals;
            // Update the tournament document with the modified matchs array
            await updateDoc(tournamentRef, { matchsRound2: updatedMatchs });
          }

        else if (round==3){
          const updatedMatchs = [...tournamentData.matchsRound3];

          // Update the WhoWin property for the specified matchIndex
          updatedMatchs[matchIndex].whoWin = WhoWin;
          updatedMatchs[matchIndex].team1Goals = team1Goals;
          updatedMatchs[matchIndex].team2Goals = team2Goals;
          // Update the tournament document with the modified matchs array
          await updateDoc(tournamentRef, { matchsRound3: updatedMatchs });
        }
        else if (round==4){
          const updatedMatchs = [...tournamentData.matchsRound4];

          // Update the WhoWin property for the specified matchIndex
          updatedMatchs[matchIndex].whoWin = WhoWin;
          updatedMatchs[matchIndex].team1Goals = team1Goals;
          updatedMatchs[matchIndex].team2Goals = team2Goals;
          // Update the tournament document with the modified matchs array
          await updateDoc(tournamentRef, { matchsRound4: updatedMatchs });
        }
          }
        }
      );
    } catch (error) {
      console.error(error);
    }

    console.log("The Winner is:", WhoWin);

    // Navigate back to the previous screen
    navigation.goBack();
  };


/* index means 
goals=0
rating=1
assist=2
clearnes=3
crosses=4
passes=5
saves=6
shot on target=7
tackels=8

*/
  const savePlayerData = async (playerUid, data,index) => {
    try {
      const userRef = doc(db, "users", playerUid);
      const playerDoc = await getDoc(userRef);
      if(index==0){
       
        if (playerDoc.exists()) {
          const playerGoal = parseFloat(playerDoc.data().goals); // Convert to number
    
          if (playerGoal === 0 ||playerGoal==="0") {
            await updateDoc(userRef, {
              goals: parseFloat(data),
            });
            console.log("New player goal added");
          } else {
            const newGoal = playerGoal + parseFloat(data);
    
            await updateDoc(userRef, {
              goals: newGoal,
            });
            console.log("Player goal updated");
          }
        } else {
          console.log("Player document does not exist");
        }
      }else if (index==1){
        const prevPlayerRate = parseFloat(playerDoc.data().rating);
        const playerRate = parseFloat(data);
        if (prevPlayerRate == 0 || prevPlayerRate=="0") {
          await updateDoc(doc(db, "users", playerUid), {
            rating: playerRate,
          });
          console.log("new Player was rated");
        } else {
          const averageRate = (playerRate + prevPlayerRate) / 2;
  
          await updateDoc(doc(db, "users", playerUid), {
            rating: averageRate,
          });
          console.log("Player was rated");
        }
      }else if(index==2){
        if (playerDoc.exists()) {
          const playerAssist = parseFloat(playerDoc.data().assist); // Convert to number
    
          if (playerAssist === 0 ||playerAssist==="0") {
            await updateDoc(userRef, {
              assist: parseFloat(assist),
            });
            console.log("New player assist added");
          } else {
            const newAssist = playerAssist + parseFloat(assist);
    
            await updateDoc(userRef, {
              assist: newAssist,
            });
            console.log("Player assist updated");
          }
        }
      }else if(index==3){
        if (playerDoc.exists()) {
          const playerClearances = parseFloat(playerDoc.data().clearances); // Convert to number
    
          if (playerClearances === 0 ||playerClearances==="0") {
            await updateDoc(userRef, {
              clearances: parseFloat(data),
            });
            console.log("New player Clearances added");
          } else {
            const newClearances = playerClearances + parseFloat(data);
    
            await updateDoc(userRef, {
              clearances: newClearances,
            });
            console.log("Player Clearances updated");
          }
        }
      }else if(index==4){
        if (playerDoc.exists()) {
          const playerCrosses = parseFloat(playerDoc.data().crosses); // Convert to number
    
          if (playerCrosses === 0 ||playerCrosses==="0") {
            await updateDoc(userRef, {
              crosses: parseFloat(data),
            });
            console.log("New player crosses added");
          } else {
            const newCrosses = playerCrosses + parseFloat(data);
    
            await updateDoc(userRef, {
              crosses: newCrosses,
            });
            console.log("Player crosses updated");
          }
        }
      }else if(index==5){
        const playerPasses= parseFloat(playerDoc.data().passes); // Convert to number
    
          if (playerPasses === 0 ||playerPasses==="0") {
            await updateDoc(userRef, {
              passes: parseFloat(data),
            });
            console.log("New player passes added");
          } else {
            const newPasses = playerPasses + parseFloat(data);
    
            await updateDoc(userRef, {
              passes: newPasses,
            });
            console.log("Player passes updated");
          }
      }else if(index==6){
        const playerSaves = parseFloat(playerDoc.data().saves); // Convert to number
    
          if (playerSaves === 0 ||playerSaves==="0") {
            await updateDoc(userRef, {
              saves: parseFloat(data),
            });
            console.log("New player saves added");
          } else {
            const newSaves = playerSaves + parseFloat(data);
    
            await updateDoc(userRef, {
              saves: newSaves,
            });
            console.log("Player saves updated");
          }
      }else if(index==7){
        const playerShotsOnTarget = parseFloat(playerDoc.data().shotsOnTarget); // Convert to number
    
          if (playerShotsOnTarget === 0 ||playerShotsOnTarget==="0") {
            await updateDoc(userRef, {
              shotsOnTarget: parseFloat(data),
            });
            console.log("New player shotsOnTarget added");
          } else {
            const newShotsOnTarget = playerShotsOnTarget + parseFloat(data);
    
            await updateDoc(userRef, {
              shotsOnTarget: newShotsOnTarget,
            });
            console.log("Player shotsOnTarget updated");
          }
      }else if(index==8){
        const playerTackles = parseFloat(playerDoc.data().tackles); // Convert to number
    
        if (playerTackles === 0 ||playerTackles==="0") {
          await updateDoc(userRef, {
            tackles: parseFloat(data),
          });
          console.log("New player tackles added");
        } else {
          const newTackles = playerTackles + parseFloat(data);
  
          await updateDoc(userRef, {
            tackles: newTackles,
          });
          console.log("Player tackles updated");
        }
      }
     else {
        console.log("Player document does not exist");
      }
    } catch (error) {
      console.error(error);
    }
  };


  
  

 
  const renderPlayer1Item = ({ item }) => {
    if(item !=null){
    return (

       
      <View  style={{width:400}}>


                                  
                  <View className="mb-9" style={styles.teamco2} >
                   
            

              <Image  className="top-4 left-3" source={require("../../assets/profo2.png")}
                style={{width: 60, height: 60}} />

                <Text className="font-bold left-20 bottom-5"  >{item.fullName} {item.position}</Text> 

              </View>

             <View style={{flexDirection: 'row',alignSelf:"center", borderBottomColor: "ddd",borderBottomWidth: StyleSheet.hairlineWidth,}} >

         

          <View  style={styles.inputContainer}>
               
            <Text className=" text-center  pb-2 font-bold" >Goals</Text>
            <TextInput  className="bg-gray-100 text-center  text-gray-700 rounded-2xl"
              style={styles.input}
              keyboardType="numeric"
              value={goal1}
              onChangeText={(text) => {
                setGoal1(text);
              }}
            />
            
              
            
          </View>
          


            
          <View style={styles.inputContainer}>
            <Text  className="text-center   pb-2 font-bold" >Rating</Text>
            <TextInput  className="bg-gray-100 text-center  text-gray-700 rounded-2xl"
              style={styles.input}
              keyboardType="numeric"
              value={rating1}
              onChangeText={(text) => {
                setRating1(text);
              }}
            />

            
      
            </View>
          
          



          

          <View style={styles.inputContainer}>
            <Text  className=" text-center color-00B365  pb-2 font-bold" >  Assists</Text>
            <TextInput  className="bg-gray-100 text-center  text-gray-700 rounded-2xl"
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => {
                setAssist(text);
              }}
            />

            
               </View>

               </View>
         
               <View style={{flexDirection: 'row',alignSelf:"center", borderBottomColor: "ddd",borderBottomWidth: StyleSheet.hairlineWidth,}} >
          <View style={styles.inputContainer}>
            <Text  className=" text-center   pb-2 font-bold" > Clearances</Text>
            <TextInput  className="bg-gray-100 text-center  text-gray-700 rounded-2xl"
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => {
                setClearances(text);
              }}
            />

             
          
          </View>


         


         
          <View style={styles.inputContainer}>
            <Text   className=" text-center  right-1 pb-2 font-bold"> Crosses</Text>
            <TextInput   className="bg-gray-100 text-center  text-gray-700 rounded-2xl"
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => {
                setCrosses(text);
              }}
            />

            

                </View>
  
          <View style={styles.inputContainer}>
            <Text   className=" text-center   pb-2 font-bold"> Passes</Text>
            <TextInput   className="bg-gray-100 text-center  text-gray-700 rounded-2xl"
              style={styles.input}
              
              keyboardType="numeric"
              onChangeText={(text) => {
                setPasses(text);
              }}
            />


            

          
          </View>
          </View>



          <View style={{flexDirection: 'row',alignSelf:"center", borderBottomColor: "ddd",borderBottomWidth: StyleSheet.hairlineWidth,}} >

          <View style={styles.inputContainer}>
            <Text  className=" text-center left-1  pb-2 font-bold"> Saves</Text>
            <TextInput   className="bg-gray-100 text-center  text-gray-700 rounded-2xl left-2"
              style={styles.input}
              keyboardType="numeric"
              
              onChangeText={(text) => {
                setSaves(text);
              }}
            />
            
                 </View>
  
          <View style={styles.inputContainer}>
            <Text  className=" text-center   pb-2 font-bold">  ShotsOnTarget</Text>
            <TextInput   className="bg-gray-100 text-center  text-gray-700 rounded-2xl"
              style={styles.input}
              keyboardType="numeric"
              
              onChangeText={(text) => {
                setShotsOnTarget(text);
              }}
            />
          
          </View>
          
          <View style={styles.inputContainer}>
            <Text  className=" text-center   pb-2 font-bold right-2"> Tackles</Text>
            <TextInput   className="bg-gray-100 text-center  text-gray-700 rounded-2xl right-1"
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => {
                setTackles(text);
              }}
            />
           
          </View>
          </View>


        


           



        {/* <Button
            title="Save Player data"
            onPress={() => {
              savePlayerData(item.uid, goal1,0)
              savePlayerData(item.uid, rating1,1)
              savePlayerData(item.uid, assist,2)
              savePlayerData(item.uid, clearances,3)
              savePlayerData(item.uid, crosses,4)
              savePlayerData(item.uid, passes,5)
              savePlayerData(item.uid, saves,6)
              savePlayerData(item.uid, shotsOnTarget,7)
              savePlayerData(item.uid, tackles,8)
            }}
          /> */}


      </View>
    )
          }
          
  };


  const renderPlayer2Item = ({ item }) => {
    if(item !=null){
      return (


        
        <View  style={{width:400}}>


                                  
                  <View className="mb-9" style={styles.teamco} >
                   
            

              <Image  className="top-4 left-3" source={require("../../assets/prof.png")}
                style={{width: 60, height: 60}} />

                <Text className="font-bold left-20 bottom-5"  >{item.fullName} {item.position}</Text> 

              </View>

             <View style={{flexDirection: 'row',alignSelf:"center", borderBottomColor: "ddd",borderBottomWidth: StyleSheet.hairlineWidth,}} >

         

          <View  style={styles.inputContainer}>
               
            <Text className=" text-center  pb-2 font-bold" >Goals</Text>
            <TextInput  className="bg-gray-100 text-center  text-gray-700 rounded-2xl"
              style={styles.input}
              keyboardType="numeric"
              value={goal1}
              onChangeText={(text) => {
                setGoal1(text);
              }}
            />
            
              
            
          </View>
          


            
          <View style={styles.inputContainer}>
            <Text  className="text-center   pb-2 font-bold" >Rating</Text>
            <TextInput  className="bg-gray-100 text-center  text-gray-700 rounded-2xl"
              style={styles.input}
              keyboardType="numeric"
              value={rating1}
              onChangeText={(text) => {
                setRating1(text);
              }}
            />

            
      
            </View>
          
          



          

          <View style={styles.inputContainer}>
            <Text  className=" text-center color-00B365  pb-2 font-bold" >  Assists</Text>
            <TextInput  className="bg-gray-100 text-center  text-gray-700 rounded-2xl"
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => {
                setAssist(text);
              }}
            />

            
               </View>

               </View>
         
               <View style={{flexDirection: 'row',alignSelf:"center", borderBottomColor: "ddd",borderBottomWidth: StyleSheet.hairlineWidth,}} >
          <View style={styles.inputContainer}>
            <Text  className=" text-center   pb-2 font-bold" > Clearances</Text>
            <TextInput  className="bg-gray-100 text-center  text-gray-700 rounded-2xl"
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => {
                setClearances(text);
              }}
            />

             
          
          </View>


         


         
          <View style={styles.inputContainer}>
            <Text   className=" text-center  right-1 pb-2 font-bold"> Crosses</Text>
            <TextInput   className="bg-gray-100 text-center  text-gray-700 rounded-2xl"
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => {
                setCrosses(text);
              }}
            />

            

                </View>
  
          <View style={styles.inputContainer}>
            <Text   className=" text-center   pb-2 font-bold"> Passes</Text>
            <TextInput   className="bg-gray-100 text-center  text-gray-700 rounded-2xl"
              style={styles.input}
              
              keyboardType="numeric"
              onChangeText={(text) => {
                setPasses(text);
              }}
            />


            

          
          </View>
          </View>



          <View style={{flexDirection: 'row',alignSelf:"center", borderBottomColor: "ddd",borderBottomWidth: StyleSheet.hairlineWidth,}} >

          <View style={styles.inputContainer}>
            <Text  className=" text-center left-1  pb-2 font-bold"> Saves</Text>
            <TextInput   className="bg-gray-100 text-center  text-gray-700 rounded-2xl left-2"
              style={styles.input}
              keyboardType="numeric"
              
              onChangeText={(text) => {
                setSaves(text);
              }}
            />
            
                 </View>
  
          <View style={styles.inputContainer}>
            <Text  className=" text-center   pb-2 font-bold">  ShotsOnTarget</Text>
            <TextInput   className="bg-gray-100 text-center  text-gray-700 rounded-2xl"
              style={styles.input}
              keyboardType="numeric"
              
              onChangeText={(text) => {
                setShotsOnTarget(text);
              }}
            />
          
          </View>
          
          <View style={styles.inputContainer}>
            <Text  className=" text-center   pb-2 font-bold right-2"> Tackles</Text>
            <TextInput   className="bg-gray-100 text-center  text-gray-700 rounded-2xl right-1"
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) => {
                setTackles(text);
              }}
            />
           
          </View>
          </View>


        </View>
      )
            }
            
    };





    

  return (
    <View style={styles.container}>


      <View  style={{backgroundColor:"#00B365",width:400}} >

      <View className="flex-row justify-start">
        <TouchableOpacity onPress={()=> navigation.goBack()} 
        className="bg-yellow-400 top-9 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
          <ArrowLeftIcon size="20" color="black" />
        </TouchableOpacity>
       </View>

      <Text className="self-center" style={styles.title}>Match Statistics</Text>
     


         <View style={{flexDirection: 'row',backgroundColor:"#00B365"}} >


      <View style={styles.goalscon}>
        <Text className="color-white font-bold mb-3" >Goals for {team1.name}:</Text>
        
        <TextInput  className="bg-gray-100 text-center  text-gray-700 rounded-2xl"
          style={styles.input}
          keyboardType="numeric"
          value={team1Goals}
          placeholder="Team goals"
          onChangeText={(text) => setTeam1Goals(text)}
        />
      </View>



      <View style={styles.goalscon}>
        <Text className="color-white font-bold mb-3 left-7">Goals for {team2.name}:</Text>
        <TextInput  className="bg-gray-100 text-center  text-gray-700 rounded-2xl left-7"
          style={styles.input}
          placeholder="Team goals"
          keyboardType="numeric"
          value={team2Goals}
          onChangeText={(text) => setTeam2Goals(text)}
        />
        </View>

      </View>

      </View>
      <ScrollView>

      <Text  className="text-white text-center font-bold" style={styles.teamco2} >{team1.name}</Text>

      <View>
      <FlatList
        data={player1Ratings}
        renderItem={({ item }) => renderPlayer1Item({ item })}
      />
      </View>
      <Text className="text-white text-center font-bold" style={styles.teamco} >{team2.name}</Text>
      <View>
      <FlatList
      
        data={player2Ratings}
        renderItem={({ item }) => renderPlayer2Item({ item })}
      /></View>
      </ScrollView>
     
      <TouchableOpacity
          style={styles.button1}
          onPress={handleSave}
          className="py-3 	 right-2  w-20 rounded-xl"
        >
          <Text className=" text-center text-white font-bold">Save</Text>
        </TouchableOpacity>

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
    marginTop:39,
    color:"white"
  },
  playerContainer: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 8,
    padding:20,
    
   
  },
  input: {
    
    borderWidth: 1,
    borderColor:'grey',
    height:32,
    width: 80,
  },goalscon: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 8,
    padding:20,
    left:42
    
  },  hi: {
    borderBottomColor: "ddd",
    borderBottomWidth: StyleSheet.hairlineWidth,
   
    marginBottom:15,
  },bgcolor:{

    backgroundColor:"#00B365"
  },teamco:{
    backgroundColor:"#00B365",
    width:400,
   height:40,
   fontSize:28,

  },teampl:{
    backgroundColor:"#00B365",
    width:400,
   height:40,
   fontSize:20,
   paddingTop:5,
   paddingLeft:5,
   
  },teamco2:{
    backgroundColor:"#FFD14E",
    width:400,
   height:40,
   fontSize:28,
  }, button1: {
    backgroundColor: "#00b365",
   
  },
});
