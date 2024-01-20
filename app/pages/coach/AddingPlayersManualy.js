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
    RefreshControl, ImageBackground
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

export const AddingPlayersManualy = ({ route, navigation }) => {
    const [members, setMembers] = useState([]);
    const [clubName, setclubName] = useState("");

    const { index } = route.params
    console.log("the", index)


    useEffect(() => {
        fetchData();
        // Clean up the subscription when the component unmounts
        return () => {
            /* Cleanup logic if needed */
        };
    }, []);

    const fetchData = async () => {
        try {
            const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
            const userClubName = userDoc.data().clubName;

            if (userClubName) {
                const clubDoc = await getDoc(doc(db, "clubs", userClubName));
                setMembers(clubDoc.data().members);
            } else {
                console.error("User has no clubName.");
            }
        } catch (error) {
            console.log("Error fetching data:", error);
        }
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

    // ==========================================Working hereee====================================================

    const addmanualy = async (playerUid, index) => {
        const playerRef = doc(db, "users", playerUid);
        const playerDoc = await getDoc(playerRef);
        
        if (!playerDoc.exists()) {
            console.log("Player document does not exist!");
            return;
        }
        
        const clubName = playerDoc.data().clubName;
        const clubRef = doc(db, "clubs", clubName);
        const clubDoc = await getDoc(clubRef);
    
        let currentFormation = clubDoc.data()?.formation || [];
    
        if (currentFormation.length >= index + 1) {
            // Update existing array at the specified index
            currentFormation[index] = {
                fullName: playerDoc.data()?.fullName || "",
                position: playerDoc.data()?.position || "",
                uid: playerDoc.data()?.uid || "",
                // t3deelll s3oooooooooooooodddddddddddddddd
                goals:playerDoc.data().goals,
                assist:playerDoc.data().assist,
                rating:playerDoc.data().rating,
                saves:playerDoc.data().saves,
                clearances:playerDoc.data().clearances,
                tackles:playerDoc.data().tackles,
                crosses :playerDoc.data().crosses,
                passes:playerDoc.data().passes,
                shotsOnTarget:playerDoc.data().shotsOnTarget,
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
                position: playerDoc.data()?.position || "",
                uid: playerDoc.data()?.uid || "",
                // t3deelll s3oooooooooooooodddddddddddddddd
                goals:playerDoc.data().goals,
                assist:playerDoc.data().assist,
                rating:playerDoc.data().rating,
                saves:playerDoc.data().saves,
                clearances:playerDoc.data().clearances,
                tackles:playerDoc.data().tackles,
                crosses :playerDoc.data().crosses,
                passes:playerDoc.data().passes,
                shotsOnTarget:playerDoc.data().shotsOnTarget,
            };
        }
    
        await updateDoc(clubRef, {
            formation: currentFormation,
            
        });
    
        console.log("Member added to the formation array!!");
    };
    
    
    



    const [isRefreshing, setIsRefreshing] = useState(false);
    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        await fetchData();
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

                    <TouchableOpacity onPress={() => addmanualy(item.uid, index)}>
                        <Text className="font-bold bottom-6 text-gre self-center">add manualy</Text>
                    </TouchableOpacity>
                </ImageBackground>
            </View>
        );
    };
    return (
        <View className="flex-1" style={{ backgroundColor: "#00B365" }}>

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
    },
});
