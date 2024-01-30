import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
  StatusBar,
  FlatList,
  RefreshControl, ImageBackground, ScrollView, Modal
} from "react-native";
import { Avatar } from "react-native-paper";
import {
  doc,
  getDocs,
  collection,
  query,
  updateDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
  where,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { db, auth, firebaase } from "../../component/config/config";
export const CoachFormation = ({ navigation }) => {
  const [members, setMembers] = useState([]);

  const [clubName, setclubName] = useState("");
  const [formation, setFormation] = useState([]);
  const [formationNames, setFormationNames] = useState([]);
  useEffect(() => {
    fetchData();
    // Clean up the subscription when the component unmounts
    return () => {
      /* Cleanup logic if needed */
    };
  }, [fetchData]);

  const fetchData = async () => {
    retrievePlayerInfoAtIndex();
    try {

      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userClubName = userDoc.data().clubName;
      setclubName(userClubName)
      if (userClubName) {
        const clubDoc = await getDoc(doc(db, "clubs", userClubName));
        setMembers(clubDoc.data().members);
        setFormation(clubDoc.data().formation)
      } else {
        console.error("User has no clubName.");
      }

    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const pagess = [
    {
      image: require("../../assets/manu.png"),
      text: 'Choose from club list',
      text2:'Choose a player from the club list that fits the position.',
      btnText: "Choose from club list",
      navigate: "AddingPlayersManualy"
    },
    {
      image: require("../../assets/recom.png"),
      text: 'Recommend a player',
      text2:'Recommend a player from the recommendation system who is most suitable for the position.',
      btnText: "Recommend a player",
      navigate: "PlayerRecommendationPage"
    }
  ]

  async function updateFormation() {
    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
    const userClubName = userDoc.data().clubName;
    const clubDoc = await getDoc(doc(db, "clubs", userClubName));
    const currentFormation = clubDoc.data().formation;
    for (let i = 0; i < currentFormation.length; i++) {
      //there exist player in formation
      if (currentFormation[i] != null) {
        const userDoc = await getDoc(doc(db, "users", currentFormation[i].uid));
        // check if player data diffrent from formation data
        if ((userDoc.data().assist != currentFormation[i].assist) || (userDoc.data().clearances != currentFormation[i].clearances) || (userDoc.data().crosses != currentFormation[i].crosses)
          || (userDoc.data().goals != currentFormation[i].goals) || (userDoc.data().passes != currentFormation[i].passes) || (userDoc.data().rating != currentFormation[i].rating) ||
          (userDoc.data().saves != currentFormation[i].saves) || (userDoc.data().assist != currentFormation[i].assist) || (userDoc.data().shotsOnTarget != currentFormation[i].shotsOnTarget)
          || (userDoc.data().tackles != currentFormation[i].tackles)
        ) {


          currentFormation[i] = {
            fullName: userDoc.data()?.fullName || "",
            position: userDoc.data()?.position || "",
            uid: userDoc.data()?.uid || "",
            // t3deelll s3oooooooooooooodddddddddddddddd
            goals: userDoc.data().goals,
            assist: userDoc.data().assist,
            rating: userDoc.data().rating,
            saves: userDoc.data().saves,
            clearances: userDoc.data().clearances,
            tackles: userDoc.data().tackles,
            crosses: userDoc.data().crosses,
            passes: userDoc.data().passes,
            shotsOnTarget: userDoc.data().shotsOnTarget,
          };


          await updateDoc(doc(db, "clubs", userClubName), {
            formation: currentFormation,
          })
          console.log("im inside loop and player name: " + currentFormation[i].fullName)
        }

      } else {
        console.log("Player with index: " + i + " is null")
      }
    }
  }



  const deletePlayer = async (playerUid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userClubName = userDoc.data().clubName;

      if (userClubName) {
        const memberIdToRemove = playerUid;
        const clubRef = doc(db, "clubs", userClubName);
        // Get the current members array
        const clubDoc = await getDoc(clubRef);
        const currentMembers = clubDoc.data().members || []; // Ensure it's an array or default to an empty array
        // Find the index of the playerUid in the array
        const indexToRemove = currentMembers.findIndex(
          (member) => member.uid === memberIdToRemove
        );
        if (indexToRemove !== -1) {
          // Use arrayRemove to remove the specified member from the array
          await updateDoc(clubRef, {
            members: arrayRemove(currentMembers[indexToRemove]),
          });
          console.log("Player was deleted");
          // Update the user document to remove the clubName
          await updateDoc(doc(db, "users", playerUid), {
            clubName: "",
          });
          fetchData(); // Assuming fetchData is a function that fetches updated data
        } else {
          console.error("Player not found in the members array.");
        }
      } else {
        console.error("User has no clubName.");
      }
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchData();
    await updateFormation()
    setIsRefreshing(false);
  }, []);
  const render = ({ item }) => {
    return (
      <View className="mr-3"
      >
        <ImageBackground source={require("../../assets/ss.png")}
          style={{ width: 110, height: 160 }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CoachFormationstack", {
                screen: "CoachVisitProfile",
                params: { itemId: item.uid },
              })
            }
          >
            <Avatar.Image className="self-center top-2" size={70} source={{ uri: item.profileImage }} />
          </TouchableOpacity>
          <View style={styles.container}>
            <Text style={styles.fullName}>{item.fullName}</Text>
            <Text style={styles.position}>{item.position}</Text>
          </View>

        </ImageBackground>
      </View>
    );
  };
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [inde, setInde] = useState(null);

  const onScroll = (event) => {
    const scrollViewWidth = event.nativeEvent.layoutMeasurement.width;
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / scrollViewWidth);
    setCurrentIndex(index);
   
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleRadioButtonPress = (value) => {

    setCurrentIndex(value)
  };


  const checkPlayerPosition = async (indexPos) => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));

      if (userDoc.exists()) {
        const userClubName = userDoc.data().clubName;

        const clubDoc = await getDoc(doc(db, "clubs", userClubName));

        if (clubDoc && Array.isArray(clubDoc.data().formation) && clubDoc.data().formation.length > indexPos && clubDoc.data().formation[indexPos] != null) {
          // LW position is already booked in the club's formation
          console.log(" position is already booked in the club's formation.");
          // You can also show an alert, toast, or any other UI notification.
        } else {
          // LW position is null or undefined, navigate to AddplayerToformation screen
          setInde(indexPos); // Set the inde state variable
          setModalVisible(true);


        }
      } else {
        console.error("User document does not exist.");
        // Handle the case where the user document does not exist
      }
    } catch (error) {
      console.error("Error fetching user document:", error);
      // Handle any other errors that may occur during the data retrieval process
    }
  }



  const deleteFromFormation = async (indexPos) => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));

      if (userDoc.exists()) {
        const userClubName = userDoc.data().clubName;

        const clubRef = doc(db, "clubs", userClubName);
        const clubDoc = await getDoc(clubRef);

        if (clubDoc && Array.isArray(clubDoc.data().formation) && clubDoc.data().formation.length > indexPos && clubDoc.data().formation[indexPos] !== null) {

          const updatedFormation = [...clubDoc.data().formation];
          updatedFormation[indexPos] = null;

          await updateDoc(clubRef, { formation: updatedFormation });

          console.log("Player is deleted from the formation");
          console.log(updatedFormation[indexPos]);
        } else {
          console.log("No player found at the specified index in the formation.");
        }
      } else {
        console.error("User document does not exist.");
        // Handle the case where the user document does not exist
      }
    } catch (error) {
      console.error("Error deleting player from formation:", error);
      // Handle any other errors that may occur during the data retrieval process
    }
  };




  const retrievePlayerInfoAtIndex = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userClubName = userDoc.data().clubName;

      const clubDoc = await getDoc(doc(db, "clubs", userClubName));
      const currentFormation = clubDoc.data().formation;
      var data = [11]

      for (let i = 0; i < currentFormation.length; i++) {
        data[i] = await currentFormation[i];
      }

      setFormationNames(data)

    } catch (error) {
      console.error("Error retrieving player info:", error);
      return "No Player";
    }
  };



  return (

    <View className="flex-1" style={{ backgroundColor: "#00B365" }}>

      <View className="flex-1 flex justify-around top-5 ">

        <View className="flex-row justify-center top-7" >

          <Image source={require("../../assets/FF2.png")}
            style={{ width: 320, height: 470 }} />

        </View>

        {/* Here ------------------------------------------------------------- */}
        <View style={styles.refresh}>
          <TouchableOpacity onPress={() => { onRefresh() }}><Text>refresh</Text></TouchableOpacity>
        </View>


        <TouchableOpacity
          style={styles.posstionLw}
          className="items-center"
          onPress={() => checkPlayerPosition(0)}
        >


          {formationNames[0] === null ? (
            <Text className="font-bold right-1 " style={{ top: 55}}>LW</Text>
          ) : (
            <Text className="font-bold right-1" style={{ top: 55}} >{formationNames[0] && formationNames[0].fullName}</Text>
          )}

          <TouchableOpacity onPress={() => deleteFromFormation(0)}>
            <Image className=" left-6" source={require("../../assets/remove.png")}
              style={{ width: 15, height: 15,bottom:28}} />
          </TouchableOpacity>

        </TouchableOpacity>


        <TouchableOpacity
          style={styles.posstionSt}
          className="items-center"
          onPress={() => checkPlayerPosition(1)}
        >


          {formationNames[1] === null ? (
            <Text className="font-bold  top-14 right-1" style={{ top: 51 }} >ST</Text>
          ) : (
            <Text className="font-bold   top-14 right-1"  style={{ top: 51 }}>{formationNames[1] && formationNames[1].fullName}</Text>
          )}


          <TouchableOpacity onPress={() => deleteFromFormation(1)}>
            <Image className=" bottom-4 left-6 " source={require("../../assets/remove.png")}
              style={{ width: 15, height: 15, bottom:31 }} />
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.posstionRw}
          className="items-center"
          onPress={() => checkPlayerPosition(2)}
        >


          {formationNames[2] === null ? (
            <Text className="font-bold top-14" style={{ top: 57 }}>RW</Text>
          ) : (
            <Text className="font-bold top-14 " style={{ top: 57 }} >{formationNames[2] && formationNames[2].fullName}</Text>
          )}

          <TouchableOpacity onPress={() => deleteFromFormation(2)}>
            <Image className=" bottom-4 left-6" source={require("../../assets/remove.png")}
              style={{ width: 15, height: 15, bottom:25 }} />
          </TouchableOpacity>


        </TouchableOpacity>

        <TouchableOpacity
          style={styles.posstionCm1}
          className="items-center"
          onPress={() => {
            checkPlayerPosition(3);
            
          }}
        >



          {formationNames[3] === null ? (
            <Text className="font-bold top-14 " style={{ top: 54 }} >CM1</Text>
          ) : (
            <Text className="font-bold top-14" style={{ top: 54 }} >{formationNames[3] && formationNames[3].fullName}</Text>
          )}

          <TouchableOpacity onPress={() => deleteFromFormation(3)}>
            <Image className=" bottom-4 left-6" source={require("../../assets/remove.png")}
              style={{ width: 15, height: 15, bottom:31}} />
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity  
          style={styles.posstionCm2}
          className="items-center "
          onPress={() => {
            checkPlayerPosition(4);
            
          }}
        >


          {formationNames[4] === null ? (
            <Text className="font-bold top-14 " style={{ top: 52 }} >CM2</Text>
          ) : (
            <Text className="font-bold top-14 " style={{ top: 52 }} >{formationNames[4] && formationNames[4].fullName}</Text>
          )}

          <TouchableOpacity onPress={() => deleteFromFormation(4)}>
            <Image className=" bottom-4 left-6" source={require("../../assets/remove.png")}
              style={{ width: 15, height: 15 ,bottom:33}} />
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.posstionCm3}
          className="items-center"
          onPress={() => checkPlayerPosition(5)}
        >


          {formationNames[5] === null ? (
            <Text className="font-bold text-black" style={{ top: 55 }}>CM3</Text>
          ) : (
            <Text className="font-bold text-black"  style={{ top: 55 }}>{formationNames[5] && formationNames[5].fullName}</Text>
          )}

          <TouchableOpacity onPress={() => deleteFromFormation(5)}>
            <Image className=" bottom-4 left-6" source={require("../../assets/remove.png")}
              style={{ width: 15, height: 15,bottom:30 }} />
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.posstionLb}
          className="items-center"
          onPress={() => checkPlayerPosition(6)}
        >


          {formationNames[6] === null ? (
            <Text className="font-bold text-black"style={{ top: 52 }} >LB</Text>
          ) : (
            <Text className="font-bold text-black" style={{ top: 52 }}>{formationNames[6] && formationNames[6].fullName}</Text>
          )}

          <TouchableOpacity onPress={() => deleteFromFormation(6)}>
            <Image className=" bottom-4 left-6" source={require("../../assets/remove.png")}
              style={{ width: 15, height: 15,bottom:31 }} />
          </TouchableOpacity>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.posstionCb1}
          className="items-center"
          onPress={() => checkPlayerPosition(7)}
        >


          {formationNames[7] === null ? (
            <Text className="font-bold text-black" style={{ top: 55 }}>CB1</Text>
          ) : (
            <Text className="font-bold text-black"  style={{ top: 55 }}>{formationNames[7] && formationNames[7].fullName}</Text>
          )}

          <TouchableOpacity onPress={() => deleteFromFormation(7)}>
            <Image className=" bottom-4 left-6" source={require("../../assets/remove.png")}
              style={{ width: 15, height: 15,bottom:30 }} />
          </TouchableOpacity>


        </TouchableOpacity>

        <TouchableOpacity
          style={styles.posstionCb2}
          className="items-center"
          onPress={() => checkPlayerPosition(8)}
        >


          {formationNames[8] === null ? (
            <Text className="font-bold text-black" style={{ top: 54 }}>CB2</Text>
          ) : (
            <Text className="font-bold text-black"  style={{ top: 54 }}>{formationNames[8] && formationNames[8].fullName}</Text>
          )}

          <TouchableOpacity onPress={() => deleteFromFormation(8)}>
            <Image className=" bottom-4 left-6" source={require("../../assets/remove.png")}
              style={{ width: 15, height: 15,bottom:32 }} />
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.posstionRb}
          className="items-center"
          onPress={() => checkPlayerPosition(9)}
        >


          {formationNames[9] === null ? (
            <Text className="font-bold text-black" style={{ top: 55 }}>RB</Text>
          ) : (
            <Text className="font-bold text-black"  style={{ top: 55 }}>{formationNames[9] && formationNames[9].fullName}</Text>
          )}

          <TouchableOpacity onPress={() => deleteFromFormation(9)}>
            <Image className=" bottom-4 left-6" source={require("../../assets/remove.png")}
              style={{ width: 15, height: 15,bottom:30 }} />
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.posstiongk}
          className="items-center "
          onPress={() => checkPlayerPosition(10)}
        >


          {formationNames[10] === null ? (
            <Text className="font-bold text-black "  style={{ top: 51 }}>GK</Text>
          ) : (
            <Text className="font-bold text-black" style={{ top: 51 }}>{formationNames[10] && formationNames[10].fullName}</Text>
          )}

          <TouchableOpacity onPress={() => deleteFromFormation(10)}>
            <Image className=" bottom-4 left-6" source={require("../../assets/remove.png")}
              style={{ width: 15, height: 15,bottom:31 }} />
          </TouchableOpacity>


        </TouchableOpacity>

        {/* Here ------------------------------------------------------------- */}
      </View>


      <Modal visible={modalVisible} animationType="fade" transparent={true}>


        <View style={styles.modalContainer}>

          <ScrollView
            style={styles.scrollView}
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={onScroll}
          >

            {
              pagess.map((e, i) => (
                <View key={i} style={styles.page}>
                  <View className="bottom-20 justify-center">
                    <Image source={e.image}
                      style={{ width: 360, height: 280 }} />
                  </View>
                  

                  <Text  style={styles.titletext}>{e.text}</Text>
                       

                  <Text  style={styles.text2}>{e.text2}</Text>    



                  {
                    i === 0 ? (
                      <TouchableOpacity style={styles.button}
                        onPress={() => {
                          navigation.navigate(e.navigate, { index: inde });
                          closeModal();
                        }}

                        className="py-3 self-center w-28 rounded-2xl">
                        <Text className=" text-center  text-white font-bold">{e.btnText}</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity style={styles.button}
                        onPress={() => {
                          navigation.navigate(e.navigate, { index: inde });
                          closeModal();
                        }}

                        className="py-3 self-center	  w-28 rounded-2xl">
                        <Text className=" text-center  text-white font-bold" >{e.btnText}</Text>
                      </TouchableOpacity>
                    )
                  }




                </View>
              ))
            }

            {/* Page 2 */}
            {/* {currentIndex === 1 && (
              <View style={styles.page}>

                <View className="bottom-20 justify-center">
                  <Image source={require("../../assets/recom.png")}
                    style={{ width: 360, height: 280 }} />
                </View>



                <Text>Page 2 Content</Text>

                <TouchableOpacity className="text-gray-700  right-3 ml-4" onPress={() => handleRadioButtonPress(0)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: 'black',
                        marginRight: 10,
                        backgroundColor:
                          currentIndex === 0 ? '#00b365' : 'transparent',
                      }}
                    />
                    <Text>go to page 1</Text>


                  </View>
                </TouchableOpacity>



                <TouchableOpacity className="text-gray-700  right-3 ml-4" onPress={() => handleRadioButtonPress(1)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: 'black',
                        marginRight: 10,
                        backgroundColor:
                          currentIndex === 1 ? '#00b365' : 'transparent',
                      }}
                    />
                    <Text>page 2</Text>


                  </View>
                </TouchableOpacity>





              </View>
            )} */}
          </ScrollView>

          {/* Close Modal Button */}
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <Image source={require("../../assets/close.png")}
            style={{ width: 25, height: 25 }} />
          </TouchableOpacity>
        </View>
      </Modal>





      <View>
        <TouchableOpacity
          onPress={() => navigation.navigate("CoachFormationAdd")}
          className="bg-yellow-400 bottom-2 w-28 self-end p-2 rounded-t-2xl rounded-b-2xl ml-2"
        >
          <Text className="self-center  font-bold">Add player</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <FlatList
          data={members}
          renderItem={render}
          horizontal
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />

          }
        />
      </View>

    </View>
  );
};
const styles = StyleSheet.create({

  container: {
    alignItems: 'center', // Center items horizontally
    marginTop: '5%',      // 5% of the screen height margin from the top
  },
  fullName: {
    fontSize: 16,          // Example font size
    fontWeight: 'bold',
    marginBottom: '2%',
        // 2% of the screen height margin at the bottom
  },
  position: {
    fontSize: 14,          // Example font size
    fontWeight: 'bold',
    marginTop: '2%',       // 2% of the screen height margin at the top
  },

  posstionLb: {
    bottom: 150,
    left: 53,
    width: 65
    , height: 60,
    color: "#263238",
  },
  posstiongk: {
    width: 65
    , height: 60,
    alignSelf: "center",
    bottom: 49,
    textAlign: "center",
    right: 4,

  },
  posstionRb: {
    bottom: 178,
    left: 270,
    width: 65
    , height: 60,
    color: "#263238",

  },
  posstionCb1: {
    bottom: 102,
    left: 214,
    width: 65
    , height: 60,
    color: "#263238",
  },
  posstionCb2: {
    bottom: 107,
    left: 110,
    width: 60
    , height: 65,
    color: "#263238",

  },
  posstionCm1: {
    bottom: 184,
    alignSelf: 'center',
    height: 60,
    color: "#263238",
    width: 65,
    right: 3,



  },
  posstionCm2: {
    bottom: 228,
    height: 60,
    color: "#263238",
    width: 65
    , left: 79,


  },
  posstionCm3: {
    bottom: 237,
    left: 244,
    color: "#263238",
    width: 65
    , height: 60,



  },
  posstionLw: {
    bottom: 312,
    left: 60,

    height: 60,
    color: "#263238",
    width: 65


  },
  refresh: {
    bottom: 380,
    left: 65,
    width: 50,
    height: 30,

  },
  posstionRw: {
    bottom: 328,
    left: 260,
    height: 60,
    color: "#263238",
    width: 65,


  },
  posstionSt: {
    bottom: 353,
    height: 60,
    color: "#263238",
    width: 65,
    right: 1,

    alignSelf: 'center',
  },
  button: {
    position: 'absolute',
    top: 410, // Adjust the top position as needed
     // Adjust the right position as needed
    backgroundColor:'#F4C611',
    padding: 10,
    width:200,
    
  },
  modalContainer: {

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white",
    width: '90%',
    left: 20,

    top: 30,
    borderRadius: 20,

  },
  scrollView: {

    width: '100%',

  },
  page: {

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white",
    width: 360,
    height: 500,
    borderRadius: 20,


  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 10,
   
    borderRadius: 5,
  },titletext:{
  fontSize:30,
  bottom:55,
  fontWeight:"bold",
  color:"#F4C611",
  textAlign:'center'




  },text2:{
    fontSize:14,
    bottom:48,
    fontWeight:"bold",
    color:"#263238",
    textAlign:'center',
    width:300
  
  
  
  
    },
});

