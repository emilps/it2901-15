import React, { Component } from 'react';
import { connect } from 'react-redux';
import t from 'tcomb-form-native';
import Timepicker from 'react-native-modal-datetime-picker';
import { Notifications, Permissions, Constants } from 'expo';
import { StyleSheet, Text, View, Button, TouchableOpacity, Dimensions } from 'react-native';
import { reduxForm } from 'redux-form';
import { showModal, hideModal, postFuelDay } from '../../actions/fuelDay';

const width = Dimensions.get('window').width;

t.form.Form.stylesheet.formGroup.normal.width = width / 1.3;
t.form.Form.stylesheet.select.normal.color = 'white';
t.form.Form.stylesheet.select.normal.borderWidth = 1;
t.form.Form.stylesheet.select.normal.color = 'black';
t.form.Form.stylesheet.select.normal.backgroundColor = 'white';
t.form.Form.stylesheet.select.marginBottom = 50;
t.form.Form.stylesheet.select.normal.borderRadius = 10;
t.form.Form.stylesheet.pickerContainer.normal.borderColor = 'black';
t.form.Form.stylesheet.pickerContainer.normal.borderRadius = 10;
t.form.Form.stylesheet.pickerTouchable.normal.borderRadius = 10;
t.form.Form.stylesheet.textboxView.normal.borderWidth = 10;

class FuelDayForm extends Component {
  async componentDidMount() {
    const result = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (Constants.isDevice && result.status === 'granted') {
      // console.log('Notification permissions granted.');
    }
    Notifications.addListener(this.handleNotification);
  }
  componentDidUpdate() {
    this.stopDelayedNotification();
    console.log('Check status: ');
    if (this.props.user.FuelNotification === true) {
      console.log(this.props.user.FuelNotification);
      console.log('FuelNotification is on');
      this.sendDelayedNotification();
    } else {
      console.log('Hopefully false', this.props.user.FuelNotification);
    }
  }

  // Private methods
  handleNotification = ({ origin, data }) => {
    console.info(`Notification (${origin}) with data: ${JSON.stringify(data)}`);
  };

  // showTimePicker = () =>
  /*
    sendImmediateNotification = () => {
     const localNotification = {
       title: 'Superdupertestingnotification',
       body: 'Trykk på meg for å åpne den beste appen på den beste siden',
       data: { type: 'immediate' },
     };

     // console.log('Scheduling immediate notification:', { localNotification });

     Notifications.presentLocalNotificationAsync(localNotification);
     // .then(id => console.info(`Immediate notification scheduled (${id})`))
     // .catch(err => console.error(err));
    };
    */
  sendDelayedNotification = () => {
    const localNotification = {
      title: 'Delayed testing Title',
      body: 'Testing body',
      data: { type: 'delayed' },
    };
    const dayToSet = this.props.user.FuelDay;
    const date = new Date();
    let currentDay = date.getDay();
    if (currentDay === 0) {
      currentDay = 6;
    } else {
      currentDay -= 1;
    }
    const distance = ((dayToSet + 7) - currentDay) % 7;
    date.setDate(date.getDate() + distance);
    const notificationHour = this.props.user.FuelTime.substring(0, this.props.user.FuelTime.indexOf('-'));
    const notificationMinute = this.props.user.FuelTime.substring(this.props.user.FuelTime.indexOf('-') + 1, this.props.user.FuelTime.length);
    date.setHours(parseInt(notificationHour, 10), parseInt(notificationMinute, 10), 0, 0);
    const schedulingOptions = {
      time: date,
      repeat: 'week',
    };


    // console.log('Scheduling delayed notification:', { localNotification, schedulingOptions });

    Notifications.scheduleLocalNotificationAsync(localNotification, schedulingOptions);
    // .then(id => console.info(`Delayed notification scheduled (${id}) at ${moment(schedulingOptions.time).format()}`))
    // .catch(err => console.error(err));
  };

  stopDelayedNotification = () => {
    Notifications.cancelAllScheduledNotificationsAsync();
  };

  render() {
    const { hideModal, showModal, isShowing, user } = this.props;
    const Days = t.enums({
      0: 'Mandag',
      1: 'Tirsdag',
      2: 'Onsdag',
      3: 'Torsdag',
      4: 'Fredag',
      5: 'Lørdag',
      6: 'Søndag',
    });


    const FuelDay = t.struct({
      Day: Days,
      Notification: t.Boolean,
    });
    // const Item = Picker.Item;
    /*
    const postToggle = (value) => {
      this.props.postFuelDay(user.FuelDay, value);
    };

    const postWeekday = (value) => {
      this.props.postFuelDay(value, user.FuelNotification);
    };
    */
    const postFuelForm = (value) => {
      this.props.postFuelDay(value.Day, value.Notification);
    };
    const postFuelTime = (value) => {
      let hour = value.getHours();
      let minute = value.getMinutes();
      if (hour < 10) {
        hour = '0' + hour;
      }
      if (minute < 10) {
        minute = '0' + minute;
      }
      const fueltime = hour + '-' + minute;
      console.log('Hey: ' + fueltime);
      this.props.postFuelTime(fueltime);
      hideModal();
    };
    const Form = t.form.Form;

    // This clones the global Form stylesheet.
    const formStylesheet = JSON.parse(JSON.stringify(t.form.Form.stylesheet));

    // Changes background color for Day picker and aligns checkbox to center
    formStylesheet.pickerContainer.normal.backgroundColor = '#fff';
    formStylesheet.checkbox.normal.alignSelf = 'center';

    // Sets the cloned stylesheet as the new stylesheet
    const FormOptions = {
      stylesheet: formStylesheet,
    };

    return (
      <View style={styles.container}>
        <Text
          style={styles.debugColor}
        >
          Current day: {user.FuelDay}
          Current time: {user.FuelTime}
          Current value: {user.FuelNotification.toString()}
        </Text>
        <TouchableOpacity onPress={() => showModal()}>
          <View style={styles.button}>
            <Text>Velg tidspunkt</Text>
          </View>
        </TouchableOpacity>
        <Timepicker
          mode="time"
          isVisible={isShowing}
          onConfirm={postFuelTime}
          onCancel={hideModal}
        />
        <Form
          ref={c => this.form = c}
          type={FuelDay}
          value={{ Day: user.FuelDay, Notification: user.FuelNotification }}
          onChange={postFuelForm}
          options={FormOptions}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.postFuelDayLoading,
    hasErrored: state.postFuelDayFailure,
    hasSucceeded: state.postFuelDaySuccess,
    user: state.auth.user,
    isShowing: state.modals.isShowing,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    postFuelDay: (weekday, toggle) => dispatch(postFuelDay(weekday, toggle)),
    postFuelTime: fueltime => dispatch(postFuelDay(undefined, undefined, fueltime)),
    showModal: () => dispatch(showModal()),
    hideModal: () => dispatch(hideModal()),

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FuelDayForm);

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    height: 30,
    marginTop: 10,
    textAlign: 'center',
    width: 250,
  },
  debugColor: {
    color: 'white',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
