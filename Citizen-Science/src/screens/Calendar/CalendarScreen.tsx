import React, {useState, Fragment, useCallback, useMemo, useRef, useEffect, useContext} from 'react';
import {StyleSheet, View, ScrollView, Text, TouchableOpacity} from 'react-native';
import {Calendar, CalendarUtils} from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import testIDs from './testIDs';
import { getDates, getFollowedDates } from '../../api/event';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addMonths, DateArg, getDay, getMonth, getYear, subMonths} from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../util/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { AccessToken } from '../../util/token';

interface Arguments {
  marked: boolean;
  dots: {
    color: string;
    selectedDotColor: string;
  };
}
interface Marks {
  to_char: string;
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
  let [items, setItems] = useState<string[]>([]);
  let [followedItems, setFollowedItems] = useState<string[]>([])
  let [marks, setMarks] = useState<any>({})
  const generalColor = {key: 'general', color:'blue'};
  const followedColor = {key: 'followed', color: 'orange'};
  // gets 
  useFocusEffect(
    React.useCallback(() => {
      getGeneralMarks().then(
        () => getFollowedMarks()
      )
    },[selectedValue])
  )


  // creates event dots
  const createMarks = () => {
    generalMarks.forEach((element) => 
      marks[element.to_char] = {marked:true, dots:[generalColor]}
    );
  }
  const createFollowedMarks = () => {
    followedMarks.forEach((element) => 
      marks[element.to_char] = {marked:true, dots:[generalColor, followedColor]}
    );
  }
  // Navigates to day selected to display all events
  const onDayPress = useCallback((day) => {
    navigation.navigate("DateScreen", {
        dayNum: day.day,
        month: day.month,
        year: day.year,
        id: userId
    })
  }, []);

  // gets all days that have events
  const getGeneralMarks = async() => {
    try {
      generalMarks = await getDates(selectedValue.getMonth() + 1, selectedValue.getFullYear());
    } catch (error) {
        console.log(error);
    }
    createMarks();
  }

  // gets all days with events that are FOLLOWED by USER
  const getFollowedMarks = async() => {
    try {
      followedMarks = await getFollowedDates(selectedValue.getMonth() + 1, selectedValue.getFullYear(), userId);
      setFollowedMarks(followedMarks)
    } catch (error) {
      console.log(error);
    }
    createFollowedMarks();
  }

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
      </Fragment>
    );
  };

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
