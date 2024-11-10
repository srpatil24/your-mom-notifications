import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

let sampleEventsJson = [
  {
    "assignment": {
      "name": "Math Homework 1",
      "due_at": "2024-11-15T23:59:00Z"
    },
    "context_name": "Math 101"
  },
  {
    "assignment": {
      "name": "Physics Lab Report",
      "due_at": "2024-11-18T17:00:00Z"
    },
    "context_name": "Physics 201"
  },
  {
    "assignment": {
      "name": "History Essay",
      "due_at": "2024-11-20T23:59:00Z"
    },
    "context_name": "History 101"
  },
  {
    "assignment": {
      "name": "Chemistry Quiz",
      "due_at": "2024-11-22T10:30:00Z"
    },
    "context_name": "Chemistry 105"
  },
  {
    "assignment": {
      "name": "Computer Science Project",
      "due_at": "2024-11-25T12:00:00Z"
    },
    "context_name": "CS 101"
  }
]

interface Event {
  assignment: {
    name: string;
    due_at: string;
  };
  context_name: string;
  html_url?: string;
}

export default function TabOneScreen() {
  return (
    <View>
      {sampleEventsJson.map((event: Event) => (
        <TouchableOpacity key={event.assignment.name}>
          <EventContainer event={event} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

// defines container for each event for display
function EventContainer({ event }: { event: any }) {
  const colorScheme = useColorScheme();
  return (
    <View>
      <View style={{}}>

      </View>
      <View style={styles.eventContainer}>
        <FontAwesome
          name="pencil"
          size={25}
          color={Colors[colorScheme ?? 'light'].text}
          style={{ marginRight: 5, textAlignVertical: 'center', alignItems: "center", textAlign: "center", marginLeft: 15 }}
        />
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.eventTitle}>{event.assignment.name}</Text>
            <Text style={styles.courseName}>{event.context_name}</Text>
            <Text style={styles.eventDueDate}>Due: {event.assignment.due_at}</Text>
          </View>
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
