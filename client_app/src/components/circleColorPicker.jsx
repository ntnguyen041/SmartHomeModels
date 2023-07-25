import { Component } from 'react'
import { View, Text } from 'react-native'

import ColorPicker from 'react-native-wheel-color-picker'

class CircleColor extends Component {
	render() {
		return (
			<View style={[]}>
				<ColorPicker
					ref={r => { this.picker = r }}
					color={this.state.currentColor}
					swatchesOnly={this.state.swatchesOnly}
					onColorChange={this.onColorChange}
					onColorChangeComplete={this.onColorChangeComplete}
					thumbSize={40}
					sliderSize={40}
					noSnap={true}
					row={false}
					swatchesLast={this.state.swatchesLast}
					swatches={this.state.swatchesEnabled}
					discrete={this.state.disc}
				/>
				<SomeButton onPress={() => this.picker.revert()} />
			</View>
		)
	}
}

export default App