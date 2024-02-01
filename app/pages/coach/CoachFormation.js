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
  Modal,
} from "react-native";
import { Avatar } from "react-native-paper";
import { doc, updateDoc, getDoc, arrayRemove } from "firebase/firestore";
import { db, auth } from "../../component/config/config";
import { moderateScale, scale, verticalScale } from "../../responsiveSizes";
export const CoachFormation = ({ navigation }) => {
  const [members, setMembers] = useState([]);
  const [clubName, setclubName] = useState("");
  const [formation, setFormation] = useState([]);
  const [formationNames, setFormationNames] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [inde, setInde] = useState(null);

  useEffect(() => {
    fetchData();
    return () => { };
  }, [isRefreshing]);

  const pagess = [
    {
      image: require("../../assets/manu.png"),
      text: "Choose from club list",
      text2: "Choose a player from the club list that fits the position.",
      btnText: "Choose from club list",
      navigate: "AddingPlayersManualy",
    },
    {
      image: require("../../assets/recom.png"),
      text: "Recommend a player",
      text2:
        "Recommend a player from the recommendation system who is most suitable for the position.",
      btnText: "Recommend a player",
      navigate: "PlayerRecommendationPage",
    },
  ];

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

  const render = ({ item }) => {
    return (
      <View className=""
      >
        <TouchableOpacity onPress={() => deletePlayer(item.uid)}>
          <Image
            source={require("../../assets/remove.png")}
            style={{ width: moderateScale(15), height: moderateScale(15), alignSelf: "flex-end" }}
          />

        </TouchableOpacity>
        <ImageBackground source={require("../../assets/card.png")}
          style={{ width: 100, height: 160 }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("CoachFormationstack", {
                screen: "CoachVisitProfile",
                params: { itemId: item.uid },
              })
            }
          >
            <Avatar.Image
              className="self-center top-3"
              size={65}
              source={{ uri: item.profileImage }}
            />
          </TouchableOpacity>
          <View style={styles.container}>
            <Text className="top-1 " style={styles.fullName}>{item.fullName}</Text>
            <Text style={styles.position}>{item.position}</Text>
          </View>

        </ImageBackground>
      </View>
    );
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleRadioButtonPress = (value) => {
    setCurrentIndex(value);
  };

  const checkPlayerPosition = async (indexPos) => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));

      if (userDoc.exists()) {
        const userClubName = userDoc.data().clubName;

        const clubDoc = await getDoc(doc(db, "clubs", userClubName));

        if (
          clubDoc &&
          Array.isArray(clubDoc.data().formation) &&
          clubDoc.data().formation.length > indexPos &&
          clubDoc.data().formation[indexPos] != null
        ) {
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
  };

  const deleteFromFormation = async (indexPos) => {
    try {
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));

      if (userDoc.exists()) {
        const userClubName = userDoc.data().clubName;

        const clubRef = doc(db, "clubs", userClubName);
        const clubDoc = await getDoc(clubRef);

        if (
          clubDoc &&
          Array.isArray(clubDoc.data().formation) &&
          clubDoc.data().formation.length > indexPos &&
          clubDoc.data().formation[indexPos] !== null
        ) {
          const updatedFormation = [...clubDoc.data().formation];
          updatedFormation[indexPos] = null;

          await updateDoc(clubRef, { formation: updatedFormation });

          console.log("Player is deleted from the formation");
          console.log(updatedFormation[indexPos]);
        } else {
          console.log(
            "No player found at the specified index in the formation."
          );
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

  const onScroll = (event) => {
    const scrollViewWidth = event.nativeEvent.layoutMeasurement.width;
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / scrollViewWidth);
    setCurrentIndex(index);
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
            onPress={() => checkPlayerPosition(0)}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ alignSelf: "flex-end", top: verticalScale(5) }}
              onPress={() => deleteFromFormation(0)}
            >
              <Image
                source={require("../../assets/remove.png")}
                style={{
                  width: moderateScale(15),
                  height: moderateScale(15),
                }}
              />
            </TouchableOpacity>
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
            onPress={() => checkPlayerPosition(1)}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ alignSelf: "flex-end", top: verticalScale(5), }}
              onPress={() => deleteFromFormation(1)}
            >
              <Image
                source={require("../../assets/remove.png")}
                style={{ width: moderateScale(15), height: moderateScale(15) }}
              />
            </TouchableOpacity>
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
            onPress={() => checkPlayerPosition(2)}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ alignSelf: "flex-end", top: verticalScale(5) }}
              onPress={() => deleteFromFormation(2)}
            >
              <Image
                source={require("../../assets/remove.png")}
                style={{ width: moderateScale(15), height: moderateScale(15) }}
              />
            </TouchableOpacity>
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
            onPress={() => {
              checkPlayerPosition(3);
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ alignSelf: "flex-end", top: verticalScale(5) }}
              onPress={() => deleteFromFormation(3)}
            >
              <Image
                source={require("../../assets/remove.png")}
                style={{ width: moderateScale(15), height: moderateScale(15) }}
              />
            </TouchableOpacity>

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
            onPress={() => {
              checkPlayerPosition(4);
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ alignSelf: "flex-end", top: verticalScale(5) }}
              onPress={() => deleteFromFormation(4)}
            >
              <Image
                source={require("../../assets/remove.png")}
                style={{ width: moderateScale(15), height: moderateScale(15) }}
              />
            </TouchableOpacity>
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
            onPress={() => checkPlayerPosition(5)}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ alignSelf: "flex-end", top: verticalScale(5) }}
              onPress={() => deleteFromFormation(5)}
            >
              <Image
                source={require("../../assets/remove.png")}
                style={{ width: moderateScale(15), height: moderateScale(15) }}
              />
            </TouchableOpacity>
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
            onPress={() => checkPlayerPosition(6)}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ alignSelf: "flex-end", top: verticalScale(5) }}
              onPress={() => deleteFromFormation(6)}
            >
              <Image
                source={require("../../assets/remove.png")}
                style={{ width: moderateScale(15), height: moderateScale(15) }}
              />
            </TouchableOpacity>
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
            onPress={() => checkPlayerPosition(7)}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ alignSelf: "flex-end", top: verticalScale(5) }}
              onPress={() => deleteFromFormation(7)}
            >
              <Image
                source={require("../../assets/remove.png")}
                style={{ width: moderateScale(15), height: moderateScale(15) }}
              />
            </TouchableOpacity>
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
            onPress={() => checkPlayerPosition(8)}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ alignSelf: "flex-end", top: verticalScale(5) }}
              onPress={() => deleteFromFormation(8)}
            >
              <Image
                source={require("../../assets/remove.png")}
                style={{ width: moderateScale(15), height: moderateScale(15) }}
              />
            </TouchableOpacity>
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
            onPress={() => checkPlayerPosition(9)}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ alignSelf: "flex-end", top: verticalScale(5) }}
              onPress={() => deleteFromFormation(9)}
            >
              <Image
                source={require("../../assets/remove.png")}
                style={{ width: moderateScale(15), height: moderateScale(15) }}
              />
            </TouchableOpacity>
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
            onPress={() => checkPlayerPosition(10)}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ alignSelf: "flex-end", top: verticalScale(5) }}
              onPress={() => deleteFromFormation(10)}
            >
              <Image
                source={require("../../assets/remove.png")}
                style={{ width: moderateScale(15), height: moderateScale(15) }}
              />
            </TouchableOpacity>
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
              {pagess.map((e, i) => (
                <View key={i} style={styles.page}>
                  <View className="bottom-20 justify-center">
                    <Image
                      source={e.image}
                      style={{ width: 360, height: 280 }}
                    />
                  </View>

                  <Text style={styles.titletext}>{e.text}</Text>

                  <Text style={styles.text2}>{e.text2}</Text>

                  {i === 0 ? (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        navigation.navigate(e.navigate, { index: inde });
                        closeModal();
                      }}
                      className="py-3 self-center w-28 rounded-2xl"
                    >
                      <Text className=" text-center  text-white font-bold">
                        {e.btnText}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        navigation.navigate(e.navigate, { index: inde });
                        closeModal();
                      }}
                      className="py-3 self-center	  w-28 rounded-2xl"
                    >
                      <Text className=" text-center  text-white font-bold">
                        {e.btnText}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Image
                source={require("../../assets/close.png")}
                style={{ width: 25, height: 25 }}
              />
            </TouchableOpacity>
          </View>
        </Modal>

        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate("CoachFormationAdd")}
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
            <Text className="self-center  font-bold">Add player</Text>
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
    flexDirection: "column"

  },
  posstiongk: {
    position: "absolute",
    width: moderateScale(70),
    height: moderateScale(80),
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    bottom: verticalScale(-22),

    flexDirection: "column"
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
    flexDirection: "column"
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
    flexDirection: "column"
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
    flexDirection: "column"
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

    flexDirection: "column"
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
    flexDirection: "column"

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
    flexDirection: "column"

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
    flexDirection: "column"
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
    flexDirection: "column"
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

    flexDirection: "column"
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
