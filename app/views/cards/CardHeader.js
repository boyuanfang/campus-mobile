'use strict'
import React from 'react'

var css = require('../styles/css');

export default class CardHeader extends React.Component {
  render: function() {
    return {
      <View style={css.card_title_container}>
        <Text style={css.card_title}>{this.props.title}</Text>
      </View>
    }
  }
}
