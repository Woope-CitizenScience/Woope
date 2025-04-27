import React, {useState, Fragment, useCallback, useMemo, useRef, useEffect, useContext} from 'react';
import {StyleSheet, View, ScrollView, Text, TouchableOpacity, Button, Dimensions} from 'react-native';
import {Calendar, CalendarUtils} from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import testIDs from './testIDs';
import { getDates, getFollowedDates, getUserDates } from '../../api/event';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addMonths, DateArg, getDay, getMonth, getYear, subMonths, fromUnixTime, addDays} from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../util/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { AccessToken } from '../../util/token';
import CreateUserEvent from '../../components/CreateUserEvent';

interface Arguments {
  marked: boolean;
  dots: {
    color: string;
    selectedDotColor: string;
  };
}
interface Marks {
  to_char: string;
  time_begin: string;
}

const CalendarScreen = () => {
  const navigation = useNavigation<any>();
  const { userToken, setUserToken } = useContext(AuthContext);
  const decodedToken = userToken ? jwtDecode<AccessToken>(userToken) : null;
  const userId = decodedToken ? decodedToken.user_id : NaN;
  const [isLoading, setIsLoading] =useState(false);
  const [selectedValue, setSelectedValue] = useState(new Date());
  let [generalMarks, setGeneralMarks] = useState<Marks[]>([]);
  let [followedMarks, setFollowedMarks] = useState<Marks[]>([]);
  let [userMarks, setUserMarks] = useState<Marks[]>([]);
  let [items, setItems] = useState<string[]>([]);
  let [followedItems, setFollowedItems] = useState<string[]>([]);
  let [marks, setMarks] = useState<any>({});
  const generalColor = {color:'blue'};
  const followedColor = {color: 'red'};
  const userColor = {color: 'lightgreen'};
  const [modalVisible, setModalVisible] = useState(false);
   
  // gets all dates with marks/types of marks and once all promises are successful
  // creates the marks and applies them to the calendar
  useFocusEffect(
    React.useCallback(() => {
      Promise.all([getGeneralMarks(), getFollowedMarks(), getUserMarks()]).then((values) => {
        createMarks();
      })
    },[selectedValue, modalVisible])
  )

// creates the marks object to send to the calendar
  const createMarks = () => {
    // Marks all dates with any organization date first
    generalMarks.forEach((element) => {
      let day = new Date(element.time_begin).toLocaleDateString("sv-SE")
      marks[day] = {marked:true, dots:[generalColor]}
    });
    // adds a dot for personal/user events
    followedMarks.forEach((element) => {
      let day = new Date(element.time_begin).toLocaleDateString("sv-SE")
      if(marks[day].dots.some(({color}) => color == 'red')){
    
      }
      else{ 
        marks[day].dots.push(followedColor)
      }
    });
    //adds a dot for events that are followed
    userMarks.forEach((element) => {
      let day = new Date(element.time_begin).toLocaleDateString("sv-SE")
      if(!marks[day]){
        marks[day] = {marked:true, dots:[userColor]}
      }
      else if(marks[day].dots.some(({color}) => color == 'lightgreen')){
        
      }
      else{ 
        marks[day].dots.push(userColor)
      }
    });
  }
  // Navigates to day selected to display all events
  const onDayPress = useCallback((day) => {
    navigation.navigate("DateScreen", {
        id: userId,
        dateString: day.dateString,
        dayNum: day.day,
        month: day.month,
        year: day.year
    })
  }, []);

  // gets all days that have events
  const getGeneralMarks = async() => {
    try {
      generalMarks = await getDates(selectedValue.getMonth() + 1, selectedValue.getFullYear());
      setGeneralMarks(generalMarks);
    } catch (error) {
        console.log(error);
    }
  }

  // gets all days with events that are FOLLOWED by USER
  const getFollowedMarks = async() => {
    try {
      followedMarks = await getFollowedDates(selectedValue.getMonth() + 1, selectedValue.getFullYear(), userId);
      setFollowedMarks(followedMarks);
    } catch (error) {
      console.log(error);
    }
  }
  // gets all events that are private/user created
  const getUserMarks = async() => {
    try {
      userMarks = await getUserDates(selectedValue.getMonth() + 1, selectedValue.getFullYear(), userId);
      setUserMarks(userMarks);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaView>
      <View style={styles.container}> 
        <View style={styles.calendarContainer}>
            <Calendar
                enableSwipeMonths
                displayLoadingIndicator = {isLoading}
                current={selectedValue.toDateString()}
                style={styles.calendar}
                onDayPress={onDayPress}
                onPressArrowLeft={subtractMonth => {
                  setSelectedValue(subMonths(selectedValue, 1));
                  setItems([])
                  subtractMonth();
                }}
                onPressArrowRight={addMonth => {
                  setSelectedValue(addMonths(selectedValue, 1));
                  setItems([]);
                  addMonth();
                }}
                markingType={'multi-dot'}
                markedDates={marks}
              />
          </View>
        <TouchableOpacity style={styles.postBox} onPress={() => setModalVisible(true)}>
          <View style={styles.postBoxInner}>
            <Text style={styles.postBoxText}>
                  Create Personal Event
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <CreateUserEvent user_id={userId} isVisible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
};

export default CalendarScreen;
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    height: screenHeight,
    width: screenWidth,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  calendarContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: 'white'
  },
  calendar: {
  },
  buttonContainer: {
    padding: 10,
    borderRadius: 20,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  directoryButton: {
    borderRadius: 10,
    padding: 14,
    marginVertical: 7,
    marginHorizontal: 15,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: {
        width: 1,
        height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 9,
  },
  postBox: {
    backgroundColor: "#B4D7EE",
    borderRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    marginHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E7F3FD",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    marginTop: 6,
},
postBoxInner: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
    alignSelf: "stretch",
    borderBottomWidth: 1,
    borderBottomColor: "#D1E3FA",
},
postBoxText: {
    fontSize: 16,
    color: "#333",
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    textAlign: "center",
}
});
