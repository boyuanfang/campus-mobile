import {
	TouchableWithoutFeedback,
	View,
	Text,
	TouchableOpacity,
	Platform,
	Button,
	Dimensions,
	Alert
} from 'react-native'
import React from 'react'

import css from '../../../styles/css'
import { getScreenWidth, getScreenHeight } from '../../../util/general'

const WINDOW_WIDTH = getScreenWidth()
const WINDOW_HEIGHT = getScreenHeight()

/**
 * Reusable Component
 * @props choices: Array
 * @props choiceStyle: JSON -- choice text style
 * @props containerStyle: JSON -- container style
 * @props onCancel: function
 * @props onSelect: function
 * @props style: JSON -- left, right, top, bottom
 * @props isTermName: boolean
 */
class DropDown extends React.Component {
	renderItem(item, i) {
		const { webreg_dropdown_defaultContainerText, webreg_dropdown_defaultChoiceText } = css
		const { choiceStyle, containerStyle } = this.props

		if (i === 0) {
			return (
				<TouchableOpacity
					onPress={() => this.props.onSelect(item)}
					key={i}
				>
					<View style={[webreg_dropdown_defaultContainerText, containerStyle, { backgroundColor: '#e1e1e1' }]}>
						<Text style={[webreg_dropdown_defaultChoiceText, choiceStyle, { color: '#034263' }]}>{item}</Text>
					</View>
				</TouchableOpacity>
			)
		}

		return (
			<TouchableOpacity
				onPress={() => this.props.onSelect(item)}
				key={i}
			>
				<View style={[webreg_dropdown_defaultContainerText, containerStyle]}>
					<Text style={[webreg_dropdown_defaultChoiceText, choiceStyle]}>{item}</Text>
				</View>
			</TouchableOpacity>
		)
	}

	render() {
		const {
			choices,
			onCancel,
			style,
			isTermName
		} = this.props

		const {
			webreg_dropdown_background,
			webreg_dropdown_cancelTrigger,
			webreg_dropdown_overlay,
			webreg_dropdown_dialogContainer,
		} = css

		return (
			<View style={[webreg_dropdown_background, {  height: WINDOW_HEIGHT, width: WINDOW_WIDTH }]}>
				<TouchableWithoutFeedback
					onPress={onCancel}
					style={webreg_dropdown_cancelTrigger}
				>
					<View style={[webreg_dropdown_overlay, { height: WINDOW_HEIGHT, width: WINDOW_WIDTH }]} />
				</TouchableWithoutFeedback>
				<View style={[webreg_dropdown_dialogContainer, style]}>
					{choices.map((item, i) => (isTermName ? this.renderItem(item.term_name, i) : this.renderItem(item.term_code, i)))}
				</View>
			</View>
		)
	}
}

DropDown.defaultProps = {
	isTermName: false
}

export default DropDown
