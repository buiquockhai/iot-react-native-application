import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Home from './home';
import SignUp from './signUp';
import ManageAccount from './manageAccount';
import AddRoom from './addRoom';
import ManageDevice from './manageDevice';
import AddDeviceRoom from './addDeviceRoom';
import ManagementView from './managements';
import scheduled from './schedule';


const Navigation = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            headerShown: false,
        },
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: {
            headerShown: false,
        },
    },
    ManageAccount: {
        screen: ManageAccount,
        navigationOptions: {
            headerShown: false,
        },
    },
    AddRoom: {
        screen: AddRoom,
        navigationOptions: {
            headerShown: false,
        },
    },
    ManageDevice: {
        screen: ManageDevice,
        navigationOptions: {
            headerShown: false,
        },
    },
    AddDeviceRoom: {
        screen: AddDeviceRoom,
        navigationOptions: {
            headerShown: false,
        },
    },
    ManagementView: {
        screen: ManagementView,
        navigationOptions: {
            headerShown: false,
        },
    },
    scheduled: {
        screen: scheduled,
        navigationOptions: {
            headerShown: false,
        },
    },
});

export default createAppContainer(Navigation);