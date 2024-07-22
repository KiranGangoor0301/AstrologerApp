import auth from '@react-native-firebase/auth';

// Function to send OTP
export const sendOTP = async (phoneNumber) => {
  try {
    const formattedPhoneNumber = phoneNumber.startsWith('+91') ? phoneNumber : '+91' + phoneNumber;
    const confirmation = await auth().signInWithPhoneNumber(formattedPhoneNumber);
    return confirmation.verificationId;
  } catch (error) {
    throw new Error('Error sending OTP: ' + error.message);
  }
};

// Function to verify OTP
export const verifyOTP = async (verificationId, verificationCode) => {
  try {
    const credential = auth.PhoneAuthProvider.credential(verificationId, verificationCode);
    await auth().signInWithCredential(credential);
    return true;
  } catch (error) {
    throw new Error('Error verifying OTP: ' + error.message);
  }
};
