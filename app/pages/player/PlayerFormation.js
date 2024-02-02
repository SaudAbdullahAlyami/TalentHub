import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ImageBackground,
  ScrollView,
  Alert
} from "react-native";
import { Avatar } from "react-native-paper";
import { doc, updateDoc, getDoc,  } from "firebase/firestore";
import { db, auth } from "../../component/config/config";
import { moderateScale, scale, verticalScale } from "../../responsiveSizes";
export const PlayerFormation = ({ navigation }) => {
  const [members, setMembers] = useState([]);
  const [clubName, setclubName] = useState("");
  const [formation, setFormation] = useState([]);
  const [formationNames, setFormationNames] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);


  useEffect(() => {
    fetchData();
    return () => {};
  }, [isRefreshing]);



  const fetchData = async () => {
    retrievePlayerInfoAtIndex();
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userClubName = userDoc.data().clubName;
      setclubName(userClubName);
      if (userClubName) {
        const clubDoc = await getDoc(doc(db, "clubs", userClubName));
        setMembers(clubDoc.data().members);
        setFormation(clubDoc.data().formation);
      } else {
        console.error("User has no clubName.");
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    await updateFormation();
    setIsRefreshing(false);
  };

  const leaveTeam = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userClubName = userDoc.data().clubName;

      if (userClubName) {
        const memberIdToRemove = auth.currentUser.uid; // Assuming you want to remove the current user
        const clubRef = doc(db, "clubs", userClubName);

        // Get the current members array
        const clubDoc = await getDoc(clubRef);
        const currentMembers = clubDoc.data().members;

        // Remove the specified member from the array
        const updatedMembers = currentMembers.filter(member => member.uid !== memberIdToRemove);

        // Update the club document with the new members array
        await updateDoc(clubRef, {
          members: updatedMembers
        });
        console.log("Player was deleted")
        fetchData();
        //Update the user document to remove the clubName
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          clubName: ""
        });
        Alert.alert("Successfully ","You left the team successfully.")
      } else {
        console.error("User has no clubName.");
      }
    } catch (error) {
      console.error("Error leaving team:", error);
    }
  };

  const render = ({ item }) => {
    return (
      <View className="">
        <ImageBackground
          source={require("../../assets/card.png")}
          style={{ width: 100, height: 160 }}
        >
        <TouchableOpacity
            onPress={() =>
              navigation.navigate("PlayerFormationstack", {
                screen: "PlayerVisitProfile",
                params: { itemId: item.uid },
              })
            }
          >
            <Avatar.Image className="self-center top-2" size={70} source={{ uri: item.profileImage }} />
          </TouchableOpacity>
          <View style={styles.container}>
            <Text className="top-1 " style={styles.fullName}>
              {item.fullName}
            </Text>
            <Text style={styles.position}>{item.position}</Text>
          </View>
        </ImageBackground>
      </View>
    );
  };

 

 

 

  const retrievePlayerInfoAtIndex = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const userClubName = userDoc.data().clubName;

      const clubDoc = await getDoc(doc(db, "clubs", userClubName));
      const currentFormation = clubDoc.data().formation;
      var data = [11];

      for (let i = 0; i < currentFormation.length; i++) {
        data[i] = await currentFormation[i];
      }

      setFormationNames(data);
    } catch (error) {
      console.error("Error retrieving player info:", error);
      return "No Player";
    }
  };

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
        if (
          userDoc.data().assist != currentFormation[i].assist ||
          userDoc.data().clearances != currentFormation[i].clearances ||
          userDoc.data().crosses != currentFormation[i].crosses ||
          userDoc.data().goals != currentFormation[i].goals ||
          userDoc.data().passes != currentFormation[i].passes ||
          userDoc.data().rating != currentFormation[i].rating ||
          userDoc.data().saves != currentFormation[i].saves ||
          userDoc.data().assist != currentFormation[i].assist ||
          userDoc.data().shotsOnTarget != currentFormation[i].shotsOnTarget ||
          userDoc.data().tackles != currentFormation[i].tackles
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
          });
          console.log(
            "im inside loop and player name: " + currentFormation[i].fullName
          );
        }
      } else {
        console.log("Player with index: " + i + " is null");
      }
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#00B365" }}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <View className="flex-1" style={{ backgroundColor: "#00B365" }}>
        <View className="flex-1 flex justify-around top-5 ">
          <View className="flex-row justify-center top-7">
            <Image
              source={require("../../assets/field.jpg")}
              style={{ width: 320, height: 470 }}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.posstionLw}
            className="items-center"
           
          >
            <Image
              source={require("../../assets/lw.png")}
              style={{
                width: moderateScale(60),
                height: moderateScale(50),
              }}
            />

            {formationNames[0] === null ? (
              <Text className="font-bold ">LW</Text>
            ) : (
              <Text className="font-bold">
                {formationNames[0] && formationNames[0].fullName}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.posstionSt}
            className="items-center"
          >
            
            <Image
              source={require("../../assets/st.png")}
              style={{
                width: moderateScale(60),
                height: moderateScale(50),
              }}
            />
            {formationNames[1] === null ? (
              <Text className="font-bold">ST</Text>
            ) : (
              <Text className="font-bold">
                {formationNames[1] && formationNames[1].fullName}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.posstionRw}
            className="items-center"
          >
            
            <Image
              source={require("../../assets/rw.png")}
              style={{
                width: moderateScale(60),
                height: moderateScale(50),
              }}
            />
            {formationNames[2] === null ? (
              <Text className="font-bold">RW</Text>
            ) : (
              <Text className="font-bold">
                {formationNames[2] && formationNames[2].fullName}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.posstionCm1}
            className="items-center"
            
          >
            

            <Image
              source={require("../../assets/cm1.png")}
              style={{
                width: moderateScale(60),
                height: moderateScale(50),
              }}
            />
            {formationNames[3] === null ? (
              <Text className="font-bold ">CM1</Text>
            ) : (
              <Text className="font-bold">
                {formationNames[3] && formationNames[3].fullName}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.posstionCm2}
            className="items-center "
          >
           
            <Image
              source={require("../../assets/cm2.png")}
              style={{
                width: moderateScale(60),
                height: moderateScale(50),
              }}
            />
            {formationNames[4] === null ? (
              <Text className="font-bold  ">CM2</Text>
            ) : (
              <Text className="font-bold ">
                {formationNames[4] && formationNames[4].fullName}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.posstionCm3}
            className="items-center"
           
          >
           
            <Image
              source={require("../../assets/cm3.png")}
              style={{
                width: moderateScale(60),
                height: moderateScale(50),
              }}
            />
            {formationNames[5] === null ? (
              <Text className="font-bold text-black">CM3</Text>
            ) : (
              <Text className="font-bold text-black">
                {formationNames[5] && formationNames[5].fullName}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.posstionLb}
            className="items-center"
         
          >
           
            <Image
              source={require("../../assets/lb.png")}
              style={{
                width: moderateScale(60),
                height: moderateScale(50),
              }}
            />
            {formationNames[6] === null ? (
              <Text className="font-bold text-black">LB</Text>
            ) : (
              <Text className="font-bold text-black">
                {formationNames[6] && formationNames[6].fullName}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.posstionCb1}
            className="items-center"
          >
           
            <Image
              source={require("../../assets/cb2.png")}
              style={{
                width: moderateScale(60),
                height: moderateScale(50),
              }}
            />
            {formationNames[7] === null ? (
              <Text className="font-bold text-black">CB1</Text>
            ) : (
              <Text className="font-bold text-black">
                {formationNames[7] && formationNames[7].fullName}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.posstionCb2}
            className="items-center"
          >
           
            <Image
              source={require("../../assets/cb1.png")}
              style={{
                width: moderateScale(60),
                height: moderateScale(50),
              }}
            />
            {formationNames[8] === null ? (
              <Text className="font-bold text-black">CB2</Text>
            ) : (
              <Text className="font-bold text-black">
                {formationNames[8] && formationNames[8].fullName}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.posstionRb}
            className="items-center"
          >
           
            <Image
              source={require("../../assets/rb.png")}
              style={{
                width: moderateScale(60),
                height: moderateScale(50),
              }}
            />
            {formationNames[9] === null ? (
              <Text className="font-bold text-black">RB</Text>
            ) : (
              <Text className="font-bold text-black">
                {formationNames[9] && formationNames[9].fullName}
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.posstiongk}
            className="items-center "
          >
            
            <Image
              source={require("../../assets/gk.png")}
              style={{
                width: moderateScale(60),
                height: moderateScale(50),
              }}
            />
            {formationNames[10] === null ? (
              <Text className="font-bold text-black ">GK</Text>
            ) : (
              <Text className="font-bold text-black">
                {formationNames[10] && formationNames[10].fullName}
              </Text>
            )}
          </TouchableOpacity>
        </View>

       

        <View>
          <TouchableOpacity
            onPress={() => leaveTeam()}
            style={{
              width: moderateScale(90),
              height: moderateScale(32),
              borderRadius: moderateScale(20),
              backgroundColor: "#F4C611",
              justifyContent: "center",
              alignItems: "center",
              marginTop: verticalScale(60),
              marginBottom: verticalScale(20),
              alignSelf: "flex-end",
              marginRight: scale(30),
            }}
          >
            <Text className="self-center  font-bold">Leave Team</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.containesr}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={members}
            contentContainerStyle={{
              marginHorizontal: scale(5),
            }}
            renderItem={render}
            horizontal
            // refreshControl={
            //   <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            // }
          />
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: "5%",
  },
  fullName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: "2%",
    top: verticalScale(12),
  },
  position: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: "2%",
    top: verticalScale(22),
  },

  posstionLb: {
    position: "absolute",
    bottom: verticalScale(123),
    left: scale(49),
    width: moderateScale(70),
    height: moderateScale(80),
    alignItems: "center",
    justifyContent: "space-between",
    color: "#263238",
    flexDirection: "column",
  },
  posstiongk: {
    position: "absolute",
    width: moderateScale(70),
    height: moderateScale(80),
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    bottom: verticalScale(-22),

    flexDirection: "column",
  },
  posstionRb: {
    position: "absolute",
    bottom: verticalScale(123),
    right: scale(50),
    width: moderateScale(70),
    height: moderateScale(80),
    alignItems: "center",
    justifyContent: "space-between",
    color: "#263238",
    flexDirection: "column",
  },
  posstionCb1: {
    position: "absolute",
    bottom: verticalScale(62),
    left: scale(203),
    width: moderateScale(70),
    height: moderateScale(80),
    justifyContent: "space-between",
    alignItems: "center",
    color: "#263238",
    flexDirection: "column",
  },
  posstionCb2: {
    position: "absolute",
    bottom: verticalScale(62),
    left: scale(101),
    width: moderateScale(70),
    height: moderateScale(80),
    justifyContent: "space-between",
    alignItems: "center",
    color: "#263238",
    flexDirection: "column",
  },
  posstionCm1: {
    position: "absolute",
    bottom: verticalScale(182),
    alignSelf: "center",
    height: moderateScale(80),
    color: "#263238",
    width: moderateScale(70),
    alignItems: "center",
    justifyContent: "space-between",

    flexDirection: "column",
  },
  posstionCm2: {
    position: "absolute",
    bottom: verticalScale(225),
    height: moderateScale(80),
    color: "#263238",
    width: moderateScale(70),
    left: scale(72),
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  posstionCm3: {
    bottom: verticalScale(225),
    position: "absolute",
    right: scale(77),
    color: "#263238",
    height: moderateScale(80),
    width: moderateScale(70),
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  posstionLw: {
    position: "absolute",
    top: verticalScale(75),
    left: scale(52),
    color: "#263238",
    height: moderateScale(80),
    width: moderateScale(70),
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  refresh: {
    bottom: 380,
    left: 65,
    width: 50,
    height: 30,
  },
  posstionRw: {
    position: "absolute",
    top: verticalScale(75),
    right: scale(62),
    height: moderateScale(80),
    color: "#263238",
    width: moderateScale(70),
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  posstionSt: {
    position: "absolute",
    top: verticalScale(41),
    color: "#263238",
    height: moderateScale(80),
    width: moderateScale(70),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",

    flexDirection: "column",
  },
  button: {
    position: "absolute",
    top: 410,
    backgroundColor: "#F4C611",
    padding: 10,
    width: 200,
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: "90%",
    left: 20,
    top: 30,
    borderRadius: 20,
  },
  scrollView: {
    width: "100%",
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: 360,
    height: 500,
    borderRadius: 20,
  },
  closeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    padding: 10,

    borderRadius: 5,
  },
  titletext: {
    fontSize: 30,
    bottom: 55,
    fontWeight: "bold",
    color: "#F4C611",
    textAlign: "center",
  },
  text2: {
    fontSize: 14,
    bottom: 48,
    fontWeight: "bold",
    color: "#263238",
    textAlign: "center",
    width: 300,
  },
});
