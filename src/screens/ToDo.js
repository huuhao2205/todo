import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import React, { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Alert, ImageBackground } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import { setTaskID, setTasks } from '../redux/actions';
import GlobalStyle from '../utils/GlobalStyle';

export default function ToDo({ navigation }) {

    const { tasks } = useSelector(state => state.taskReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        getTasks();
    }, [])

    const getTasks = () => {
        AsyncStorage.getItem('Tasks')
            .then(tasks => {
                const parsedTasks = JSON.parse(tasks);
                if (parsedTasks && typeof parsedTasks === 'object') {
                    dispatch(setTasks(parsedTasks));
                }
            })
            .catch(err => console.log(err))
    }

    const deleteTask = (id) => {
        const filteredTasks = tasks.filter(task => task.ID !== id);
        AsyncStorage.setItem('Tasks', JSON.stringify(filteredTasks))
            .then(() => {
                dispatch(setTasks(filteredTasks));
                Alert.alert('Success!', 'Task removed successfully.');
            })
            .catch(err => console.log(err))
    }

    const checkTask = (id, newValue) => {
        const index = tasks.findIndex(task => task.ID === id);
        if (index > -1) {
            let newTasks = [...tasks];
            newTasks[index].Done = newValue;
            AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
                .then(() => {
                    dispatch(setTasks(newTasks));
                    Alert.alert('Success!', 'Task state is changed.');
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <ImageBackground
            source={require('../../assets/images/bg.png')}
            style={styles.imgBackground}
            resizeMode='cover'>
            {tasks.filter(task => task.Done === false).length == 0 ?
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,.5)'
                    }}
                >
                    <Text style={{ fontSize: 20, color: 'white' }}>You haven't added any tasks yet</Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('Tutorial')
                        }
                        style={styles.btn}>
                        <Text style={styles.textbtn}>Tutorial</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => {
                            dispatch(setTaskID(tasks.length + 1));
                            navigation.navigate('Task');
                        }}
                    >
                        <Text style={styles.textbtn}>Add New Task</Text>
                    </TouchableOpacity>
                </View>
                :
                <FlatList
                    data={tasks.filter(task => task.Done === false)}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.item}
                            onPress={(e) => {
                                e.preventDefault();
                                dispatch(setTaskID(item.ID));
                                navigation.navigate('Task');
                            }}
                        >
                            <View style={styles.item_row}>
                                <View
                                    style={[
                                        {
                                            backgroundColor:
                                                item.Color === 'red' ? '#f28b82' :
                                                    item.Color === 'blue' ? '#aecbfa' :
                                                        item.Color === 'green' ? '#ccff90' : '#ffffff'
                                        },
                                        styles.color]}
                                />
                                {/* <CheckBox
                                    value={item.Done}
                                    onValueChange={(newValue) => { checkTask(item.ID, newValue) }}
                                /> */}
                                <View style={styles.item_body}>
                                    <Text
                                        style={[
                                            GlobalStyle.CustomFontHW,
                                            styles.title
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {item.Title}
                                    </Text>
                                    <Text
                                        style={[
                                            GlobalStyle.CustomFontHW,
                                            styles.subtitle
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {item.Desc}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.delete}
                                    onPress={() => { deleteTask(item.ID) }}
                                >
                                    <FontAwesome5
                                        name={'trash'}
                                        size={25}
                                        color={'#ff3636'}
                                    />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            }
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    dispatch(setTaskID(tasks.length + 1));
                    navigation.navigate('Task');
                }}
            >
                <FontAwesome5
                    name={'plus'}
                    size={20}
                    color={'#ffffff'}
                />
            </TouchableOpacity>
        </ImageBackground >
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1
    },
    textbtn: {
        fontWeight: 'bold',
    },
    btn: {
        elevation: 8,
        backgroundColor: "#0080ff",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginTop: 10,
        width: 200,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#0080ff',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        right: 10,
        elevation: 5,
    },
    imgBackground: {
        width: '100%',
        height: '100%',
        flex: 1
    },
    item_row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    item_body: {
        flex: 1,
    },
    delete: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        marginHorizontal: 10,
        marginVertical: 7,
        paddingRight: 10,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 5,
    },
    title: {
        color: '#000000',
        fontSize: 25,
        margin: 5,
        paddingLeft: 10
    },
    subtitle: {
        color: '#999999',
        fontSize: 15,
        margin: 5,
        paddingLeft: 10
    },
    color: {
        width: 20,
        height: 100,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    }
})
