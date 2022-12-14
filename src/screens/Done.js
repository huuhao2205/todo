import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Alert, ImageBackground } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import { setTaskID, setTasks } from '../redux/actions';
import GlobalStyle from '../utils/GlobalStyle';

export default function Done({ navigation }) {

    const { tasks } = useSelector(state => state.taskReducer);
    const dispatch = useDispatch();

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
            {tasks.filter(task => task.Done === true).length == 0 ?
            <View
            style={{
                flex:1,
                justifyContent:'center',
                alignItems:'center',
                backgroundColor:'rgba(0,0,0,.5)'
            }}
            >
            <Text style={{fontSize:20,color:'white'}}>You don't have any completed tasks</Text>
            </View>
            :
            <FlatList
                data={tasks.filter(task => task.Done === true)}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => {
                            dispatch(setTaskID(item.ID));
                            navigation.navigate('Task');
                        }}
                    >
                        <View style={styles.item_row}>
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
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1
    },
    item_row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical:10
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
        paddingHorizontal: 10,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 5,
    },
    title: {
        color: '#000000',
        fontSize: 25,
        margin: 5,
        paddingLeft:10
    },
    subtitle: {
        color: '#999999',
        fontSize: 15,
        margin: 5,
        paddingLeft:10
    },
    imgBackground: {
        width: '100%',
        height: '100%',
        flex: 1
    },
})
