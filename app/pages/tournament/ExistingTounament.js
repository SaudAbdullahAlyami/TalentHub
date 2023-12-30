import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { setDoc,doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../component/config/config';

export const ExistingTournament = ({ navigation }) => {
  const [teams, setTeams] = useState([]);
  const [matchups, setMatchups] = useState([]);

  useEffect(() => {
    fetchData();

    // Clean up the subscription when the component unmounts
    return () => {
      /* Cleanup logic if needed */
    };
  }, []);

  const fetchData = async () => {
    try {
      const tournamentOrganizerRef = doc(db, 'users', auth.currentUser.uid);
      const organizerDoc = await getDoc(tournamentOrganizerRef);
  
      if (organizerDoc.exists()) {
        const tournamentName = organizerDoc.data().tournamentName;
  
        if (tournamentName) {
          const tournamentRef = doc(db, 'tournament', tournamentName);
          const tournamentDoc = await getDoc(tournamentRef);
  
          if (tournamentDoc.exists()) {
            const tournamentData = tournamentDoc.data();
  
            if (tournamentData && tournamentData.matchs) {
              if (teams.length==0) {
                setTeams(tournamentData.teams);
                console.log('Updated team from database');
              }
              setMatchups(tournamentData.matchs);
              console.log('Matchups updated in real-time');
            } else {
              setTeams(tournamentData.teams);
              console.log('Tournament document does not contain matchs');
            }
          } else {
            console.log('Tournament document does not exist');
          }
        } else {
          console.log('Tournament name is not available in organizer document');
        }
      } else {
        console.log('Tournament organizer document does not exist');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  

    
  const generateMatchups = async () => {
    try {
      const shuffledTeams = shuffleArray([...teams]);
  
      const generatedMatchups = [];
      var matchIndex=0;
      for (let i = 0; i < shuffledTeams.length; i += 2) {
        const team1 = shuffledTeams[i];
        const team2 = shuffledTeams[i + 1];
        generatedMatchups.push({ team1, team2 ,matchIndex:matchIndex ,whoWin:""});
        matchIndex++;
      }
  
      setMatchups(generatedMatchups)
     
          const tournamentOrganizerDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          const tournamentRef = doc(db, 'tournament', tournamentOrganizerDoc.data().tournamentName);
  
          await updateDoc(tournamentRef, {
            matchs: generatedMatchups,
          });
          
          console.log('Matchups updated in the tournament document');
     
          
     
    } catch (error) {
      console.error('Error generating matchups:', error);
    }
  };
  

 

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleMatchButtonClick = (matchup) => {
    // Navigate to a new page with the selected matchup
    navigation.navigate('TournamentOrgRating', { team1: matchup.team1, team2: matchup.team2 , matchIndex:matchup.matchIndex });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tournament Bracket</Text>
      {matchups.map((matchup, index) => (
        <View key={index} style={styles.matchupContainer}>
          <Text style={styles.matchupText}>
            {matchup.team1.name} vs {matchup.team2.name}
          </Text>
          <Button title="View Details" onPress={() => handleMatchButtonClick(matchup)} />
          <Text>  Winner is :{matchup.whoWin}</Text>

        </View>
      ))}
      <Button title="Start with randomize" onPress={() =>generateMatchups()} />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  matchupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  matchupText: {
    fontSize: 16,
    marginRight: 8,
  },
});
