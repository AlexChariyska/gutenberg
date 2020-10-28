/**
 * External dependencies
 */
import { isEmpty, isNumber } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { parseUnit } from '../unit-control/utils';

export const LABELS = {
	all: __( 'All' ),
	top: __( 'Top' ),
	bottom: __( 'Bottom' ),
	left: __( 'Left' ),
	right: __( 'Right' ),
	mixed: __( 'Mixed' ),
};

export const CUSTOM_VALUES = {
	AUTO: 'auto',
};

export const DEFAULT_VALUES = {
	top: null,
	right: null,
	bottom: null,
	left: null,
};

export const DEFAULT_VISUALIZER_VALUES = {
	top: false,
	right: false,
	bottom: false,
	left: false,
};

export const DEFAULT_VISUALIZER_SPACING_VALUES = {
	padding: DEFAULT_VISUALIZER_VALUES,
	margin: DEFAULT_VISUALIZER_VALUES,
};

export const DEFAULT_SPACING_VALUES = {
	padding: DEFAULT_VALUES,
	margin: DEFAULT_VALUES,
};

/**
 * Gets an items with the most occurance within an array
 * https://stackoverflow.com/a/20762713
 *
 * @param {Array<any>} arr Array of items to check.
 * @return {any} The item with the most occurances.
 */
function mode( arr ) {
	return arr
		.sort(
			( a, b ) =>
				arr.filter( ( v ) => v === a ).length -
				arr.filter( ( v ) => v === b ).length
		)
		.pop();
}

/**
 * Gets the 'all' input value and unit from values data.
 *
 * @param {Object} values Box values.
 * @return {string} A value + unit for the 'all' input.
 */
export function getAllValue( values = {} ) {
	const parsedValues = Object.values( values ).map( parseUnit );

	const allValues = parsedValues.map( ( value ) => value[ 0 ] );
	const allUnits = parsedValues.map( ( value ) => value[ 1 ] );

	const value = allValues.every( ( v ) => v === allValues[ 0 ] )
		? allValues[ 0 ]
		: '';
	const unit = mode( allUnits );

	/**
	 * The isNumber check is important. On reset actions, the incoming value
	 * may be null or an empty string.
	 *
	 * Also, the value may also be zero (0), which is considered a valid unit value.
	 *
	 * isNumber() is more specific for these cases, rather than relying on a
	 * simple truthy check.
	 */
	const allValue = isNumber( value ) ? `${ value }${ unit }` : null;

	return allValue;
}

/**
 * Checks to determine if values are mixed.
 *
 * @param {Object} values Box values.
 * @return {boolean} Whether values are mixed.
 */
export function isValuesMixed( values = {} ) {
	const allValue = getAllValue( values );
	const autoValues = Object.values( values ).every( ( i ) => i === 'auto' );
	const isMixed = isNaN( parseFloat( allValue ) ) && ! autoValues;

	return isMixed;
}

/**
 * Checks to determine if values are defined.
 *
 * @param {Object} values Box values.
 *
 * @return {boolean} Whether values are mixed.
 */
export function isValuesDefined( values ) {
	return (
		values !== undefined &&
		! isEmpty( Object.values( values ).filter( Boolean ) )
	);
}

const sideStyles = {
	margin: {
		top: { transform: 'translateY(-100%)' },
		right: { transform: 'translateX(100%)' },
		bottom: { transform: 'translateY(100%)' },
		left: { transform: 'translateX(-100%)' },
	},
	padding: {
		top: null,
		right: null,
		bottom: null,
		left: null,
	},
};

/**
 * Modifies the style properties of each side.
 *
 * @param {string} type of field
 * @return {function(*, [*, *]): *} reducer function adding additional styles
 */

export function extendStyles( type ) {
	return ( acc, [ side, value ] ) => {
		const styles = sideStyles[ type ][ side ];
		return {
			...acc,
			[ side ]: {
				style: {
					...styles,
					[ side ]: value,
				},
			},
		};
	};
}

/**
 * Checks to determine if passed param includes auto as value
 * and if so returns only the auto string
 *
 * @param {string} value
 *
 * @return {string} Returns the provided value (value * unit) or only an 'auto' string
 */
export function setAutoValue( value ) {
	return value.includes( CUSTOM_VALUES.AUTO ) ? CUSTOM_VALUES.AUTO : value;
}
