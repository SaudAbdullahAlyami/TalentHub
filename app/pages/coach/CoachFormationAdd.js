import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity,  StyleSheet, ScrollView, 
Alert} from "react-native";
import { Searchbar } from 'react-native-paper';
import { Avatar } from "react-native-paper";
import { doc, collection, getDocs, addDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../../component/config/config";

export const CoachFormationAdd = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadData = async () => {
    getDocs(collection(db, "users")).then((docSnap) => {
      let items = [];
      docSnap.forEach((doc) => {
        const dataa = doc.data();
        if (dataa.role == "Player") {
          if (dataa.clubName == "") items.push({ ...doc.data(), id: doc.id });
        }
      });
      setData(items);
      setFilteredPlayers(items); // Initialize filteredPlayers with all players
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = data.filter((player) =>
      player.fullName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPlayers(filtered); // Update filteredPlayers with filtered players
  };

  const invitePlayer = async (playerUid) => {
    try {
      if (playerUid == null) {
        console.log("Player uid == null");
      }
      const coachDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const fullName = coachDoc.data().fullName;
      const imageURL = coachDoc.data().profileImage;
      const clubName = coachDoc.data().clubName
      // Create an invitation in Firestore
      const invitationRef = collection(db, "invitations");
      const newInvitationDoc = await addDoc(invitationRef, {
        senderUid: auth.currentUser.uid,
        senderName: fullName,
        senderImage: imageURL,
        senderClub:  clubName,

        receiverUid: playerUid,
        status: "Pending",

        // Add any additional details you want to include in the invitation
      });

      // Notify the player about the invitation
      // You can use FCM or another notification method here

      // Optional: Update UI or provide feedback to the coach
      console.log("Invitation sent successfully!");
      Alert.alert("Successfully ","The Invite Request has send successfully.")
    } catch (error) {
      console.error("Error sending invitation:", error);
    }
  };


  const renderPlayers = (players, title, navigation) => {
    return (
      <View >
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#00B365", padding: 20 }}>{title}</Text>
        {players.map((item) => {
          return (
            <View style={styles.pico} key={item.uid}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("CoachFormationstack", {
                    screen: "CoachVisitProfile",
                    params: { itemId: item.uid },
                  })
                }
              >
                <Avatar.Image
                  size={70}
                  source={{ uri: item.profileImage }}
                />
              </TouchableOpacity>
              <View>
                <Text className="font-bold top-5" style={styles.text1}> {item.fullName}</Text>
                <Text className="top-5" style={styles.text2}>{item.position}</Text>
                <TouchableOpacity style={styles.button1} className="py-3  self-end	 right-2  w-28 rounded-xl"
                  onPress={() => invitePlayer(item.id)}
                >
                  <Text className="text-center text-white">Invite</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const groupedPlayers = {
    Goalkeepers: filteredPlayers.filter((item) => item.position === "GK"),
    Defenders: filteredPlayers.filter(
      (item) =>
        item.position === "RB" ||
        item.position === "LB" ||
        item.position === "CB"
    ),
    Midfielders: filteredPlayers.filter((item) => item.position === "CM"),
    Forwards: filteredPlayers.filter(
      (item) =>
        item.position === "LW" || item.position === "RW" || item.position === "ST"
    ),
  };

  return (
    <View className="flex-1 " style={{ backgroundColor: "white"}}>

      <View style={styles.bg}>
      <Searchbar className="w-80 self-center top-7"
          placeholder="Search players..."
          onChangeText={handleSearch}
          value={searchQuery}
        />

      </View>
      <View style={{ backgroundColor: "white", paddingBottom: 10,flex:1  }}>
    
        <ScrollView>
          {Object.keys(groupedPlayers).map((title) =>
            renderPlayers(groupedPlayers[title], title, navigation)
          )}
          
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: "2%",
  },
  position: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: "2%",
  },
  pico: {
    paddingLeft: 18,
    borderBottomColor: "ddd",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    padding: 17
  },
  text1: {
    fontSize: 18,
    left: 15,
  },
  text2: {
    fontSize: 14,
    left: 20,
  },
  button1: {
    left: 180,
    backgroundColor: "#00b365",
    bottom: 20
  },
  hi: {
    marginLeft: 10,
  },bg:{

    backgroundColor: "#00b365",
    padding:50



  }
});

export default CoachFormationAdd;
