import { AppRegistry } from 'react-native';
import App from './App'; // Adjust if your main component file has a different name or path
import { name as appName } from './app.json'; // Ensure this matches the name in app.json

AppRegistry.registerComponent(appName, () => App);
