import React, { Component } from 'react';
import t from 'tcomb-form-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { StyleSheet } from 'react-native';
import { Content, Button, Text, View, Spinner } from 'native-base';

import { postDamageReport, getCurrentDamageReport } from '../../actions/damageReportForm';

const Items = [
  {
    ItemType: 'Wheel',
    Damaged: false,
  },
  {
    ItemType: 'Window',
    Damaged: false,
  },
  {
    ItemType: 'CarLight',
    Damaged: false,
  },
  {
    ItemType: 'FrontBumper',
    Damaged: false,
  },
  {
    ItemType: 'BackBumper',
    Damaged: false,
  },
  {
    ItemType: 'RightBodyWork',
    Damaged: false,
  },
  {
    ItemType: 'LeftBodyWork',
    Damaged: false,
  },
];

const styles = StyleSheet.create({
  finnBil: {
    color: 'white',
    fontSize: 18,
    marginBottom: '8%',
  },
  button: {
    alignSelf: 'center',
  },
});


class DamageReportForm extends Component {
  componentDidMount() {
    this.props.getValues();
  }

  handleSubmit() {
    Items[0].Damaged = this.form.getValue().FelgHjul;
    Items[0].Description = this.form.getValue().FelgHjulBeskrivelse;
    Items[1].Damaged = this.form.getValue().Glass;
    Items[1].Description = this.form.getValue().GlassBeskrivelse;
    Items[2].Damaged = this.form.getValue().LysUtvendig;
    Items[2].Description = this.form.getValue().LysUtvendigBeskrivelse;
    Items[3].Damaged = this.form.getValue().StøtfangerFront;
    Items[3].Description = this.form.getValue().StøtfangerFrontBeskrivelse;
    Items[4].Damaged = this.form.getValue().StøtfangerBak;
    Items[4].Description = this.form.getValue().StøtfangerBakBeskrivelse;
    Items[5].Damaged = this.form.getValue().KarosseriHøyre;
    Items[5].Description = this.form.getValue().KarosseriHøyreBeskrivelse;
    Items[6].Damaged = this.form.getValue().KarosseriVenstre;
    Items[6].Description = this.form.getValue().KarosseriVenstreBeskrivelse;
    this.props.changeValues(Items);
  }

  render() {
    if (this.props.isLoading) {
      return (
        <View>
          <Spinner color="white" />
        </View>
      );
    }

    if (this.props.car === 'null') {
      return (
        <View>
          <Text style={styles.finnBil}>Du har ikke registrert en bil enda.. </Text>
          <Button
            bordered
            light
            onPress={() => { this.props.navigate('RegisterCar'); }}
            style={styles.button}
          >
            <Text>Finn din bil</Text>
          </Button>
        </View>
      );
    }

    if (this.props.currentDamageReport.Items) {
      this.Items = this.props.currentDamageReport.Items;
    }

    const formOptions = {
    };
    const Damages = t.struct({
      KarosseriVenstre: t.Boolean,
      KarosseriVenstreBeskrivelse: t.maybe(t.String),
      KarosseriHøyre: t.Boolean,
      KarosseriHøyreBeskrivelse: t.maybe(t.String),
      StøtfangerFront: t.Boolean,
      StøtfangerFrontBeskrivelse: t.maybe(t.String),
      StøtfangerBak: t.Boolean,
      StøtfangerBakBeskrivelse: t.maybe(t.String),
      LysUtvendig: t.Boolean,
      LysUtvendigBeskrivelse: t.maybe(t.String),
      Glass: t.Boolean,
      GlassBeskrivelse: t.maybe(t.String),
      FelgHjul: t.Boolean,
      FelgHjulBeskrivelse: t.maybe(t.String),
    });
    const Form = t.form.Form;
    return (
      <View>
        <Content>
          <Form
            ref={c => this.form = c}
            type={Damages}
            options={formOptions}
            value={this.props.values}
          />
        </Content>
        <Button
          bordered
          light
          style={styles.button}
          onPress={() => {
            this.handleSubmit();
          }}
        >
          <Text> Registrer </Text>
        </Button>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.damageReportForm.isLoading,
    hasErrored: state.damageReportForm.hasErrored,
    currentDamageReport: state.damageReportForm.currentDamageReport,
    values: state.damageReportValues,
    car: state.auth.car,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeValues: ItemArray => dispatch(postDamageReport(ItemArray)),
    getValues: ItemArray => dispatch(getCurrentDamageReport(ItemArray)),
    navigate: (routeName) => {
      dispatch(NavigationActions.navigate({ routeName }));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DamageReportForm);
