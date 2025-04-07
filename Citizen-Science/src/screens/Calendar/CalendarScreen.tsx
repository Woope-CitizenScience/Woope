import React, {useState, Fragment, useCallback, useMemo, useRef, useEffect, useContext} from 'react';
import {StyleSheet, View, ScrollView, Text, TouchableOpacity} from 'react-native';
import {Calendar, CalendarUtils} from 'react-native-calendars';
import testIDs from './testIDs';
import { getDates, getFollowedDates } from '../../api/event';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addMonths, getDay, getMonth, getYear, subMonths } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../util/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { AccessToken } from '../../util/token';

const CalendarScreen = () => {
  const navigation = useNavigation<any>();
  
  const { userToken, setUserToken } = useContext(AuthContext);
  const decodedToken = userToken ? jwtDecode<AccessToken>(userToken) : null;
  const userId = decodedToken ? decodedToken.user_id : NaN;
  const [isLoading, setIsLoading] =useState(false);
  const [selectedValue, setSelectedValue] = useState(new Date());
  const [generalMarks, setGeneralMarks] = useState([]);
  const [followedMarks, setFollowedMarks] = useState([]);
  
  // gets 
  useEffect(()=> {
    getGeneralMarks().then(
     () => createMarks()
    )
    getFollowedMarks()
  },[selectedValue])

  // creates event dots
  const createMarks = () => {
    let customDates = {};
    generalMarks.forEach(item => console.log(item));
    console.log(customDates)
    console.log(generalMarks);
    console.log("test")
  }

  // Navigates to day selected to display all events
  const onDayPress = useCallback((day) => {
    console.log(day);
    console.log(day.month)
    navigation.navigate("DateScreen", {
        dayNum: day.day,
        month: day.month,
        year: day.year,
        id: userId
    })
  }, []);

  // Calendar Render
  const renderCalendarWithSelectableDate = () => {
    return (
      <Fragment>
        <Calendar
          enableSwipeMonths
          displayLoadingIndicator = {isLoading}
          current={selectedValue.toDateString()}
          style={styles.calendar}
          onDayPress={onDayPress}
          onPressArrowLeft={subtractMonth => {
            setSelectedValue(subMonths(selectedValue, 1));
            subtractMonth();
          }}
          onPressArrowRight={addMonth => {
            setSelectedValue(addMonths(selectedValue, 1));
            addMonth();
          }}
          markingType={'multi-dot'}
          markedDates={{'2025-04-01' : {marked: true, dots: [{
            color: 'red',
            selectedDotColor: 'blue'}]}}}
        />
      </Fragment>
    );
  };

  // gets all days that have events
  const getGeneralMarks = async() => {
    try {
      let response = await getDates(selectedValue.getMonth() + 1, selectedValue.getFullYear());
      setGeneralMarks(response);
    } catch (error) {
        console.log(error);
    }
  }

  // gets all days with events that are FOLLOWED by USER
  const getFollowedMarks= async() => {
    try {
      let fmarks = await getFollowedDates(selectedValue.getMonth() + 1, selectedValue.getFullYear(), userId);
      setFollowedMarks(fmarks);
    } catch (error) {
      console.log(error);
    }
  }

  // Renders the calendar
  const renderExamples = () => {
    return (
      <Fragment>
        {renderCalendarWithSelectableDate()}
      </Fragment>
    );
  };

  return (
    <SafeAreaView>
      {renderExamples()}
    </SafeAreaView>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  calendar: {
    

  },
  switchContainer: {
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center'
  },
  switchText: {
    margin: 10,
    fontSize: 16
  },
  text: {
    textAlign: 'center',
    padding: 10,
    backgroundColor: 'lightgrey',
    fontSize: 16
  },
  disabledText: {
    color: 'grey'
  },
  defaultText: {
    color: 'purple'
  },
});
