import { StyleSheet, ScrollView } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabOneScreen() {
  return (
    <EventContainer/>
  );
}

function EventContainer() {
  const colorScheme = useColorScheme();
  return (
    <View style={styles.eventContainer}>
      <FontAwesome
        name="pencil"
        size={25}
        color={Colors[colorScheme ?? 'light'].text}
        style={{ marginRight: 5, textAlignVertical: 'center', alignItems: "center", textAlign: "center", marginLeft: 15}}
      />
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.eventTitle}>Event Title</Text>
          <Text style={styles.courseName}>Course Name</Text>
          <Text style={styles.eventDueDate}>Due: Nov 13 at 11:59 PM</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  eventContainer: {
    flexDirection: 'row',
    width: '100%',
    alignSelf: "center",
    height: 100,
    // height: "100%",
    marginBottom: 10,
    // padding: 10,
    backgroundColor: 'red',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20
    // height: 'auto' removed
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    // height: 100,
    marginLeft: 10,
    alignSelf: 'stretch',
  },  
  textContainer: {
    // flex: 1,
    height: "100%",
    marginLeft: 10,
    marginTop: 10
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  courseName: {
    fontSize: 15,
  },
  eventDueDate: {
    color: 'gray',
    marginTop: 5,
  },
});
