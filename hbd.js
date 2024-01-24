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
  RefreshControl, ImageBackground,Modal,ScrollView
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


 
    const [currentIndex, setCurrentIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
  
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




  useEffect(() => {
    fetchData();
    // Clean up the subscription when the component unmounts
    return () => {
      /* Cleanup logic if needed */
    };
  }, [fetchData]);

  const fetchData = async () => {
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

  async function  updateFormation(){
    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
    const userClubName = userDoc.data().clubName;
  const clubDoc = await getDoc(doc(db, "clubs", userClubName));
  const currentFormation =clubDoc.data().formation;
  for (let i=0;i<currentFormation.length;i++){
    //there exist player in formation
    if(currentFormation[i]!=null){
      const userDoc = await getDoc(doc(db, "users", currentFormation[i].uid));
    // check if player data diffrent from formation data
      if((userDoc.data().assist != currentFormation[i].assist)||(userDoc.data().clearances != currentFormation[i].clearances)||(userDoc.data().crosses != currentFormation[i].crosses)
      || (userDoc.data().goals != currentFormation[i].goals)||(userDoc.data().passes != currentFormation[i].passes)||(userDoc.data().rating != currentFormation[i].rating)||
      (userDoc.data().saves!= currentFormation[i].saves)||(userDoc.data().assist != currentFormation[i].assist)||(userDoc.data().shotsOnTarget != currentFormation[i].shotsOnTarget)
      ||(userDoc.data().tackles != currentFormation[i].tackles)
      ){

        currentFormation[i] = {
          fullName: userDoc.data()?.fullName || "",
          position: userDoc.data()?.position || "",
          uid: userDoc.data()?.uid || "",
          // t3deelll s3oooooooooooooodddddddddddddddd
          goals:userDoc.data().goals,
          assist:userDoc.data().assist,
          rating:userDoc.data().rating,
          saves:userDoc.data().saves,
          clearances:userDoc.data().clearances,
          tackles:userDoc.data().tackles,
          crosses :userDoc.data().crosses,
          passes:userDoc.data().passes,
          shotsOnTarget:userDoc.data().shotsOnTarget,
      };


        await updateDoc(doc(db, "clubs", clubName),{
          formation: currentFormation,
        })
        console.log("im inside loop and player name: "+currentFormation[i].fullName)
      }
      
    }else{
      console.log("Player with index: "+i+" is null")
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
        <ImageBackground source={require("../../assets/bk1.png")}
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
          <TouchableOpacity onPress={() => deletePlayer(item.uid)}>
            <Text className="font-bold top-5 text-gre self-center">Delete</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
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


  return (


    <View className="flex-1" style={{ backgroundColor: "#00B365" }}>
      <View className="flex-1 flex justify-around my-5">
        <View className="flex-row justify-center top-7" >
          <Image source={require("../../assets/field.jpg")}
            style={{ width: 315, height: 450 }} />
        </View>

        {/* Here ------------------------------------------------------------- */}

        <TouchableOpacity
          style={styles.posstionLw}
          className="items-center"
          onPress={() => checkPlayerPosition(0)}
        >
          <Image source={require("../../assets/player.png")} style={{ width: 40, height: 40 }} />
          <Text className="font-bold text-black">LW</Text>

          <TouchableOpacity onPress={() => deleteFromFormation(0)}>
            <Text className="font-bold top-0 text-gre self-center">Delet</Text>
          </TouchableOpacity>

        </TouchableOpacity>


        <TouchableOpacity
          style={styles.posstionSt}
          className="items-center"
          onPress={() => checkPlayerPosition(1)}
        >
          <Image source={require("../../assets/player.png")} style={{ width: 40, height: 40 }} />
          <Text className="font-bold text-black">ST</Text>

          <TouchableOpacity onPress={() => deleteFromFormation(1)}>
            <Text className="font-bold top-0 text-gre self-center">Delet</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.posstionRw}
          className="items-center"
          onPress={() => checkPlayerPosition(2)}
        >
          <Image source={require("../../assets/player.png")} style={{ width: 40, height: 40 }} />
          <Text className="font-bold text-black">RW</Text>

          <TouchableOpacity onPress={() => deleteFromFormation(2)}>
            <Text className="font-bold top-0 text-gre self-center">Delet</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.posstionCm1}
          className="items-center"
          onPress={() => checkPlayerPosition(3)}
        >
          <Image source={require("../../assets/player.png")} style={{ width: 40, height: 40 }} />
          <Text className="font-bold text-black">CM1</Text>

          <TouchableOpacity onPress={() => deleteFromFormation(3)}>
            <Text className="font-bold top-0 text-gre self-center">Delet</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.posstionCm2}
          className="items-center"
          onPress={() => checkPlayerPosition(4)}
        >
          <Image source={require("../../assets/player.png")} style={{ width: 40, height: 40 }} />
          <Text className="font-bold text-black">CM2</Text>

          <TouchableOpacity onPress={() => deleteFromFormation(4)}>
            <Text className="font-bold top-0 text-gre self-center">Delet</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.posstionCm3}
          className="items-center"
          onPress={() => checkPlayerPosition(5)}
        >
          <Image source={require("../../assets/player.png")} style={{ width: 40, height: 40 }} />
          <Text className="font-bold text-black">CM3</Text>

          <TouchableOpacity onPress={() => deleteFromFormation(5)}>
            <Text className="font-bold top-0 text-gre self-center">Delet</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.posstionLb}
          className="items-center"
          onPress={() => checkPlayerPosition(6)}
        >
          <Image source={require("../../assets/player.png")} style={{ width: 40, height: 40 }} />
          <Text className="font-bold text-black">LB</Text>

          <TouchableOpacity onPress={() => deleteFromFormation(6)}>
            <Text className="font-bold top-0 text-gre self-center">Delet</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.posstionCb1}
          className="items-center"
          onPress={() => checkPlayerPosition(7)}
        >
          <Image source={require("../../assets/player.png")} style={{ width: 40, height: 40 }} />
          <Text className="font-bold text-black">CB1</Text>

          <TouchableOpacity onPress={() => deleteFromFormation(7)}>
            <Text className="font-bold top-0 text-gre self-center">Delet</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.posstionCb2}
          className="items-center"
          onPress={() => checkPlayerPosition(8)}
        >
          <Image source={require("../../assets/player.png")} style={{ width: 40, height: 40 }} />
          <Text className="font-bold text-black">CB2</Text>

          <TouchableOpacity onPress={() => deleteFromFormation(8)}>
            <Text className="font-bold top-0 text-gre self-center">Delet</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.posstionRb}
          className="items-center"
          onPress={() => checkPlayerPosition(9)}
        >
          <Image source={require("../../assets/player.png")} style={{ width: 40, height: 40 }} />
          <Text className="font-bold text-black">RB</Text>

          <TouchableOpacity onPress={() => deleteFromFormation(9)}>
            <Text className="font-bold top-0 text-gre self-center">Delet</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.posstiongk}
          className="items-center"
          onPress={() => checkPlayerPosition(10)}
        >
          <Image source={require("../../assets/player.png")} style={{ width: 40, height: 40 }} />
          <Text className="font-bold text-black">GK</Text>

          <TouchableOpacity onPress={() => deleteFromFormation(10)}>
            <Text className="font-bold top-0 text-gre self-center">Delet</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Here ------------------------------------------------------------- */}
      </View>
          
      <View style={styles.container}>
        
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text>Show Modal</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="fade"   transparent={true}>
   
        <View style={styles.modalContainer}>
     
          <ScrollView
            style={styles.scrollView}
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={onScroll}
          >
            {/* Page 1 */}
            {currentIndex === 0 && (
              <View style={styles.page}>
                   <View className="bottom-20 justify-center">
            <Image source={require("../../assets/manu.png")}
                style={{width: 360, height: 280}} />
        </View>
       
                <Text>Page 1 Content</Text>


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
                <Text>page 1</Text>

                
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
                <Text>go to page 2</Text>
                     
                
              </View>
            </TouchableOpacity>


              </View>
            )}

            {/* Page 2 */}
            {currentIndex === 1 && (
              <View style={styles.page}>

<View className="bottom-20 justify-center">
            <Image source={require("../../assets/recom.png")}
                style={{width: 360, height: 280}} />
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
            )}
          </ScrollView>

          {/* Close Modal Button */}
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text>Close Modal</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>


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
    marginBottom: '2%',    // 2% of the screen height margin at the bottom
  },
  position: {
    fontSize: 14,          // Example font size
    fontWeight: 'bold',
    marginTop: '2%',       // 2% of the screen height margin at the top
  },

  posstionLb: {
    bottom: '29%',
    left: 60,
    width: 40,
    height: 40,

  },
  posstiongk: {

    width: 40,
    height: 40,

    alignSelf: 'center'
  },
  posstionRb: {
    bottom: 140,
    left: 314,
    width: 40,
    height: 40,

  },
  posstionCb1: {
    bottom: 90,
    left: 245,
    width: 40,
    height: 40,

  },
  posstionCb2: {
    bottom: 94,
    left: 130,
    width: 40,
    height: 40,

  },
  posstionCm1: {
    bottom: '40%',
    alignSelf: 'center',
    width: 40,
    height: 40,

  },
  posstionCm2: {
    bottom: 255,
    width: 40,
    left: 110,
    height: 40,


  },
  posstionCm3: {
    bottom: 259,
    left: 263,
    width: 40,
    height: 40,

  },
  posstionLw: {
    bottom: 345,
    left: 65,
    width: 40,
    height: 40,

  },
  posstionRw: {
    bottom: 348,
    left: 310,
    width: 40,
    height: 40,

  },
  posstionSt: {
    bottom: 375,
    width: 40,
    height: 40,

    alignSelf: 'center',
  },container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
    
  },
  button: {
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
    marginBottom: 10,
  },
  modalContainer: {
   
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"white",
    width:'90%',
    left:20,
    
   top:30,
   borderRadius: 20,
    
  },
  scrollView: {
   
    width: '100%',
    
  },
  page: {
   
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"white",
    width:360,
    height:500,
    borderRadius: 20,
    
    
  },
  closeButton: {
    position: 'absolute',
  top:10,
  right:50,
    padding: 10,
    backgroundColor: 'lightcoral',
    borderRadius: 5,
  },
});