import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
} from "react-native";
import { Avatar } from "react-native-paper";

import {  collection, getDocs,   } from "firebase/firestore";

import { db, } from "../../component/config/config";

export const ScoutListOfTournaments = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadData = async () => {
    getDocs(collection(db, "tournament")).then((docSnap) => {
      let items = [];
      docSnap.forEach((doc) => {
        const dataa = doc.data();

        items.push({ ...doc.data(), id: doc.id });
      });
      setData(items);
      setFilteredData(items);
    });
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const [filteredData, setFilteredData] = useState(data);

  const render = ({ item }) => {
    return (
      <View style={styles.hi}>
        {/* NEW navigate through stack (: */}

        <View style={styles.pico}>
          
            <Avatar.Image
              backgroundColor="grey"
              size={75}
              source={{ uri: item.tournamentImage }}
            />
       
        </View>

        <Text style={styles.text1} className="font-bold  ">
          {item.tournamentName}
        </Text>
        <Text style={styles.text2} className="mb-3 font-bold top-3 ">
          Location:{item.city}
        </Text>

        <Text style={styles.text2} className="mb-3 font-bold top-3 ">
        Description:{item.description}
        </Text>

        <View className="self-center text-center items-center ">
          <View
            style={{ flexDirection: "row", alignSelf: "center", marginTop: 15 }}
          >
            <View style={styles.colu}>
              <Text
                style={styles.roundtitle}
                className=" Self-center items-center text-center rounded-3xl "
              >
                Start Date
              </Text>
              <Text
                style={styles.text3}
                className=" self-center items-center text-center font-bold"
              >
                {item.startDate}

                {/* {item.startDate.toLocaleString()} */}
              </Text>
            </View>
            <View style={styles.colu}>
              <Text
                style={styles.roundtitle}
                className=" Self-center items-center text-center rounded-3xl"
              >
                End Date
              </Text>
              <Text
                style={styles.text3}
                className=" self-center items-center text-center font-bold"
              >
                {item.endDate}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <View style={styles.colu}>
              <Text
                style={styles.roundtitle}
                className=" Self-center items-center text-center rounded-3xl"
              >
                Teams
              </Text>
              <Text
                style={styles.text3}
                className=" self-center items-center text-center font-bold"
              >
                {item.teamsArrayIndex} /16
              </Text>
            </View>

            <View style={styles.colu}>
              <Text
                style={styles.roundtitle}
                className=" Self-center items-center text-center rounded-3xl"
              >
                Prize:
              </Text>
              <Text
                style={styles.text3}
                className=" self-center items-center text-center font-bold"
              >
                {item.prize}SAR
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.button1}>


            
          <TouchableOpacity
           onPress={() => {
            navigation.navigate("ScoutTournamentStack", {
              screen: "ScoutSeeTheTournament",
              params: { itemId: item.tournamentOwnerUid },
            });
          }}
          
            className="bg-yellow-400  py-3 	 w-28 rounded-xl"
          >
            <Text className=" text-center ">See The Tournament</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: "#00B365" }}>
      <View className="flex-row justify-center top-10">
        <Image
          source={require("../../assets/tourna.png")}
          style={{ width: 380, height: 150 }}
        />
      </View>

      <View
        style={{ backgroundColor: "white", paddingBottom: 10 }}
        className="flex-1 bg-white top-16"
      >
        <FlatList
          data={filteredData}
          renderItem={render}
          keyExtractor={(item) => item.tournamentName}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />

        <View className="bg-white my-7"></View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  pico: {
    top: 32,
    paddingLeft: 18,
  },
  text1: {
    fontSize: 19,
    left: 103,
    bottom: 30,
  },
  text2: {
    fontSize: 16,
    marginBottom: 15,
    marginTop: 5,
    lineHeight: 25,
  },
  text3: {
    fontSize: 14,
    marginBottom: 15,
    marginTop: 5,
    lineHeight: 25,
  },
  button1: {
    position: "absolute",
    top: 30, // Adjust the top position as needed
    right: 10, // Adjust the right position as needed

    padding: 10,
    borderRadius: 5,
  },
  hi: {
    borderBottomColor: "ddd",
    borderBottomWidth: StyleSheet.hairlineWidth,

    marginLeft: 10,
  },
  searchBar: {
    top: 60,
    width: 300,
  },
  roundtitle: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    padding: 10,
    backgroundColor: "#00B365",
    width: 120,
    marginHorizontal: 14,
    textAlign: "center",
  },
  colu: {
    flexDirection: "column",
  },
});
