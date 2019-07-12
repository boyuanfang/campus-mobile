import React from 'react'
import { StatusBar, View } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import { myIndexOf } from '../../../util/schedule'
import css from '../../../styles/css'

// PAGES
import HomePage from './HomePage'
import CourseSearch from './CourseSearch'

import SearchHeader from './SearchHeader'
import DropDown from './DropDown'
import Filter from './Filter'
import { terms } from './mockData/TermMockData.json'

const INITIAL_TERMS = [...terms]

class WebReg extends React.Component {
	constructor(props) {
		super()

		/*
		0 - HomePage
		1 - SearchPage
		*/
		this.state = {
			bodyIndex: 0,
		}
		this.setBodyToRender = this.setBodyToRender.bind(this)
	}

	componentWillMount() {
		this.props.populateClassArray()
		this.props.selectCourse(null, null)
	}

	setBodyToRender(index) {
		this.setState({ bodyIndex: index })
	}

	handleSelectSwitcher = (choice) => {
		const index = myIndexOf(INITIAL_TERMS, choice)
		choice = INITIAL_TERMS[index]
		this.props.showTermSwitcher(false)
		this.props.selectTerm(choice)
	}

	handleCancelSwitcher = () => {
		this.props.showTermSwitcher(false)
	}

	handleCancelSelector = () => {
		this.props.showTermSelector(false)
	}

	handleSelectSelector = (choice) => {
		const index = myIndexOf(INITIAL_TERMS, choice, 'name')
		choice = INITIAL_TERMS[index]
		this.props.showTermSelector(false)
		this.props.selectTerm(choice)
	}

	constructArr() {
		const { selectedTerm } = this.props
		const result = [selectedTerm]
		for (let i = 0; i < INITIAL_TERMS.length; i++) {
			if (INITIAL_TERMS[i].term_code !== selectedTerm.term_code) {
				result.push(INITIAL_TERMS[i])
			}
		}
		return result
	}

	showModal() {
		if (this.props.filterVisible) {
			return (
				<Filter style={{
					position: 'absolute',
					top: this.headerY + this.headerH + 2,
					right: 0,
				}}
				/>
			)
		}
		if (this.props.termSwitcherVisible) {
			return (
				<DropDown
					style={{
						left: (this.searchBarX + this.termSwicherX) - 5,
						width: this.termSwicherW,
						top: (this.headerY + 2),
					}}
					onCancel={this.handleCancelSwitcher}
					onSelect={this.handleSelectSwitcher}
					choices={this.constructArr()}
					choiceStyle={styles.dropDownTextStyle}
					containerStyle={styles.dropDownContainerStyle}
				/>
			)
		}
		if (this.props.termSelectorVisible) {
			return (
				<DropDown
					style={{
						left: (this.containerX + this.selectorX + this.parentX) - 0.5,
						top: (this.containerY + this.selectorY + this.parentY) - 10,
						width: this.selectorWidth
					}}
					onCancel={this.handleCancelSelector}
					onSelect={this.handleSelectSelector}
					choices={this.constructArr()}
					isTermName
				/>
			)
		}
	}

	filterData(text) {
		const { data } = this.props.fullScheduleData
		return data.filter(item => ((item.subject_code + item.course_code).toLowerCase()).includes(text.toLowerCase()))
	}

	_renderBody() {
		switch (this.state.bodyIndex) {
			case 0: return (<HomePage
				initialTerms={INITIAL_TERMS}
				onParent={(event)	=> {
					const { layout } = event.nativeEvent
					this.parentX = layout.x
					this.parentY = layout.y
				}}
				onContainer={(event)	=> {
					const { layout } = event.nativeEvent
					this.containerX = layout.x
					this.containerY = layout.y
				}}
				onSelector={(event)	=> {
					const { layout } = event.nativeEvent
					this.selectorX = layout.x
					this.selectorY = layout.y
					this.selectorWidth = layout.width
				}}
			/>)
			case 1: return <CourseSearch />
			default: <View />
		}
	}

	render() {
		return (
			<SafeAreaView flex style={{ backgroundColor: 'white' }}>
				<StatusBar
					barStyle="dark-content"
				// backgroundColor={COLOR.PRIMARY}
				/>
				<SearchHeader
					initialTerms={INITIAL_TERMS}
					bodyIndex={this.state.bodyIndex}
					setBodyToRender={this.setBodyToRender}
					onLayoutHeader={(event) => {
						const { layout } = event.nativeEvent
						this.headerH = layout.height
						this.headerX = layout.x
						this.headerY = layout.y
					}}
					onLayoutTermSwicher={(event) => {
						const { layout } = event.nativeEvent
						this.termSwicherW = layout.width
						this.termSwicherX = layout.x
						this.termSwicherY = layout.y
					}}
					onSearchBar={(event) => {
						const { layout } = event.nativeEvent
						this.searchBarW = layout.width
						this.searchBarX = layout.x
						this.searchBarY = layout.y
					}}
				/>
				{this._renderBody()}
				{this.showModal()}
			</SafeAreaView>
		)
	}
}

const styles = {
	dropDownTextStyle: {
		textAlign: 'left',
		fontSize: 15,
		paddingLeft: 5,
		paddingRight: 5
	},
	dropDownContainerStyle: {
		flex: 1,
		paddingTop: 5,
		paddingBottom: 5,
	}
}

const mapStateToProps = state => ({
	selectedTerm: state.schedule.selectedTerm,
	filterVisible: state.webreg.filterVisible,
	termSwitcherVisible: state.webreg.termSwitcherVisible,
	termSelectorVisible: state.webreg.termSelectorVisible,
	fullScheduleData: state.schedule.data,
})


const mapDispatchToProps = (dispatch, ownProps) => (
	{
		selectTerm: (selectedTerm) => {
			dispatch({ type: 'SET_SELECTED_TERM', selectedTerm })
		},
		populateClassArray: () => {
			dispatch({ type: 'POPULATE_CLASS' })
		},
		scheduleLayoutChange: ({ y }) => {
			dispatch({ type: 'SCHEDULE_LAYOUT_CHANGE', y })
		},
		selectCourse: (selectedCourse, data) => {
			dispatch({ type: 'SELECT_COURSE', selectedCourse, data })
		},
		showTermSwitcher: (termSwitcherVisible) => {
			dispatch({ type: 'CHANGE_TERM_SWITCHER_VISIBILITY', termSwitcherVisible })
		},
		showTermSelector: (termSelectorVisible) => {
			dispatch({ type: 'CHANGE_TERM_SELECTOR_VISIBILITY', termSelectorVisible })
		}
	}
)


export default connect(mapStateToProps, mapDispatchToProps)(WebReg)
